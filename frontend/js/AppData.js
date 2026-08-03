/**
 * Données de réglage de l'application (appdata.yaml), éditables depuis le
 * panneau ouvert en cliquant sur le nom de l'application
 *
 * Comportement volontairement plus simple que CUSTOM_SERVICES_DATA/
 * COMMON_SERVICES_DATA (frontend/js/ServiceData.js) : la plupart du temps
 * juste une valeur string, ou une valeur choisie dans une liste fixe
 * (type 'app').
 */

// Liste commune aux 3 réglages de type 'app' (éditeurs)
const CODE_EDITORS = [
    'Visual Studio Code'
  , 'Sublime Text'
  , 'TextMate'
  , 'CotEditor'
  , 'BBEdit'
  , 'Xcode'
  , 'Nova'
  , 'Zed'
  , 'Atom'
  , 'IntelliJ IDEA'
  , 'WebStorm'
]
const YAML_EDITORS = [
    'YAML Editor'
  , 'CotEditor'
  , 'Typora'
] 
const TEXT_EDITORS = [
    'CotEditor'
  , 'Typora'
  , 'TextEdit'
  , 'LibreOffice'
  , 'Word'
  , 'Note.app'
  , 'BBEdit'
]

const BROWSERS = [
    'Firefox'
  , 'Safari'
  , 'Google Chrome'
  , 'Edge'
  , 'Thor'
]

/**
 * Propriétés de CONFIG
 */
const APP_DATA = [
    {id: 'default-browser'            , name: getMsg('default-browser')           , type: 'select'    , values : BROWSERS }
  , {id: 'code-editor'                , name: getMsg('code-editor')               , type: 'select'    , values: CODE_EDITORS}
  , {id: 'text-editor'                , name: getMsg('text-simple-editor')        , type: 'select'    , values: TEXT_EDITORS}
  , {id: 'yaml-editor'                , name: getMsg('yaml-editor')               , type: 'select'    , values: [...YAML_EDITORS, ...CODE_EDITORS]}
  , {id: 'documentation-editor'       , name: getMsg('docu-editor')               , type: 'select'    , values: TEXT_EDITORS}
  , {id: 'docu-folder-name'           , name: getMsg('docu-folder-name')          , type: 'string'    , default: getMsg('Documentation') }
  , {id: 'docu-main-edit-file'        , name: getMsg('docu-main-file-name')       , type: 'string'    , default: 'docu.adoc'}
  , {id: 'docu-main-disp-file'        , name: getMsg('docu-main-disp-file')       , type: 'string'    , default: 'docu.html'}
  , {id: 'changelog-file'             , name: getMsg('changelog-file-name')       , type: 'string'    , default: 'CHANGELOG.md' }
  , {id: 'todo-file'                  , name: getMsg('todo-file-name')            , type: 'string'    , default: 'TODO.md'}
  , {id: 'version'                    , name: getMsg('app-version')               , type: 'string'    , locked: true}
  , {id: 'remember-last-project'      , name: getMsg('remember-last-project')     , type: 'boolean'   , default: false}
  , {id: 'last-project'               , name: getMsg('last-project-id')           , type: 'string'    , default: null , editable: false}
]

const TBL_APP_DATA = {}
APP_DATA.forEach(prop => Object.assign(TBL_APP_DATA, {[prop.id]: prop}))

class AppData {


  static get(propId){ 
    var propAbsData
    if (prop?.id) {
      prop = prop.id
      propAbsData = prop
    } else {
      propAbsData = TBL_APP_DATA[propId]
    }
    return App.getData(propId) ?? propAbsData.default ?? ''
  }
  
  
  static update(prop, value){

  }
}