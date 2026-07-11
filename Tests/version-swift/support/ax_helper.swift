// Moteur "swift" : même logique de pilotage AX que Tests/support/ax.applescript
// et Tests/version-pers/support/ax_server.js (recherche par AXDOMIdentifier,
// clic AXPress, etc.), mais en appelant l'API Accessibility (AXUIElement)
// directement en process natif — sans passer par System Events comme
// intermédiaire. Gardé vivant en tâche de fond pour toute la durée d'une
// spec, comme le moteur "pers".
//
// Protocole identique à ax_server.js : une requête JSON par ligne sur stdin
//   {"action":"click","needle":"btn-add-project","extra":""}
// une réponse JSON par ligne sur stdout
//   {"ok":true,"result":"..."}  ou  {"ok":false,"error":"..."}
// Le process s'arrête proprement quand stdin est fermé (EOF).
//
// Nécessite que ce binaire compilé (pas "swiftc" ni "osascript") soit
// autorisé dans Réglages Système > Confidentialité et sécurité >
// Accessibilité — la permission est accordée par chemin de binaire, donc
// spécifique à ce fichier compilé. AXIsProcessTrustedWithOptions avec
// kAXTrustedCheckOptionPrompt déclenche la boîte de dialogue système au
// premier lancement.

import ApplicationServices
import Foundation

struct AXHelperError: Error, CustomStringConvertible {
  let message: String
  var description: String { message }
}

let appName = "Board"
let defaultTimeout: Double = 5

func axAttr(_ elem: AXUIElement, _ attr: String) -> CFTypeRef? {
  var value: CFTypeRef?
  let err = AXUIElementCopyAttributeValue(elem, attr as CFString, &value)
  return err == .success ? value : nil
}

func axChildren(_ elem: AXUIElement) -> [AXUIElement] {
  return axAttr(elem, kAXChildrenAttribute as String) as? [AXUIElement] ?? []
}

func axDomId(_ elem: AXUIElement) -> String? {
  return axAttr(elem, "AXDOMIdentifier") as? String
}

func axRole(_ elem: AXUIElement) -> String? {
  return axAttr(elem, kAXRoleAttribute as String) as? String
}

func axValue(_ elem: AXUIElement) -> String? {
  guard let v = axAttr(elem, kAXValueAttribute as String) else { return nil }
  if let s = v as? String { return s }
  return String(describing: v)
}

func axParent(_ elem: AXUIElement) -> AXUIElement? {
  guard let v = axAttr(elem, kAXParentAttribute as String) else { return nil }
  return (v as! AXUIElement)
}

func axPress(_ elem: AXUIElement) {
  AXUIElementPerformAction(elem, kAXPressAction as CFString)
}

func axSetValue(_ elem: AXUIElement, _ value: String) {
  AXUIElementSetAttributeValue(elem, kAXValueAttribute as CFString, value as CFTypeRef)
}

func collectText(_ elem: AXUIElement) -> String {
  if axRole(elem) == (kAXStaticTextRole as String) {
    return axValue(elem) ?? ""
  }
  var txt = ""
  for kid in axChildren(elem) { txt += collectText(kid) }
  return txt
}

func findByDomId(_ elem: AXUIElement, _ domId: String) -> AXUIElement? {
  if axDomId(elem) == domId { return elem }
  for kid in axChildren(elem) {
    if let found = findByDomId(kid, domId) { return found }
  }
  return nil
}

func findByDomIdPrefix(_ elem: AXUIElement, _ prefix: String) -> AXUIElement? {
  if let id = axDomId(elem), id.hasPrefix(prefix) { return elem }
  for kid in axChildren(elem) {
    if let found = findByDomIdPrefix(kid, prefix) { return found }
  }
  return nil
}

func collectInOrder(_ elem: AXUIElement, _ targetIds: [String], _ out: inout [String]) {
  if let id = axDomId(elem), targetIds.contains(id) { out.append(id) }
  for kid in axChildren(elem) { collectInOrder(kid, targetIds, &out) }
}

// NSWorkspace.shared.runningApplications s'appuie sur des notifications qui
// nécessitent une run loop active pour se tenir à jour ; ce process reste
// bloqué sur une lecture stdin bloquante (aucune run loop pompée), la liste
// peut donc rester périmée juste après un pkill+relance (exactement le
// moment où launch_app est rappelé en cours de spec). "pgrep" en subprocess
// est plus lent par appel mais correct à chaque fois, sans état à rafraîchir.
func boardPid() -> pid_t? {
  let task = Process()
  task.executableURL = URL(fileURLWithPath: "/usr/bin/pgrep")
  task.arguments = ["-x", appName]
  let pipe = Pipe()
  task.standardOutput = pipe
  task.standardError = FileHandle.nullDevice
  guard (try? task.run()) != nil else { return nil }
  task.waitUntilExit()
  let data = pipe.fileHandleForReading.readDataToEndOfFile()
  guard let out = String(data: data, encoding: .utf8)?.trimmingCharacters(in: .whitespacesAndNewlines),
        let firstLine = out.split(separator: "\n").first,
        let pid = pid_t(firstLine) else { return nil }
  return pid
}

