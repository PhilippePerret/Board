/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Chaque entrée ici est une ACTION déclenchée directement au clic 
 * (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [

  // TODO : EN FAIT, ICI, ON VA SE SERVIR DES SCRIPTS-SERVICES
  {
      id: 'alerte'
      , name: "Programmer une alerte"
      , type: 'script_service'
      , steps: [
          {id: 'date-time', type: 'date-time', q: "Heure de l'alerte (et jour si plus tard)"}
        , {id: 'message', type: 'string', q: "Message de l'alerte"}
        , {id: 'conclusion', type: 'set', value: getMsg('tools-confirm-scheduling-alert')}
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