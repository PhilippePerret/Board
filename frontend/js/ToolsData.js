/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Chaque entrée ici est une ACTION déclenchée directement au clic 
 * (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [

  {
    // On se sert des scripts-services
      id: 'alerte'
      , name: "Programmer une alerte"
      , type: 'script_service'
      , steps: [
          {id: 'date-time'  , type: 'date-time', q: "Heure de l'alerte (et jour si plus tard)", title: "Programmation d'alerte"}
        , {id: 'message'    , type: 'string', q: "Message de l'alerte", title: "Programmation d'alerte"}
        , {id: 'schedule'   , type: 'alert', message: "${message}", title: "Alerte programmée", time: "${date-time}", title: "Programmation d'alerte"}
        , {id: 'conclusion' , type: 'set', value: getMsg('tools-confirm-scheduling-alert'), title: "Programmation d'alerte"}
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