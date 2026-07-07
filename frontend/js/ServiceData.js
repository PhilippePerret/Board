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
    , params: [
        {id: 'path', value: null, type: 'path', required: true},
        {id: 'app', value: null, type: 'app', required: false}
      ]
  },

  {
      id: 'open-folder-project'
    , name: 'Ouvrir projet dans Finder'
    , params: [
      {id: 'window', value: null, type: 'finder-window'}
    ]
  }
]