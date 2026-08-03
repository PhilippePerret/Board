/**
 * Ce fichier déinit les données de tous les services
 * C'est-à-dire : 
 * 
 *  CUSTOM_SERVICES_DATA
 *    Services de projet personnalisés, à définir pour chaque projet.
 * 
 *  COMMON_SERVICES_DATA
 *    Services commun à tous les projets (par exemple l'ouverture du dossier
 *    du projet)
 * 
 * Quand on crée un nouveau projet :
 * 
 *  id    Doit correspondre au nom du script dans backend/scripts. Si
 *        l'extension doit être autre chose que .scpt, il faut indiquer
 *        la bonne extension dans :scType.
 *        Si l'on veut utiliser un script tout à fait différent, il faut
 *        l'indiquer dans :script (p.e. 'script: OpenAFile.rb')
 * 
 *  params
 *    Définissent les paramètres du service. Un paramètre avec
 *    persist:false est redemandé à chaque exécution, jamais enregistré.
 *
 *  onError
 *    Pour définir ce qui doit se passer en cas d'erreur. C'est une 
 *    fonction à interpréter.
 *    Souvent, elle doit utiliser un ErrorsDialog pour afficher la
 *    liste des erreurs survenues.
 * 
 * afterDefinedParams
 *    Appelée après la définition des paramètres par exemple pour les
 *    modifier.
 *  
 * bypassExec
 *    Fonction à exécuter avant d'exécuter le service (par exemple un
 *    message d'alerte.)
 *    La fonction reçoit le callback qu'elle doit rappeler.
 * 
 * beforeExec
 *    Peut traiter les paramètres avant l'exécution, pour mettre la 
 *    valeur sous une toute autre forme. 
 *    Voir par exemple l'utilisation pour create-git-issue
 * 
 */


