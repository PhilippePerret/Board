const GENRES_PROJETS = [
    'Roman'
  , 'Film'
  , 'Application'
  , 'Jeu'
  , 'Maison'
  , 'Vacances'
]

const PROJECT_DATA = [
    {id: 'id'                   , desc: getMsg('data-project-id')         , type: 'string',   default: null   , editable: false}
  , {id: 'title'                , desc: getMsg('data-project-title')      , type: 'string'  , default: null   , editable: true}
  , {id: 'path'                 , desc: getMsg('data-project-folder')     , type: 'path'    , default: null   , editable: true}
  , {id: 'genre'                , desc: getMsg('data-project-nature')     , type: 'select'  , create: getMsg('Other-genre'), default: null   , editable: true, values: GENRES_PROJETS} 
  , {id: 'createdAt'            , desc: getMsg('data-project-createdat')  , type: 'date'    , default: null   , editable: true} 
  , {id: 'updatedAt'            , desc: getMsg('data-project-lastmod')      , type: 'date'    , default: null   , editable: true} 
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
  , {id: 'github_account'       , desc: 'Compte Github du projet'         , type: 'string'  , default: null   , editable: true}
]
const TBL_PROJECT_DATA = {}
PROJECT_DATA.forEach(data => Object.assign(TBL_PROJECT_DATA, {[data.id]: data}))