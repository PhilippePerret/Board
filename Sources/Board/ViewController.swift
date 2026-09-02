import Cocoa
import WebKit

class ViewController: NSViewController, WKNavigationDelegate {

    private var webView: WKWebView!
    private var backend: Backend!
    // Rappels déjà affichés par le poll natif (cf. viewDidLoad) — évite de
    // réafficher le même rappel à chaque tick tant que l'app reste masquée.
    private var natifRemindersDejaAffiches: Set<String> = []

    // Cible provisoire du menu Réglages (cmd+,, AppDelegate) — données app,
    // pas de vrais réglages pour l'instant. À rebrancher ailleurs plus tard
    // sans toucher au menu Swift.
    func openPreferences() {
        webView.evaluateJavaScript("App.editConfigData()")
    }

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

        // App masquée (Hide) : WKWebView suspend tout son process WebContent
        // tant que la fenêtre est totalement invisible (occlusion,
        // indépendant de l'App Nap déjà traité côté AppDelegate) —
        // Reminder.js#poll ne se déclenche plus, ET une évaluation de JS
        // demandée depuis l'hôte (evaluateJavaScript) reste elle aussi en
        // attente tant que la page est masquée, donc la notification
        // n'arrivait qu'au moment de la réactivation (issue #53). Ici, on
        // ne passe plus du tout par le JS de la page : on relit directement
        // les rappels persistés sur le disque (via le process Ruby du
        // backend, indépendant de la WKWebView) et c'est Swift qui affiche
        // le panneau.
        //
        // Alignement sur la minute pile (comme Reminder.js#run côté JS,
        // qui calibre son setInterval sur la prochaine minute pleine) :
        // sans ça, ce timer démarré à l'instant du lancement de l'app
        // tique toutes les 60s à partir de CET instant, donc décalé de
        // ses propres secondes — un rappel programmé pour 10:07:00 pile
        // n'était détecté qu'à 10:07:<secondes de lancement de l'app>.
        let msDansLaMinute = Int(Date().timeIntervalSince1970 * 1000) % 60000
        let delaiAvantMinutePile = Double(60000 - msDansLaMinute) / 1000.0
        DispatchQueue.main.asyncAfter(deadline: .now() + delaiAvantMinutePile) { [weak self] in
            self?.pollRemindersSiMasque()
            Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
                self?.pollRemindersSiMasque()
            }
        }
    }

    private func pollRemindersSiMasque() {
        guard NSApp.isHidden else { return }
        self.backend.run(json: #"{"action":"reminders-due"}"#) { [weak self] output in
            guard let self = self else { return }
            guard let jsonData = output.data(using: .utf8),
                  let retour = (try? JSONSerialization.jsonObject(with: jsonData)) as? [String: Any],
                  let items = retour["data"] as? [[String: Any]]
            else {
                Debug.log("poll natif : réponse inattendue=\(output)")
                return
            }
            Debug.log("poll natif : \(items.count) rappel(s) dû(s)")
            for reminder in items {
                let cle = [
                    reminder["taskId"] as? String ?? "",
                    reminder["projectId"] as? String ?? "",
                    reminder["message"] as? String ?? "",
                    reminder["time"] as? String ?? ""
                ].joined(separator: "|")
                guard !self.natifRemindersDejaAffiches.contains(cle) else { continue }
                self.natifRemindersDejaAffiches.insert(cle)

                var request: [String: Any] = [
                    "mode": "floating",
                    "title": reminder["title"] as? String ?? "",
                    "message": reminder["message"] as? String ?? "",
                    // Sans delay, le panneau ne se ferme jamais tout seul,
                    // reste dans floatingPanels (NativeNotifier) et bloque
                    // alors tout Hide ultérieur (reorderFloatingPanels le
                    // réaffiche aussitôt) — cf. incident constaté.
                    "delay": reminder["delay"] as? Double ?? 60
                ]
                if let icon = reminder["icon"] as? String {
                    request["icon"] = icon
                }
                if let boutons = reminder["buttons"] as? [[String: Any]] {
                    request["buttons"] = boutons.map { [$0["name"] as? String ?? ""] }
                }
                NativeNotifier.handle(request: request) { _ in }
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