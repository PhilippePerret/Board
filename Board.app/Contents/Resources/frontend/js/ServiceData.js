/**
 * Ce fichier déinit les données de tous les services
 */

const SERVICES_DATA = [
 {
      id: 'open-folder-project'
    , name: 'Ouvrir projet dans Finder'
    , params: [
        {id: 'window', q: "Disposez le dossier du projet tel que vous le voulez", value: null, type: 'finder-window'}
      , {id: 'sidebar', q: "Voulez-vous la sidebar ?", value: null, type: 'boolean', required: false}
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
      id: 'open-terminal'
    , name: 'Ouvrir un Terminal au dossier du projet'
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