/**
 * Données de réglage de l'application (appdata.json), éditables depuis le
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
const TEXT_EDITORS = [
    'CotEditor'
  , 'Typora'
  , 'TextEdit'
  , 'LibreOffice'
  , 'Word'
  , 'Note.app'
  , 'BBEdit'
]


const APP_DATA = [
    {id: 'documentation-editor',       name: 'Éditeur pour la documentation',       type: 'app',    values: TEXT_EDITORS}
  , {id: 'code-editor',                name: 'Éditeur pour le code',                type: 'app',    values: CODE_EDITORS, default: 'Visual Studio Code'}
  , {id: 'text-editor',                name: 'Éditeur pour les textes simples',     type: 'app',    values: TEXT_EDITORS, default: 'Typora'}
  , {id: 'documentation-folder-name',  name: 'Nom du dossier de documentation',     type: 'string', default: 'Documentation'}
  , {id: 'changelog-file',             name: 'Nom du fichier changelog',            type: 'string', default: 'CHANGELOG.md'}
  , {id: 'todo-file',                  name: 'Nom du fichier TODO',                 type: 'string', default: 'TODO.md'}
  , {id: 'version',                    name: 'Version de l’application',            type: 'string', locked: true}
]
