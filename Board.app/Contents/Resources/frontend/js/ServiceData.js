/**
 * Ce fichier déinit les données de tous les services
 */

const SERVICES_DATA = [
  {
      id: 'open-finder-window'
    , name: 'Ouvrir une fenêtre dans le Finder'
    , params: [
        {id: 'window', q: null, value: null, type: 'finder-window', required: true},
        {id: 'sidebar', q: "Voulez-vous la sidebar ?", value: null, type: 'boolean', required: false}
      ]
    , paramsOrder: ['path', 'x', 'y', 'width', 'height', 'sidebar-width', 'type-view', 'show-sidebar']
  },

  {
      id: 'file-versioning'
    , name: 'Versionner un fichier/dossier'
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true}

    ]
      /* Paramètres à définir au moment du lancement */
    , dynParams: [
        {id: 'nature-version', q: 'Quel numéro actualiser ?', value: null, type: 'select', values: [['patch', 'Patch'], ['minor', 'Version mineure'], ['major', 'Version Majeure']]}
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

  {
      id: 'open-folder-project'
    , name: 'Ouvrir projet dans Finder'
    , params: [
        {id: 'window', q: "Disposez le dossier du projet tel que vous le voulez", value: null, type: 'finder-window'}
      , {id: 'sidebar', q: "Voulez-vous la sidebar ?", value: null, type: 'boolean', required: false}
    ]
  }
]