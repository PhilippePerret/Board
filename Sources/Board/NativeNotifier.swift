import Cocoa
import WebKit
import UserNotifications

private class HTMLClickBridge: NSObject, WKScriptMessageHandler {
    let onClick: (String?) -> Void
    init(onClick: @escaping (String?) -> Void) { self.onClick = onClick }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        onClick(message.body as? String)
    }
}

class NativeNotifier: NSObject {

    static let shared = NativeNotifier()
    private var floatingPanels: [NSPanel] = []

    private override init() {
        super.init()
        // Cmd+H (Hide) masque TOUTES les fenêtres de l'app, panneaux flottants
        // compris (hidesOnDeactivate = false ne protège que de la simple perte
        // de focus, pas du Hide explicite) — on les réaffiche de force juste
        // après, indépendamment de l'état masqué de l'app.
        NotificationCenter.default.addObserver(
            self, selector: #selector(reorderFloatingPanels),
            name: NSApplication.didHideNotification, object: nil
        )
    }

    @objc private func reorderFloatingPanels() {
        guard !floatingPanels.isEmpty else { return }
        NSApp.unhideWithoutActivation()
        floatingPanels.forEach { $0.orderFrontRegardless() }
    }

    static func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    static func handle(request: [String: Any], completion: @escaping (String) -> Void) {
        let id = request["id"] as? String ?? ""
        let mode = request["mode"] as? String ?? "modal"
        let title = request["title"] as? String ?? ""
        let message = request["message"] as? String ?? ""
        let icon = request["icon"] as? String
        let html = request["html"] as? String
        let delay = request["delay"] as? Double
        let buttons = parseButtons(request["buttons"] as? [[String]])
        let position = parsePosition(request["position"] as? [Double])
        let size = parseSize(request["size"] as? [Double])

        func respond(button: String? = nil, error: String? = nil) {
            var payload: [String: Any] = ["ok": error == nil, "id": id]
            if let error = error {
                payload["error"] = error
            } else {
                var data: [String: Any] = [:]
                if let button = button { data["button"] = button }
                payload["data"] = data
            }
            guard let jsonData = try? JSONSerialization.data(withJSONObject: payload),
                  let str = String(data: jsonData, encoding: .utf8)
            else { return }
            completion(str)
        }

        switch mode {
        case "notification":
            showNotification(title: title, message: message, icon: icon)
            respond()
        case "modal":
            let clicked = showModal(title: title, message: message, icon: icon, buttons: buttons)
            respond(button: clicked)
        case "floating":
            shared.showFloating(title: title, message: message, icon: icon, html: html, delay: delay, buttons: buttons, position: position, size: size) { clicked in
                respond(button: clicked)
            }
        default:
            respond(error: "mode inconnu : \(mode)")
        }
    }

    private static func parseButtons(_ raw: [[String]]?) -> [(label: String, value: String?)] {
        (raw ?? []).map { arr in (label: arr[0], value: arr.count > 1 ? arr[1] : nil) }
    }

    private static func parsePosition(_ position: [Double]?) -> NSPoint? {
        guard let position = position, position.count == 2 else { return nil }
        return NSPoint(x: position[0], y: position[1])
    }

    private static func parseSize(_ size: [Double]?) -> NSSize? {
        guard let size = size, size.count == 2 else { return nil }
        return NSSize(width: size[0], height: size[1])
    }

    private static func resolveIcon(_ icon: String?) -> NSImage? {
        guard let icon = icon else { return nil }
        if icon.contains("/") || icon.contains(".") {
            return NSImage(contentsOfFile: icon)
        }
        return NSImage(systemSymbolName: icon, accessibilityDescription: nil)
    }

    // MARK: - notification (banner système)

