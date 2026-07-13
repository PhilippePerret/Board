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
    , params: [
          {id: 'path',  type: 'project'} // propriété qu'on prend au projet courant
        , {id: 'window-bounds', q: 'Régler une fenêtre de Finder aux dimensions/positions voulues puis cliquer “OK”.', type: 'bounds'}
      ]
  },
  {
      id: 'work-clock'
    , name: 'Démarrer l’horloge'
    , frontMethod: Clock.open.bind(Clock)
    , params: [
          {id: 'session-duration', q: 'Durée d’une session de travail (minutes)', type: 'integer'}
        , {id: 'work-duration', q: 'Durée d’une tranche de travail (minutes)', type: 'integer', useLastAsDefault: true}
      ]
  },
  {
      id: 'edit-documentation'
    , name: 'Éditer la documentation'
    , scType: '.rb'
    , params: [
          {id: 'docu-folder', q: 'Sélectionner le dossier de documentation dans le Finder', type: 'path'}
        , {id: 'documentation-editor', type: 'app'}
      ]
  },
  {
      id: 'update-documentation'
    , name: 'Actualiser la documentation'
    , scType: '.rb'
    , params: [
        {id: 'docu-main-file', q: 'Sélectionner le fichier principal de documentation (.adoc)', type: 'path'}
      ]
  },
  {
      id:   'open-a-file'
    , name: 'Ouvrir la documentation'
    , params: [
        {id: 'docu-main-file', q: 'Sélectionner le fichier du manuel (html/pdf', type: 'path'}
      ]
  },
  {
      id: 'open-iterm-at-folder'
    , name: 'Iterm au dossier'
    , script: 'ExecCommand.sh'
    , params: [
        {id: 'path', type: 'project'}
      ]
  },
  {
      id: 'open-terminal-at-folder'
    , name: 'Terminal au dossier'
    , params: [
        {id: 'path', type: 'project'}
      ]
  },
  {
      id: 'open-in-vscode'
    , name: 'Ouvrir dans VSCode'
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
      id: 'open-terminal'
    , name: 'Ouvrir un Terminal au dossier du projet'
    , scType: '.rb'
    , params: []
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