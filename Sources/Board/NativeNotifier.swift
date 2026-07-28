import Cocoa
import UserNotifications

class NativeNotifier: NSObject {

    static let shared = NativeNotifier()
    private var floatingPanels: [NSPanel] = []

    static func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    static func handle(request: [String: Any], completion: @escaping (String) -> Void) {
        let id = request["id"] as? String ?? ""
        let mode = request["mode"] as? String ?? "modal"
        let title = request["title"] as? String ?? ""
        let message = request["message"] as? String ?? ""
        let icon = request["icon"] as? String
        let delay = request["delay"] as? Double
        let buttons = parseButtons(request["buttons"] as? [[String]])
        let bounds = parseBounds(request["bounds"] as? [String: Any])
        print("[NativeNotifier] handle mode=\(mode) title=\(title) message=\(message) bounds=\(String(describing: bounds))")

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
            shared.showFloating(title: title, message: message, icon: icon, delay: delay, buttons: buttons, bounds: bounds) { clicked in
                respond(button: clicked)
            }
        default:
            respond(error: "mode inconnu : \(mode)")
        }
    }

    private static func parseButtons(_ raw: [[String]]?) -> [(label: String, value: String?)] {
        (raw ?? []).map { arr in (label: arr[0], value: arr.count > 1 ? arr[1] : nil) }
    }

    private static func parseBounds(_ bounds: [String: Any]?) -> NSRect? {
        guard let bounds = bounds,
              let position = bounds["position"] as? [Double], position.count == 2,
              let size = bounds["size"] as? [Double], size.count == 2
        else { return nil }
        return NSRect(x: position[0], y: position[1], width: size[0], height: size[1])
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

    private func showFloating(title: String, message: String, icon: String?, delay: Double?, buttons: [(label: String, value: String?)], bounds: NSRect?, completion: @escaping (String?) -> Void) {
        let panel = NSPanel(
            contentRect: bounds ?? NSRect(x: 0, y: 0, width: 320, height: 120),
            styleMask: [.titled, .closable, .nonactivatingPanel, .utilityWindow],
            backing: .buffered,
            defer: false
        )
        panel.title = title
        panel.level = .floating
        panel.isFloatingPanel = true
        panel.hidesOnDeactivate = false

        let stack = NSStackView()
        stack.orientation = .vertical
        stack.alignment = .centerX
        stack.spacing = 10
        stack.edgeInsets = NSEdgeInsets(top: 14, left: 14, bottom: 14, right: 14)
        stack.translatesAutoresizingMaskIntoConstraints = false

        if let img = NativeNotifier.resolveIcon(icon) {
            let imageView = NSImageView(image: img)
            imageView.translatesAutoresizingMaskIntoConstraints = false
            imageView.widthAnchor.constraint(equalToConstant: 32).isActive = true
            imageView.heightAnchor.constraint(equalToConstant: 32).isActive = true
            stack.addArrangedSubview(imageView)
        }

        let label = NSTextField(wrappingLabelWithString: message)
        label.alignment = .center
        stack.addArrangedSubview(label)

        var finished = false
        func finish(_ button: String?) {
            guard !finished else { return }
            finished = true
            panel.close()
            self.floatingPanels.removeAll { $0 == panel }
            completion(button)
        }

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

        panel.contentView = stack
        if let bounds = bounds {
            panel.setFrame(bounds, display: false)
        } else {
            let fit = stack.fittingSize
            print("[NativeNotifier] stack.fittingSize =", fit)
            panel.setContentSize(fit)
            panel.center()
        }
        print("[NativeNotifier] panel.frame =", panel.frame, "isVisible before order:", panel.isVisible)
        panel.orderFrontRegardless()
        print("[NativeNotifier] panel.isVisible after order:", panel.isVisible)

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
