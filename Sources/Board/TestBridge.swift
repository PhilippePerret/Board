import Foundation
import WebKit
import Network

// Moteur de test "pont" : canal direct entre le process Ruby des tests et le
// JS de la WKWebView (aucun passage par l'accessibilité/System Events).
// Inactif en usage normal — ne démarre que si BOARD_TEST_BRIDGE_SOCKET est
// présent dans l'environnement (positionné par Tests/version-pont/run_tests.sh).
//
// Protocole : une requête JSON par ligne sur le socket Unix
//   {"js":"document.getElementById('btn-add-project').click()"}
// une réponse JSON par ligne
//   {"ok":true,"result":"..."}  ou  {"ok":false,"error":"..."}
// "result" est la valeur renvoyée par le JS évalué, telle quelle (chaîne,
// vide si le JS ne renvoie rien).
final class TestBridge {
    static let shared = TestBridge()

    private weak var webView: WKWebView?
    private var listener: NWListener?

    func attach(webView: WKWebView) {
        self.webView = webView
        guard let socketPath = ProcessInfo.processInfo.environment["BOARD_TEST_BRIDGE_SOCKET"] else { return }
        unlink(socketPath)

        let parameters = NWParameters.tcp
        parameters.requiredLocalEndpoint = NWEndpoint.unix(path: socketPath)

        guard let listener = try? NWListener(using: parameters) else { return }
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in
            connection.start(queue: .main)
            self?.receiveLine(on: connection, buffer: Data())
        }
        listener.start(queue: .main)
    }

    private func receiveLine(on connection: NWConnection, buffer: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, isComplete, error in
            guard let self = self else { return }
            var buffer = buffer
            if let data = data, !data.isEmpty {
                buffer.append(data)
            }
            while let newlineIndex = buffer.firstIndex(of: 0x0A) {
                let lineData = buffer.subdata(in: buffer.startIndex..<newlineIndex)
                buffer.removeSubrange(buffer.startIndex...newlineIndex)
                self.handleLine(lineData, on: connection)
            }
            if isComplete || error != nil {
                connection.cancel()
                return
            }
            self.receiveLine(on: connection, buffer: buffer)
        }
    }

    private func handleLine(_ data: Data, on connection: NWConnection) {
        guard let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let js = obj["js"] as? String else {
            send(ok: false, result: nil, error: "requête invalide (champ \"js\" manquant)", on: connection)
            return
        }
        webView?.evaluateJavaScript(js) { [weak self] result, error in
            guard let self = self else { return }
            if let error = error {
                self.send(ok: false, result: nil, error: "\(error)", on: connection)
            } else {
                // Un booléen JS revient en NSNumber : "\(nsNumber)" donne "1"/"0",
                // pas "true"/"false" — à intercepter avant le cas générique, sinon
                // toute comparaison à "true" côté Ruby échoue silencieusement.
                let resultText: String
                if let b = result as? Bool {
                    resultText = b ? "true" : "false"
                } else if let s = result as? String {
                    resultText = s
                } else if let r = result {
                    resultText = "\(r)"
                } else {
                    resultText = ""
                }
                self.send(ok: true, result: resultText, error: nil, on: connection)
            }
        }
    }

    private func send(ok: Bool, result: String?, error: String?, on connection: NWConnection) {
        var obj: [String: Any] = ["ok": ok]
        if ok { obj["result"] = result ?? "" } else { obj["error"] = error ?? "erreur inconnue" }
        guard var data = try? JSONSerialization.data(withJSONObject: obj) else { return }
        data.append(0x0A)
        connection.send(content: data, completion: .contentProcessed { _ in })
    }
}