    private static func showNotification(title: String, message: String, icon: String?) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = message
        content.sound = .default
        if let icon = icon, icon.contains("/"),
           let attachment = try? UNNotificationAttachment(identifier: UUID().uuidString, url: URL(fileURLWithPath: icon)) {
            content.attachments = [attachment]
        }
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }

    // MARK: - modal (bloquant)

    private static func showModal(title: String, message: String, icon: String?, buttons: [(label: String, value: String?)]) -> String? {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = message
        if let img = resolveIcon(icon) { alert.icon = img }
        let pairs = buttons.isEmpty ? [(label: "OK", value: nil)] : buttons
        for pair in pairs {
            alert.addButton(withTitle: pair.label)
        }
        let response = alert.runModal()
        let index = response.rawValue - NSApplication.ModalResponse.alertFirstButtonReturn.rawValue
        return pairs.indices.contains(index) ? pairs[index].value : nil
    }

    // MARK: - floating (non bloquant)

    private func showFloating(title: String, message: String, icon: String?, html: String?, delay: Double?, buttons: [(label: String, value: String?)], position: NSPoint?, size: NSSize?, completion: @escaping (String?) -> Void) {
        let initialSize = size ?? NSSize(width: 320, height: 120)
        let panel = NSPanel(
            contentRect: NSRect(origin: position ?? .zero, size: initialSize),
            styleMask: [.nonactivatingPanel, .utilityWindow],
            backing: .buffered,
            defer: false
        )
        panel.level = .floating
        panel.isFloatingPanel = true
        panel.hidesOnDeactivate = false
        panel.isOpaque = false
        panel.backgroundColor = .clear

        var finished = false
        func finish(_ button: String?) {
            guard !finished else { return }
            finished = true
            panel.close()
            self.floatingPanels.removeAll { $0 == panel }
            completion(button)
        }

        func finalizeFrame(fittingSize: NSSize?) {
            if size == nil, let fittingSize = fittingSize {
                panel.setContentSize(fittingSize)
            }
            if let position = position {
                panel.setFrameOrigin(position)
            } else {
                panel.center()
            }
            print("[NativeNotifier] position reçue =", String(describing: position), "size reçue =", String(describing: size), "frame finale =", panel.frame)
        }

        if let html = html {
            let controller = WKUserContentController()
            let bridge = HTMLClickBridge(onClick: finish)
            controller.add(bridge, name: "notifClick")
            let config = WKWebViewConfiguration()
            config.userContentController = controller
            let webView = WKWebView(frame: .zero, configuration: config)
            webView.setValue(false, forKey: "drawsBackground")
            webView.translatesAutoresizingMaskIntoConstraints = false
            let baseURL = Bundle.main.resourceURL?.appendingPathComponent("frontend")
            webView.loadHTMLString(html, baseURL: baseURL)
            panel.contentView = webView
            finalizeFrame(fittingSize: nil)
            if NSApp.isHidden { NSApp.unhideWithoutActivation() }
            panel.orderFrontRegardless()
            floatingPanels.append(panel)
            if let delay = delay {
                DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                    finish(nil)
                }
            }
            return
        }

        let stack = NSStackView()
        stack.orientation = .vertical
        stack.alignment = .centerX
        stack.spacing = 4
        stack.edgeInsets = NSEdgeInsets(top: 6, left: 8, bottom: 6, right: 8)
        stack.translatesAutoresizingMaskIntoConstraints = false
        stack.wantsLayer = true
        stack.layer?.backgroundColor = NSColor.windowBackgroundColor.cgColor
        stack.layer?.cornerRadius = 10
        stack.layer?.masksToBounds = true

        if let img = NativeNotifier.resolveIcon(icon) {
            let imageView = NSImageView(image: img)
            imageView.translatesAutoresizingMaskIntoConstraints = false
            imageView.widthAnchor.constraint(equalToConstant: 20).isActive = true
            imageView.heightAnchor.constraint(equalToConstant: 20).isActive = true
            stack.addArrangedSubview(imageView)
        }

        let label = NSTextField(wrappingLabelWithString: message)
        label.alignment = .center
        label.font = NSFont.systemFont(ofSize: 11)
        stack.addArrangedSubview(label)

        if !buttons.isEmpty {
            let buttonsStack = NSStackView()
            buttonsStack.orientation = .horizontal
            buttonsStack.spacing = 8
            for pair in buttons {
                let btn = NSButton(title: pair.label, target: nil, action: nil)
                btn.target = self
                btn.action = #selector(floatingButtonClicked(_:))
                buttonClosures[ObjectIdentifier(btn)] = { finish(pair.value) }
                buttonsStack.addArrangedSubview(btn)
            }
            stack.addArrangedSubview(buttonsStack)
        }

        let container = NSView()
        container.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: container.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: container.centerYAnchor)
        ])
        panel.contentView = container
        finalizeFrame(fittingSize: stack.fittingSize)
        if NSApp.isHidden { NSApp.unhideWithoutActivation() }
        panel.orderFrontRegardless()

        floatingPanels.append(panel)

        if let delay = delay {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                finish(nil)
            }
        }
    }

    private var buttonClosures: [ObjectIdentifier: () -> Void] = [:]

    @objc private func floatingButtonClicked(_ sender: NSButton) {
        buttonClosures[ObjectIdentifier(sender)]?()
    }
}
