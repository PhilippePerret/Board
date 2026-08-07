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

        guard let body = message.body as? [String: Any] else { return }

        guard JSONSerialization.isValidJSONObject(body) else {
            // Ne JAMAIS interpoler "body" ici : si l'objet JS contient une
            // référence circulaire (raison la plus probable d'un échec de
            // isValidJSONObject avec NaN/Infinity), décrire "body" via
            // string interpolation part en récursion infinie côté
            // NSDictionary/NSArray.description -> crash natif (stack
            // overflow, déjà observé). On journalise seulement les clés,
            // jamais les valeurs.
            let keys = body.keys.sorted().joined(separator: ", ")
            print("Bridge: message ignoré, body non JSON-valide (NaN/Infinity/référence circulaire ?) — clés : \(keys)")
            return
        }

        guard let data = try? JSONSerialization.data(withJSONObject: body),
              let jsonString = String(data: data, encoding: .utf8)
        else {
            return
        }

        if let action = body["action"] as? String, action == "notify" {
            NativeNotifier.handle(request: body) { [weak self] response in
                self?.sendToJavascript(response)
            }
            return
        }

        backend.run(json: jsonString) { [weak self] response in
            self?.sendToJavascript(response)
        }
    }
}