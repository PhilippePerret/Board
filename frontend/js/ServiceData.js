/**
 * Ce fichier déinit les données de tous les services
 */

const SERVICES_DATA = [
  {
      id: 'open-finder-window'
    , name: 'Ouvrir une fenêtre dans le Finder'
    , params: [
        {id: 'window', q: 'Ouvrez la fenêtre dans le finder, telle que vous la voulez', value: null, type: 'finder-window', required: true},
        {id: 'sidebar', q: "Voulez-vous la sidebar ?", value: null, type: 'boolean', required: false}
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