/*******************************************************************/
/**                     SERVICES COMMUNS                          **/
/*******************************************************************/
const COMMON_SERVICES_DATA = [
  {
      id: 'open-folder-project'
    , name: getMsg('open-folder-project')
    , group: 'Outils'
    , params: [
          {id: 'path',  type: 'project'} // propriété qu'on prend au projet courant
        , {id: 'window-bounds', q: 'Régler une fenêtre de Finder aux dimensions/positions voulues puis cliquer “OK”.', type: 'finder-window'}
        , {id: 'sidebar', name: "Réglage de la Sidebar", q: 'Quelle taille donner à la sidebar (mettre 0 pour la cacher) ?', default: 0, type: 'integer'}
      ]
    , afterDefinedParams: (params) => {
      // console.log("[afterDefinedParams] PARAMS AVANT : ", [...params])
      const [pathGroup, boundsGroup, sidebarGroup] = params
      boundsGroup.splice(0, 1)         // retire le path dupliqué (1er élément du groupe finder-window)
      boundsGroup[4] = sidebarGroup[0] // écrase sidebarWidth (index 4 après ce retrait) par la valeur configurée
      // console.log("[afterDefinedParams] PARAMS APRÈS : ", [pathGroup, boundsGroup])
      return [pathGroup, boundsGroup]
    }
  },
  
  {
      id: 'work-clock'
    , name: 'Démarrer l’horloge'
    , group: 'Outils'
    , front: Clock.instance.toggle.bind(Clock.instance)
    , params: [
          {id: 'session-duration', q: 'Durée d’une session de travail (minutes)', type: 'integer', default: 120}
        , {id: 'work-duration', q: 'Durée d’une tranche de travail (minutes)', type: 'integer', useLastAsDefault: true}
      ]
  },

  {
      id: 'create-git-issue'
    , name: "Enregistrer une erreur"
    , group: 'Git'
    , script: 'ExecCommand.sh'
    , params: [
          {id: 'path', type: 'project'}
        , {id: 'issue_title', type: 'string', q: "Erreur :", persist: false}
        , {id: 'issue_body' , type: 'text'  , q: "Description précise de l'erreur :", persist: false}
      ]
    , beforeExec: (dict) => {
        return `cd "${dict.path}" && gh issue create -l bug -t "${dict.issue_title}" -b "${dict.issue_body}"`
      }
  },

  {
      id: 'edit-documentation'
    , name: 'Éditer la documentation'
    , group: 'Documentation'
    , scType: '.rb'
    , params: [
        // Ancienne forme {id: 'docu-folder', absolute: true, q: 'Sélectionner le dossier de documentation dans le Finder', type: 'path'}
        // Nouvelle forme : on récupère la valeur dans le projet, mais si elle n'existe pas
        // on se sert de if_undefined pour la déterminer
          {id: 'docu-folder', type: 'project', if_undefined: {type: 'path', q: 'Sélectionner le dossier de documentation dans le Finder'}}
        , {id: 'documentation-editor', type: 'app'}
      ]
  },
  {
      id: 'update-documentation'
    , name: 'Actualiser la documentation'
    , group: 'Documentation'
    , scType: '.rb'
    , onError: (errors) => {
        const data = {
          title: "Erreur en cours d'actualisation", 
          errors: errors, 
          ouiBtn: {name: 'Corriger', onclick: Service.runService.bind(Service, 'edit-documentation')}
        }
        new ErrorsDialog(data).show()
      }
    , params: [
        {id: 'docu-main-file-adoc', type: 'project', if_undefined: {q: 'Sélectionner le fichier principal de documentation (.adoc)', type: 'path'}}
      ]
  },
  {
      id:   'open-a-file'
    , name: 'Ouvrir la documentation'
    , group: 'Documentation'
    , script: 'OpenOrUpdateInBrowser.scpt'
    , params: [
        {id: 'docu-main-file-html', type: 'project', if_undefined: {q: 'Sélectionner le fichier du manuel (html/pdf', type: 'path'}}
      ]
    , afterDefinedParams: (params) => { 
        params[0] = `file://${params[0]}`
        return params
    }
  },
  {
      id:   'init-documentation'
    , name: "Initier documentation"
    , group: 'Documentation'
    , scType: '.rb'
    , params: [
        {id: 'docu-folder', absolute: true, q:'Sélection le dossier dans lequel placer la documentation, puis “OK”.', type: 'path'}
      ]
  },
  {
      id: 'open-iterm-at-folder'
    , name: 'iTerm au dossier'
    , group: 'Consoles'
    , params: [ 
          {id: 'path', type: 'project'} 
        , {id: 'code', type: 'string', q: 'Code à exécuter à l’ouverture', transient: true}
      ]
  },
  {
      id: 'open-terminal-at-folder'
    , name: 'Terminal au dossier'
    , group: 'Consoles'
    , params: [
          {id: 'path', type: 'project'}
        , {id: 'code', type: 'string', q: 'Code à exécuter à l’ouverture', transient: true}
      ]
  },
  {
      id: 'open-in-vscode'
    , name: 'Ouvrir dans VSCode'
    , group: 'Consoles'
    , scType: '.sh'
    , params: [
        {id: 'path', type: 'project'}
      ]
  },
  {
      id: 'edit-projet'
    , name: "Éditer les données du projet"  
    , group: 'Prudence'
    , script: 'OpenAFile.rb'
    , params: [
        {id: 'card_path', type: 'project'}
      ]
    , afterDefinedParams: (params) => params[0]
    , bypassExec: (callback) => {
        message(true, getMsg('alert-before-edit-projet'))
        const timerbeforeexec = setTimeout(() => {
          clearTimeout(timerbeforeexec)
          callback()
        }, 3000)
      }
  }
]

