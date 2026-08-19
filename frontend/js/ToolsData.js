/**
 * Liste déclarative des outils du panneau "Outils" (ToolsPanel.js).
 * Chaque entrée ici est une ACTION déclenchée directement au clic 
 * (`run`), sans valeur à afficher.
 */
const TOOLS_DATA = [

  {
    /**
     * Programmation d'une alerte
     * --------------------------
     * 
     * On se sert des scripts-services
     */
      id: 'alerte'
      , name: getMsg('schedule-a-alert') 
      , type: 'script_service'
      , steps: [
          {id: 'date-time'  , type: 'date-time', q: getMsg('hour-and-day-of-alert'), title: getMsg('scheduling-alert')}
        , {id: 'message'    , type: 'string', q: getMsg('alert-message'), title: getMsg('scheduling-alert')}
        , {id: 'schedule'   , type: 'alert', message: "${message}", time: "${date-time}", title: getMsg('scheduling-alert')}
        , {id: 'conclusion' , type: 'set', value: getMsg('tools-confirm-scheduling-alert'), title: getMsg('scheduling-alert')}
      ]
  },
  /**
   * Initialisation de Git sur le projet
   * + Définition des labels
   * 
   * RÉFLEXION
   * Un outil devrait pouvoir être défini comme un service. Ça permettrait
   * de passer de l'un à l'autre sans problème.
   */    
  {
    id: 'git-init'
  , name: getMsg('git-init-btn')
  , run: () => Tools.toolGitInit()
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
  },
  {
      id: 'eval-code'
    , name: getMsg('eval-code-btn')
    , run: () => Tools.toolEvalCode()
  }
]