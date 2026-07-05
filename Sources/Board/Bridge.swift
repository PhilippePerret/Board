import Foundation
import WebKit

class Bridge: NSObject, WKScriptMessageHandler {

    let backend: Backend
    let sendToJavascript: (String) -> Void

    init(backend: Backend, sendToJavascript: @escaping (String) -> Void) {
        self.backend = backend
        self.sendToJavascript = sendToJavascript
    }

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard message.name == "bridge" else { return }

        guard let body = message.body as? [String: Any],
              let data = try? JSONSerialization.data(withJSONObject: body),
              let jsonString = String(data: data, encoding: .utf8)
        else {
            return
        }

        backend.run(json: jsonString) { [weak self] response in
            self?.sendToJavascript(response)
        }
    }
}