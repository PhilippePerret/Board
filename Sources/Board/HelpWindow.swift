import Cocoa
import WebKit

// Fenêtre d'aide (manuel) — WKWebView autonome, sans bridge JSON vers
// backend.rb (juste de la lecture, pas d'action à faire tourner côté Ruby).
// Déclenchée par le lien #help-link (frontend/js/app.js), via un message
// handler WKWebView séparé ("openHelp"), pas le canal "bridge" existant.
class HelpWindowController: NSObject, WKScriptMessageHandler {
    static let shared = HelpWindowController()

    private var window: NSWindow?

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        openHelp()
    }

    func openHelp() {
        if let window = window {
            window.makeKeyAndOrderFront(nil)
            return
        }

        let repoRoot = Bundle.main.bundleURL.deletingLastPathComponent()
        let manuelURL = repoRoot.appendingPathComponent("_dev/Manuel/Manuel.html")

        let webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 900, height: 700))
        webView.loadFileURL(manuelURL, allowingReadAccessTo: manuelURL.deletingLastPathComponent())

        let win = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 900, height: 700),
            styleMask: [.titled, .closable, .resizable, .miniaturizable],
            backing: .buffered,
            defer: false
        )
        win.title = "Aide"
        win.contentView = webView
        win.isReleasedWhenClosed = false
        win.center()
        win.makeKeyAndOrderFront(nil)
        window = win
    }
}
