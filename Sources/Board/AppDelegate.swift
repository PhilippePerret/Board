import Cocoa

class AppDelegate: NSObject, NSApplicationDelegate {

    var window: NSWindow!
    var activityToken: NSObjectProtocol?

    func applicationDidFinishLaunching(_ notification: Notification) {

        NSApp.setActivationPolicy(.regular)
        _ = NativeNotifier.shared
        NativeNotifier.requestAuthorization()

        // Sans ça, macOS met en pause les timers JS de la WKWebView (App Nap)
        // quand Board est masquée (Hide) ou en arrière-plan — les rappels
        // (Reminder.js, setInterval) cessent de se déclencher tant que la
        // fenêtre n'est pas réaffichée. Empêche l'App Nap pour Board sans
        // empêcher le Mac de dormir normalement.
        activityToken = ProcessInfo.processInfo.beginActivity(
            options: .userInitiatedAllowingIdleSystemSleep,
            reason: "Rappels actifs même app masquée"
        )

        // Menu App standard (identique à ce que génère un template Xcode
        // normal) : À propos, Réglages (cmd+,), Services, Masquer/Masquer
        // les autres/Tout afficher (cmd+H / alt+cmd+H), Quitter.
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "À propos de Board", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        // Réglages (cmd+,) : ouvre pour l'instant App.editConfigData (données
        // app, pas vraiment des "réglages") — brancher autre chose plus tard
        // ne touchera que cette ligne, pas le menu Swift.
        let prefsItem = NSMenuItem(title: "Réglages…", action: #selector(openPreferences(_:)), keyEquivalent: ",")
        prefsItem.target = self
        appMenu.addItem(prefsItem)
        appMenu.addItem(NSMenuItem.separator())
        let servicesMenu = NSMenu(title: "Services")
        NSApp.servicesMenu = servicesMenu
        appMenu.addItem(withTitle: "Services", action: nil, keyEquivalent: "").submenu = servicesMenu
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Masquer Board", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthersItem = NSMenuItem(title: "Masquer les autres", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)
        appMenu.addItem(withTitle: "Tout afficher", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Quitter Board", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        let appMenuItem = NSMenuItem()
        appMenuItem.submenu = appMenu

        let editMenu = NSMenu(title: "Edition")
        editMenu.addItem(withTitle: "Annuler", action: Selector(("undo:")), keyEquivalent: "z")
        let redoItem = NSMenuItem(title: "Rétablir", action: Selector(("redo:")), keyEquivalent: "z")
        redoItem.keyEquivalentModifierMask = [.command, .shift]
        editMenu.addItem(redoItem)
        editMenu.addItem(NSMenuItem.separator())
        editMenu.addItem(withTitle: "Couper", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copier", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Coller", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Tout sélectionner", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        let editMenuItem = NSMenuItem()
        editMenuItem.submenu = editMenu

        let windowMenu = NSMenu(title: "Fenêtre")
        windowMenu.addItem(withTitle: "Réduire", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Zoomer", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")
        windowMenu.addItem(NSMenuItem.separator())
        windowMenu.addItem(withTitle: "Tout ramener au premier plan", action: #selector(NSApplication.arrangeInFront(_:)), keyEquivalent: "")
        let windowMenuItem = NSMenuItem()
        windowMenuItem.submenu = windowMenu
        NSApp.windowsMenu = windowMenu

        let mainMenu = NSMenu()
        mainMenu.addItem(appMenuItem)
        mainMenu.addItem(editMenuItem)
        mainMenu.addItem(windowMenuItem)
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

    @objc func openPreferences(_ sender: Any?) {
        (window.contentViewController as? ViewController)?.openPreferences()
    }
}