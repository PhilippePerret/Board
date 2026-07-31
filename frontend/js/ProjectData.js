const GENRES_PROJETS = [
    'Roman'
  , 'Film'
  , 'Application'
  , 'Jeu'
  , 'Maison'
  , 'Vacances'
]

const PROJECT_DATA = [
    {id: 'id'                   , desc: 'ID du projet'                    , type: 'string',   default: null   , editable: false}
  , {id: 'title'                , desc: 'Titre du projet'                 , type: 'string'  , default: null   , editable: true}
  , {id: 'path'                 , desc: 'Dossier du projet'               , type: 'path'    , default: null   , editable: true}
  , {id: 'genre'                , desc: 'Nature du projet'                , type: 'select'  , default: null   , editable: true, values: GENRES_PROJETS} 
  , {id: 'createdAt'            , desc: 'Date de création'                , type: 'date'    , default: null   , editable: true} 
  , {id: 'updatedAt'            , desc: 'Date dernière modification'      , type: 'date'    , default: null   , editable: true} 
  , {id: 'workTime'             , desc: 'Durée de travail accomplie (mn)' , type: 'integer' , default: 0      , editable: true} 
  , {id: 'background'           , desc: 'Couleur ou image de fond'        , type: 'string'  , default: null   , editable: true} 
  , {id: 'icon'                 , desc: 'Icône du projet'                 , type: 'icon'    , default: null   , editable: true} 
  , {id: 'docu-folder'          , desc: 'Dossier documentation'           , type: 'path'    , default: null   , editable: true}
  , {id: 'docu-main-file-adoc'  , desc: 'Fichier adoc documentation'      , type: 'path'    , default: null   , editable: true}
  , {id: 'docu-main-file-html'  , desc: 'Fichier html documentation'      , type: 'path'    , default: null   , editable: true}
  , {id: 'todoist_id'           , desc: 'ID projet dans Todoist'          , type: 'string'  , default: null   , editable: false} 
  , {id: 'collapsed'            , desc: 'Mise en standby du projet'       , type: 'boolean' , default: false  , editable: true}
  , {id: 'services'             , editable: false}
  , {id: 'service_data'         , editable: false}
  , {id: 'common_services_data' , editable: false}
]
const TBL_PROJECT_DATA = {}
PROJECT_DATA.forEach(data => Object.assign(TBL_PROJECT_DATA, {[data.id]: data}))