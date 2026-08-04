const GENRES_PROJETS = [
    'Roman'
  , 'Film'
  , 'Application'
  , 'Jeu'
  , 'Maison'
  , 'Vacances'
]

/**
 * Le type définit la méthode prompt qui sera utilisée pour éditer la valeur
 */
const PROJECT_DATA = [
    {id: 'id'                   , desc: getMsg('data-project-id')         , type: 'string',   default: null   , editable: false}
  , {id: 'title'                , desc: getMsg('data-project-title')      , type: 'string'  , default: null   , editable: true}
  , {id: 'path'                 , desc: getMsg('data-project-folder')     , type: 'path'    , default: null   , editable: true}
  , {id: 'genre'                , desc: getMsg('data-project-nature')     , type: 'select'  , create: getMsg('Other-genre'), default: null   , editable: true, values: GENRES_PROJETS} 
  , {id: 'createdAt'            , desc: getMsg('data-project-createdat')  , type: 'date'    , default: null   , editable: true} 
  , {id: 'updatedAt'            , desc: getMsg('data-project-lastmod')    , type: 'date'    , default: null   , editable: true} 
  , {id: 'workTime'             , desc: getMsg('duration-work-done')      , type: 'integer' , default: 0      , editable: true} 
  , {id: 'background'           , desc: getMsg('background-img-or-color') , type: 'string'  , default: null   , editable: true} 
  , {id: 'icon'                 , desc: getMsg('data-project-icon')       , type: 'icon'    , default: null   , editable: true} 
  , {id: 'docu-folder'          , desc: getMsg('docu-folder')             , type: 'path'    , default: null   , editable: true}
  , {id: 'docu-main-file-adoc'  , desc: getMsg('docu-main-file-name')     , type: 'path'    , default: null   , editable: true}
  , {id: 'docu-main-file-html'  , desc: getMsg('docu-main-disp-file')     , type: 'path'    , default: null   , editable: true}
  , {id: 'todoist_id'           , desc: getMsg('data-project-todoist')    , type: 'string'  , default: null   , editable: false} 
  , {id: 'collapsed'            , desc: getMsg('data-project-standby')    , type: 'boolean' , default: false  , editable: true}
  , {id: 'services'             , editable: false}
  , {id: 'service_data'         , editable: false}
  , {id: 'common_services_data' , editable: false}
  , {id: 'github_account'       , desc: getMsg('data-github-account')     , type: 'string'  , default: null   , editable: true}
  , {id: 'github_labels'        , desc: getMsg('githug-label-desc')       , type: 'string'   , default: null   , editable: true}
]
const TBL_PROJECT_DATA = {}
PROJECT_DATA.forEach(data => Object.assign(TBL_PROJECT_DATA, {[data.id]: data}))