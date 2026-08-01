/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Chaque entrée ici est une ACTION déclenchée directement au clic 
 * (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [

  // TODO : EN FAIT, ICI, ON VA SE SERVIR DES SCRIPTS-SERVICES
  {
      id: 'alerte'
      , script_service: [
          {title: 'Date et heure', id: 'date-time', type: 'date-time', q: "Date et heure de l'alerte"}
        , {title: "Message", id: 'message', type: 'string', q: "Message à donner"}
      ]
  },
  // {
  //     id: 'alert'
  //   , name: "Programmer une alerte"
  //   , run: () => Tools.toolScheduleAlert()
  // },
  {
      id: 'app-window-bounds'
    , name: 'Taille et position de fenêtre…'
    , run: () => Tools.toolGetWindowBounds()
  }
]