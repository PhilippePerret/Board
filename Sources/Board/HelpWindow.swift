import Cocoa
import WebKit

// Fenêtre d'aide (manuel) — WKWebView autonome, sans bridge JSON vers
// backend.rb (juste de la lecture, pas d'action à faire tourner côté Ruby).
// Déclenchée depuis le JS par Aide.open(fichier, anchor) (frontend/js/Aide.js),
// via un message handler WKWebView séparé ("openHelp"), pas le canal "bridge" existant.
class HelpWindowController: NSObject, WKScriptMessageHandler {
    static let shared = HelpWindowController()

    private var window: NSWindow?
    private var webView: WKWebView?
    private var currentFichier: String?

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let fichier = body["fichier"] as? String else { return }
        let anchor = body["anchor"] as? String
        openHelp(fichier: fichier, anchor: anchor)
    }

    func openHelp(fichier: String, anchor: String?) {
        let dossierManuel = Bundle.main.bundleURL.appendingPathComponent("Contents/Resources/Manuel")
        let fichierURL = dossierManuel.appendingPathComponent(fichier)

        if let window = window, let webView = webView, currentFichier == fichier {
            window.makeKeyAndOrderFront(nil)
            if let anchor = anchor {
                webView.evaluateJavaScript("location.hash = '\(anchor)';")
            }
            return
        }

        var urlAvecAncre = fichierURL
        if let anchor = anchor {
            var comps = URLComponents(url: fichierURL, resolvingAgainstBaseURL: false)!
            comps.fragment = anchor
            urlAvecAncre = comps.url!
        }

        let vue = webView ?? WKWebView(frame: NSRect(x: 0, y: 0, width: 900, height: 700))
        vue.loadFileURL(urlAvecAncre, allowingReadAccessTo: dossierManuel)
        webView = vue
        currentFichier = fichier

        if let window = window {
            window.makeKeyAndOrderFront(nil)
            return
        }

        let win = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 900, height: 700),
            styleMask: [.titled, .closable, .resizable, .miniaturizable],
            backing: .buffered,
            defer: false
        )
        win.title = "Aide"
        win.contentView = vue
        win.isReleasedWhenClosed = false
        win.center()
        win.makeKeyAndOrderFront(nil)
        window = win
    }
}
