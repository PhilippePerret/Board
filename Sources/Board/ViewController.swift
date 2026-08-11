import Cocoa
import WebKit

class ViewController: NSViewController, WKNavigationDelegate {

    private var webView: WKWebView!
    private var backend: Backend!

    override func loadView() {
        self.view = NSView(frame: NSRect(x: 0, y: 400, width: 1600, height: 700))
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let config = WKWebViewConfiguration()
        let controller = WKUserContentController()

        backend = Backend()

        let bridge = Bridge(
            backend: backend,
            sendToJavascript: { [weak self] json in
                guard let self = self else { return }

                let escaped = json
                    .replacingOccurrences(of: "\\", with: "\\\\")
                    .replacingOccurrences(of: "'", with: "\\'")
                    .replacingOccurrences(of: "\n", with: "\\n")

                DispatchQueue.main.async {
                    self.webView.evaluateJavaScript(
                        "window.bridge.receive('\(escaped)');"
                    )
                }
            }
        )

        controller.add(bridge, name: "bridge")
        controller.add(HelpWindowController.shared, name: "openHelp")
        config.userContentController = controller

        webView = WKWebView(frame: .zero, configuration: config)
        webView.translatesAutoresizingMaskIntoConstraints = false

        if #available(macOS 13.3, *) {
            webView.isInspectable = true
        } else {
            config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        }

        view.addSubview(webView)

        webView.navigationDelegate = self

        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "frontend")!

        webView.loadFileURL(
            url,
            allowingReadAccessTo: URL(fileURLWithPath: "/")
        )

        // App masquée (Hide) : WKWebView suspend les timers JS des pages non
        // visibles (occlusion, indépendant de l'App Nap déjà traité côté
        // AppDelegate) — Reminder.js#poll ne se déclenche plus tout seul, ET
        // même quand on le relance depuis l'hôte (evaluateJavaScript, qui lui
        // s'exécute normalement), le postMessage que Notifier.notify utilise
        // pour parler au natif reste en attente tant que la page est masquée
        // — la notification n'arrivait donc qu'au moment de la réactivation.
        // Ici, on contourne ce postMessage bloqué : les rappels dus renvoient
        // directement leurs données via la valeur de retour d'evaluateJavaScript
        // (qui, elle, arrive normalement), et c'est Swift qui affiche le
        // panneau, sans passer par ce canal.
        Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            guard NSApp.isHidden else { return }
            let pollJS = """
            (function(){
              var results = [];
              Reminder.asArray().forEach(function(r){
                var now = new Date();
                if (r.time <= now) {
                  if (DateUtils.close(r.time, now, 60)) {
                    if (r.execCount % 3 === 0) {
                      var raw = r.dataNotifierByType(r.type);
                      var prepared = Notifier._ensure_data(Object.assign({}, raw));
                      results.push(prepared);
                      if (r.onDue) r.onDue();
                    }
                    r.execCount++;
                  } else {
                    Reminder.remove(r);
                  }
                }
              });
              Reminder.count > 0 || Reminder.stop();
              return JSON.stringify(results);
            })()
            """
            self.webView.evaluateJavaScript(pollJS) { result, error in
                guard let json = result as? String, let jsonData = json.data(using: .utf8) else {
                    Debug.log("poll natif : réponse inattendue=\(String(describing: result)) erreur=\(String(describing: error))")
                    return
                }
                guard let items = (try? JSONSerialization.jsonObject(with: jsonData)) as? [[String: Any]] else { return }
                Debug.log("poll natif : \(items.count) rappel(s) dû(s)")
                for request in items {
                    NativeNotifier.handle(request: request) { _ in }
                }
            }
        }
    }

    // N'ouvrir le socket du moteur de test "pont" qu'une fois index.html
    // chargé : sinon le socket accepte des connexions avant que le DOM
    // existe, et un premier click() de test peut tomber sur un
    // document.getElementById introuvable (course socket/chargement page).
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        TestBridge.shared.attach(webView: webView)
    }
}