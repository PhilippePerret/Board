/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Contrairement à APP_DATA/PROJECT_EXTRA_DATA (SidePanelDefiner : clic sur
 * la ligne -> édite une valeur persistée), chaque entrée ici est une
 * ACTION déclenchée directement au clic (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [
    {
        id: 'app-window-bounds'
      , name: 'Taille et position de la fenêtre d’une application'
      , run: () => Tools.getAppWindowBounds()
    }
]