/*******************************************************************/
/**                     SERVICES PERSONNALISÉS                    **/
/*******************************************************************/
const CUSTOM_SERVICES_DATA = [
  {
      id: 'open-file'
    , name: 'Ouvrir le fichier…'
    , group: getMsg('opening')
    , scType: '.sh'
    , params: [
        {name: "Fichier à ouvrir", id: 'path', type: 'path', q: "Sélection le fichier à ouvrir dans le Finder, puis “Choisir”.", required: true},
        {name: "Application à utiliser", id: 'app', type: 'logiciel', required: true}
      ]
  },

  {
      id: 'open-finder-window'
    , name: 'Ouvrir une fenêtre dans le Finder'
    , group: getMsg('opening')
    /* tag::exemple-fix-param[] */
    , params: [
        {id: 'window', q: null, value: null, type: 'finder-window', required: true},
        {id: 'sidebar', q: "Voulez-vous la sidebar ?", value: null, type: 'boolean', required: false}
      ]
    /* end::exemple-fix-param[] */

    /* tag::exemple-param-order[] */
    , paramsOrder: ['path', 'x', 'y', 'width', 'height', 'sidebar-width', 'type-view', 'show-sidebar']
    /* end::exemple-param-order[] */
  },

  {
      id: 'open-URL'
    , name: 'Ouvrir l’URL…'
    , group: getMsg('opening')
    , params: [
      {id: 'url', q:'Quel URL faut-il rejoindre ?', type: 'url', required: true}
    ]
  },

  {
      id: 'file-versioning'
    , name: 'Versionner un fichier/dossier'
    , group: getMsg('lifecycle')
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true},
        {id: 'archive-folder', type: 'path-or-null', q: 'Sélectionner le dossier archives dans le Finder (ou aucun si le fichier ne doit pas être archivé).'},
        /* tag::exemple-dyn-params[] */
        /* Paramètre à définir au moment du lancement (persist:false => jamais enregistré) */
        {id: 'nature-version', q: 'Quel numéro actualiser ?', value: null, type: 'select', values: [['patch', 'Patch'], ['minor', 'Version mineure'], ['major', 'Version Majeure']], persist: false}
        /* end::exemple-dyn-params[] */
    ]
  },

  {
      id: 'run-chronometre'
    , name: getMsg('countdown-timer')
    , group: getMsg('lifecycle')
    , params: [
        {id: 'save-time', q: getMsg('ask-save-work-time'), type: 'boolean', required: true}     
      ]
  },

  {
      id: 'run-script-service'
    , name: getMsg('run-a-script-service') + aide('scripts-services')
    , group: getMsg('scripts')
    , front: ScriptService.run
    , params: [
        {id: 'script-service-path', q: getMsg('scserv-select-script-in-finder-and-ok'), type: 'path'}
      ]
  },

  {
      id: 'exec-bash-code'
    , name: getMsg('service-exec-bash-code')
    , group: getMsg('scripts')
    , script: 'ExecCommand.sh'
    , params: [
        {id: 'code', q: getMsg('ask-for-code-to-exec'), description: "(en bash/zsh)", type: 'string'}
      ]
  },

  {
      id: 'exec-js-code'
    , name: getMsg('service-exec-js-code')
    , group: getMsg('scripts')
    , front: Service.evalJavascript.bind(Service)
    , params: [
        {id: 'code', q: getMsg('ask-for-code-to-exec'), description: '(en javascript)', type: 'string'}
      ]
  },



  {
      id: 'run-script'
    , name: getMsg('run-a-script')
    , group: getMsg('scripts')
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true}
      ]
  },

 ]

 // Table de lookup par id (O(1)), pour Service#absData
 // dans ALL_SERVICES_DATA à l'exécution.
 const SERVICES_DATA_TABLE = {}

 function defineSomeVolatileProps(s, stype) {
  SERVICES_DATA_TABLE[s.id] = Object.assign({stype: stype}, s)
  if (s.params.some(p => p.transient)) Object.assign(s, {transient: true})
 }

 CUSTOM_SERVICES_DATA.forEach(s => {defineSomeVolatileProps(s, 'custom')})
 COMMON_SERVICES_DATA.forEach(s => {defineSomeVolatileProps(s, 'common')})

 const ALL_SERVICES_DATA = [...CUSTOM_SERVICES_DATA, ...COMMON_SERVICES_DATA]