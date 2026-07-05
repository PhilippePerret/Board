import Cocoa
import WebKit

class ViewController: NSViewController {

    private var webView: WKWebView!
    private var backend: Backend!

    override func loadView() {
        self.view = NSView(frame: NSRect(x: 0, y: 0, width: 1000, height: 700))
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
        config.userContentController = controller

        webView = WKWebView(frame: .zero, configuration: config)
        webView.translatesAutoresizingMaskIntoConstraints = false

        if #available(macOS 13.3, *) {
            webView.isInspectable = true
        } else {
            config.preferences.setValue(true, forKey: "developerExtrasEnabled")
        }

        view.addSubview(webView)

        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "frontend")!

        webView.loadFileURL(
            url,
            allowingReadAccessTo: url.deletingLastPathComponent()
        )
    }
}