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
const APP_DATA_EDITORS = [
    'Visual Studio Code'
  , 'Sublime Text'
  , 'TextMate'
  , 'BBEdit'
  , 'Xcode'
  , 'Typora'
  , 'TextEdit'
  , 'Nova'
  , 'Zed'
  , 'Atom'
  , 'IntelliJ IDEA'
  , 'WebStorm'
  , 'Finder'
]

const APP_DATA = [
    {id: 'version',                    name: 'Version de l’application',            type: 'string', locked: true}
  , {id: 'documentation-editor',       name: 'Éditeur pour la documentation',       type: 'app',    values: APP_DATA_EDITORS}
  , {id: 'code-editor',                name: 'Éditeur pour le code',                type: 'app',    values: APP_DATA_EDITORS, default: 'Visual Studio Code'}
  , {id: 'text-editor',                name: 'Éditeur pour les textes simples',     type: 'app',    values: APP_DATA_EDITORS, default: 'Typora'}
  , {id: 'documentation-folder-name',  name: 'Nom du dossier de documentation',     type: 'string', default: 'Documentation'}
  , {id: 'changelog-file',             name: 'Nom du fichier changelog',            type: 'string', default: 'CHANGELOG.md'}
  , {id: 'todo-file',                  name: 'Nom du fichier TODO',                 type: 'string', default: 'TODO.md'}
]
