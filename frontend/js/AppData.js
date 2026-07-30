/**
 * Données de réglage de l'application (appdata.yaml), éditables depuis le
 * panneau ouvert en cliquant sur "Tableau de bord" (AppDataPanel).
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
    {id: 'documentation-editor'       , name: 'Éditeur pour la documentation'     , type: 'select'    , values: TEXT_EDITORS}
  , {id: 'default-browser'            , name: 'Navigateur par défaut'             , type: 'select'    , values : BROWSERS }
  , {id: 'code-editor'                , name: 'Éditeur pour le code'              , type: 'select'    , values: CODE_EDITORS}
  , {id: 'text-editor'                , name: 'Éditeur pour les textes simples'   , type: 'select'    , values: TEXT_EDITORS}
  , {id: 'yaml-editor'                , name: 'Éditeur pour fichiers YAML'        , type: 'select'    , values: [...YAML_EDITORS, ...CODE_EDITORS]}
  , {id: 'documentation-folder-name'  , name: 'Nom du dossier de documentation'   , type: 'string'    , default: 'Documentation'  }
  , {id: 'changelog-file'             , name: 'Nom du fichier changelog'          , type: 'string'    , default: 'CHANGELOG.md' }
  , {id: 'todo-file'                  , name: 'Nom du fichier TODO'               , type: 'string'    , default: 'TODO.md'}
  , {id: 'version'                    , name: 'Version de l’application'          , type: 'string'    , locked: true}
  , {id: 'remember-last-projet'       , name: 'Se souvenir du dernier projet'     , type: 'boolean'   , default: false}
  , {id: 'last-project'               , name: 'Dernier project sélectionné'       , type: 'string'    , default: null}
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