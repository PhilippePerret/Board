// Fenêtre plein écran affichée pendant toute la durée d'une suite de tests
// ("ne rien toucher pendant les tests"), sans barre de titre, sans bouton,
// texte en capitales, gardée vivante via un process séparé piloté par une
// FIFO (cf. Tests/version-*/run_tests.sh) : une ligne "SET <texte>" change
// le texte affiché, "QUIT" (ou la fermeture du flux d'entrée) termine le
// process et fait disparaître la fenêtre.
//
// ignoresMouseEvents + canBecomeKey/canBecomeMain à false + activationPolicy
// .accessory : ne vole jamais le focus clavier/souris (les clics AX des
// moteurs de test ne passent pas par de vrais événements souris, donc rien
// à perturber), n'apparaît pas dans le Dock.

import Cocoa

final class OverlayWindow: NSWindow {
  override var canBecomeKey: Bool { false }
  override var canBecomeMain: Bool { false }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)

guard let screen = NSScreen.main else { exit(1) }

let window = OverlayWindow(contentRect: screen.frame, styleMask: [.borderless], backing: .buffered, defer: false)
window.level = .screenSaver
window.backgroundColor = NSColor.black.withAlphaComponent(0.85)
window.isOpaque = false
window.hasShadow = false
window.ignoresMouseEvents = true
window.collectionBehavior = [.canJoinAllSpaces, .stationary, .fullScreenAuxiliary, .ignoresCycle]

let label = NSTextField(labelWithString: "")
label.font = NSFont.boldSystemFont(ofSize: 72)
label.textColor = .white
label.alignment = .center
label.translatesAutoresizingMaskIntoConstraints = false
window.contentView?.addSubview(label)
NSLayoutConstraint.activate([
  label.centerXAnchor.constraint(equalTo: window.contentView!.centerXAnchor),
  label.centerYAnchor.constraint(equalTo: window.contentView!.centerYAnchor),
])

func setText(_ s: String) {
  DispatchQueue.main.async {
    label.stringValue = s.uppercased()
  }
}

window.orderFrontRegardless()

let stdinSource = DispatchSource.makeReadSource(fileDescriptor: FileHandle.standardInput.fileDescriptor, queue: .global())
var buffer = ""
stdinSource.setEventHandler {
  let data = FileHandle.standardInput.availableData
  if data.isEmpty {
    DispatchQueue.main.async { app.terminate(nil) }
    return
  }
  guard let chunk = String(data: data, encoding: .utf8) else { return }
  buffer += chunk
  while let range = buffer.range(of: "\n") {
    let line = String(buffer[..<range.lowerBound])
    buffer.removeSubrange(buffer.startIndex..<range.upperBound)
    if line == "QUIT" {
      DispatchQueue.main.async { app.terminate(nil) }
    } else if line.hasPrefix("SET ") {
      setText(String(line.dropFirst(4)))
    }
  }
}
stdinSource.resume()

app.run()