func rootWindow() -> AXUIElement? {
  guard let pid = boardPid() else { return nil }
  let appElem = AXUIElementCreateApplication(pid)
  guard let windows = axAttr(appElem, kAXWindowsAttribute as String) as? [AXUIElement], let first = windows.first else { return nil }
  return first
}

func waitForMatch(_ matcher: String, _ needle: String, _ timeoutSeconds: Double) throws -> AXUIElement {
  let start = Date()
  while true {
    if let root = rootWindow() {
      let found = matcher == "prefix" ? findByDomIdPrefix(root, needle) : findByDomId(root, needle)
      if let f = found { return f }
    }
    if Date().timeIntervalSince(start) > timeoutSeconds {
      throw AXHelperError(message: "Timeout : élément introuvable (\(matcher)=\(needle)) après \(timeoutSeconds)s")
    }
    usleep(200_000)
  }
}

func dispatch(_ action: String, _ needle: String, _ extra: String) throws -> String {
  switch action {
  case "click":
    axPress(try waitForMatch("exact", needle, defaultTimeout)); return ""
  case "click-prefix":
    axPress(try waitForMatch("prefix", needle, defaultTimeout)); return ""
  case "set-value":
    axSetValue(try waitForMatch("exact", needle, defaultTimeout), extra); return ""
  case "set-value-prefix":
    axSetValue(try waitForMatch("prefix", needle, defaultTimeout), extra); return ""

  case "get-value":
    return axValue(try waitForMatch("exact", needle, defaultTimeout)) ?? ""
  case "get-value-prefix":
    return axValue(try waitForMatch("prefix", needle, defaultTimeout)) ?? ""

  case "wait-for":
    _ = try waitForMatch("exact", needle, extra.isEmpty ? defaultTimeout : (Double(extra) ?? defaultTimeout)); return "ok"
  case "wait-for-prefix":
    _ = try waitForMatch("prefix", needle, extra.isEmpty ? defaultTimeout : (Double(extra) ?? defaultTimeout)); return "ok"

  case "get-text":
    return collectText(try waitForMatch("exact", needle, defaultTimeout))
  case "get-text-prefix":
    return collectText(try waitForMatch("prefix", needle, defaultTimeout))

  case "exists":
    if let root = rootWindow() {
      return findByDomId(root, needle) != nil ? "true" : "false"
    }
    return "false"

  case "click-parent":
    let el = try waitForMatch("exact", needle, defaultTimeout)
    if let parent = axParent(el) { axPress(parent) }
    return ""
  case "click-parent-prefix":
    let el = try waitForMatch("prefix", needle, defaultTimeout)
    if let parent = axParent(el) { axPress(parent) }
    return ""

  case "order-of":
    let targetIds = needle.split(separator: "\t", omittingEmptySubsequences: false).map(String.init)
    var out: [String] = []
    if let root = rootWindow() { collectInOrder(root, targetIds, &out) }
    return out.joined(separator: "\n")

  default:
    throw AXHelperError(message: "Action inconnue : \(action)")
  }
}

func writeLine(_ s: String) {
  let data = (s + "\n").data(using: .utf8)!
  FileHandle.standardOutput.write(data)
}

func writeResponse(ok: Bool, result: String = "", error: String = "") {
  var obj: [String: Any] = ["ok": ok]
  if ok { obj["result"] = result } else { obj["error"] = error }
  guard let data = try? JSONSerialization.data(withJSONObject: obj) else {
    writeLine("{\"ok\":false,\"error\":\"échec de sérialisation JSON de la réponse\"}")
    return
  }
  writeLine(String(data: data, encoding: .utf8)!)
}

// AXIsProcessTrustedWithOptions avec le prompt actif fait apparaître la
// boîte de dialogue système au premier lancement de CE binaire compilé
// (l'autorisation est liée au chemin de l'exécutable, pas au process
// osascript/System Events déjà autorisé pour les autres moteurs).
let trustOptions = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
let trusted = AXIsProcessTrustedWithOptions(trustOptions)

while let line = readLine(strippingNewline: true) {
  if line.isEmpty { continue }
  guard let data = line.data(using: .utf8),
        let req = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
    writeResponse(ok: false, error: "JSON invalide reçu")
    continue
  }
  if !trusted {
    writeResponse(ok: false, error: "ax_helper non autorisé dans Réglages Système > Confidentialité et sécurité > Accessibilité (chemin du binaire compilé, distinct des autres moteurs)")
    continue
  }
  let action = req["action"] as? String ?? ""
  let needle = req["needle"] as? String ?? ""
  let extra = req["extra"] as? String ?? ""
  do {
    let result = try dispatch(action, needle, extra)
    writeResponse(ok: true, result: result)
  } catch {
    writeResponse(ok: false, error: "\(error)")
  }
}
