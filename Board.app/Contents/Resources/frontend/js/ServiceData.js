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
 */


/*******************************************************************/
/**                     SERVICES COMMUNS                          **/
/*******************************************************************/
const COMMON_SERVICES_DATA = [
  {
      id: 'open-folder-project'
    , name: 'Ouvrir dossier du projet'
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
    , front: Clock.open.bind(Clock)
    , params: [
          {id: 'session-duration', q: 'Durée d’une session de travail (minutes)', type: 'integer', default: 120}
        , {id: 'work-duration', q: 'Durée d’une tranche de travail (minutes)', type: 'integer', useLastAsDefault: true}
      ]
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
    , afterDefined: (params) => { 
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
  }
]

/*******************************************************************/
/**                     SERVICES PERSONNALISÉS                    **/
/*******************************************************************/
const CUSTOM_SERVICES_DATA = [
  {
      id: 'open-file'
    , name: 'Ouvrir le fichier…'
    , scType: '.sh'
    , params: [
        {name: "Fichier à ouvrir", id: 'path', type: 'path', q: "Sélection le fichier à ouvrir dans le Finder, puis “Choisir”.", required: true},
        {name: "Application à utiliser", id: 'app', type: 'logiciel', required: true}
      ]
  },

  {
      id: 'open-finder-window'
    , name: 'Ouvrir une fenêtre dans le Finder'
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
      id: 'file-versioning'
    , name: 'Versionner un fichier/dossier'
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true},
        {id: 'archive-folder', type: 'path-or-null', q: 'Sélectionner le dossier archives dans le Finder (ou aucun si le fichier ne doit pas être archivé).'}
    ]
    /* Paramètres à définir au moment du lancement */
    /* tag::exemple-dyn-params[] */
    , dynParams: [
        {id: 'nature-version', q: 'Quel numéro actualiser ?', value: null, type: 'select', values: [['patch', 'Patch'], ['minor', 'Version mineure'], ['major', 'Version Majeure']]}
      ] 
    /* end::exemple-dyn-params[] */
  },

  {
      id: 'open-URL'
    , name: 'Ouvrir l’URL…'
    , params: [
      {id: 'url', q:'Quel URL faut-il rejoindre ?', type: 'url', required: true}
    ]
  },

  {
      id: 'run-chronometre'
    , name: "Chronomètre"
    , params: [
        {id: 'save-time', q: 'Faut-il enregistrer le temps de travail ?', type: 'boolean', required: true}     
      ]
  },

  {
      id: 'run-script'
    , name: 'Jouer un script'
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