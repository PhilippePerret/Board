import Foundation

class Backend {

    // Le lancement du process Ruby + la lecture de sa sortie sont bloquants
    // (readDataToEndOfFile, synchrone — cf. doc Apple). userContentController
    // (Bridge.swift), qui appelle run(), tourne sur le thread principal (doc
    // WebKit) : sans ce dispatch, tout rendu de la WKWebView reste gelé
    // jusqu'à la fin du script backend, y compris un Spinner.start() déclenché
    // juste avant côté JS. La completion (déclenche evaluateJavaScript, API
    // WebKit) est renvoyée sur le thread principal.
    func run(json: String, completion: @escaping (String) -> Void) {
        DispatchQueue.global(qos: .userInitiated).async {
            let process = Process()
            let pipeIn = Pipe()
            let pipeOut = Pipe()
            let pipeErr = Pipe()

            let scriptPath = Bundle.main.resourcePath! + "/backend/backend.rb"
            process.executableURL = URL(fileURLWithPath: Bundle.main.resourcePath! + "/ruby/bin/ruby")
            process.arguments = [scriptPath]

            process.currentDirectoryURL = URL(fileURLWithPath: Bundle.main.resourcePath! + "/backend")
            process.environment = ProcessInfo.processInfo.environment.merging(
                ["LANG": "en_US.UTF-8", "LC_ALL": "en_US.UTF-8"]
            ) { _, new in new }
            process.standardInput = pipeIn
            process.standardOutput = pipeOut
            process.standardError = pipeErr

            func finish(_ json: String) {
                DispatchQueue.main.async { completion(json) }
            }

            do {
                try process.run()
            } catch {
                finish("""
                {"ok": false, "error": "failed to start ruby"}
                """)
                return
            }

            // write input
            if let data = (json + "\n").data(using: .utf8) {
                pipeIn.fileHandleForWriting.write(data)
                pipeIn.fileHandleForWriting.closeFile()
            }

            // read output
            let outData = pipeOut.fileHandleForReading.readDataToEndOfFile()
            let errData = pipeErr.fileHandleForReading.readDataToEndOfFile()

            let output = String(data: outData, encoding: .utf8) ?? ""

            if output.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                // Le process Ruby a planté avant d'écrire son retour JSON (ex.
                // exception non rattrapée par le rescue générique de backend.rb,
                // comme une LoadError/SyntaxError/Psych::DisallowedClass). Sans
                // ça, le JS ne recevait qu'une chaîne vide et un message muet.
                let errOutput = String(data: errData, encoding: .utf8) ?? "(pas de détail disponible)"
                var requestId = ""
                if let reqData = json.data(using: .utf8),
                   let obj = try? JSONSerialization.jsonObject(with: reqData) as? [String: Any],
                   let id = obj["id"] as? String {
                    requestId = id
                }
                let errorPayload: [String: Any] = [
                    "ok": false,
                    "id": requestId,
                    "error": "Le process Ruby a planté avant de répondre :\n\(errOutput)"
                ]
                if let data = try? JSONSerialization.data(withJSONObject: errorPayload),
                   let str = String(data: data, encoding: .utf8) {
                    finish(str)
                } else {
                    finish("""
                    {"ok": false, "error": "Le process Ruby a planté (détail illisible)."}
                    """)
                }
                return
            }

            finish(output)
        }
    }
}