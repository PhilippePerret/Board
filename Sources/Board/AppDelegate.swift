import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {

    var window: NSWindow!

    func applicationDidFinishLaunching(_ notification: Notification) {

        NSApp.setActivationPolicy(.regular)

        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "Quitter Board", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        let appMenuItem = NSMenuItem()
        appMenuItem.submenu = appMenu
        let editMenu = NSMenu(title: "Edition")
        editMenu.addItem(withTitle: "Couper", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copier", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Coller", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Tout sélectionner", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        let editMenuItem = NSMenuItem()
        editMenuItem.submenu = editMenu

        let mainMenu = NSMenu()
        mainMenu.addItem(appMenuItem)
        mainMenu.addItem(editMenuItem)
        NSApp.mainMenu = mainMenu

        let contentViewController = ViewController()

        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1000, height: 700),
            styleMask: [.titled, .closable, .resizable, .miniaturizable],
            backing: .buffered,
            defer: false
        )

        // window.center()
        window.contentViewController = contentViewController
        // setFrameAutosaveName APRÈS contentViewController : l'assignation du
        // contentViewController redimensionne la fenêtre selon la vue de
        // ViewController#loadView (taille codée en dur) — si l'autosave est
        // restauré avant, ce redimensionnement écrase la taille restaurée
        // (la position, elle, n'est pas affectée, d'où le symptôme initial :
        // position persistée, taille jamais).
        window.setFrameAutosaveName("MainWindow")
        // POSITIONNEMENT PAR DÉFAUT — premier lancement uniquement
        if UserDefaults.standard.object(forKey: "NSWindow Frame MainWindow") == nil {
            window.setFrameOrigin(NSPoint(x: 600, y: 400))
        }
        window.makeKeyAndOrderFront(nil)
        window.orderFrontRegardless()
        NSApp.activate(ignoringOtherApps: true)

    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}