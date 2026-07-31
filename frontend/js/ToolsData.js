/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Chaque entrée ici est une ACTION déclenchée directement au clic 
 * (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [
    {
        id: 'app-window-bounds'
      , name: 'Taille et position de fenêtre…'
      , run: () => Tools.toolGetWindowBounds()
    }
]