/**
 * Patch locales
 *
 * On met dans ce fichier toutes les nouvelles locales qui ne sont pas
 * encore traduites et qui devront l'être.
 */
Object.assign(MESSAGES, {
  'premier':"juste pour virgule"
  // Nouveaux messages à mettre dans les MESSAGES.js

  // À MODIFIER
  , 'github-repo-description': "Description du repo"
  , 'github-repo-description-q': "Quelle description pour ce repo Github ?"
  , 'select-docu-folder-and-ok': 'Créez le dossier et sélectionnez-le dans le Finder, puis “OK”.'
  , 'eval-code-btn': 'Évaluer du code…'
  , 'eval-code-title': 'Évaluer du code'
  , 'eval-code-run-btn': 'Interpréter…'
  , 'eval-code-finish-btn': 'Finir'
  , 'eval-code-running': '…'
  , 'eval-code-make-script-btn': 'En faire un script'
  , 'eval-code-choose-script-folder': 'Sélectionnez le dossier où mettre le script, puis « OK ».'
  , 'eval-code-script-name-title': 'Nom du script'
  , 'eval-code-script-name-q': 'Quel nom pour le script ?'
  , 'eval-code-run-now-title': 'Lancer le script'
  , 'eval-code-run-now-q': 'Lancer le script maintenant ?'
  , 'eval-code-add-service-title': 'Service du projet'
  , 'eval-code-add-service-q': "Faire de ce script un service du projet $1 ?"
  , 'eval-code-service-name-title': 'Nom du bouton'
  , 'eval-code-service-name-q': 'Quel nom pour ce bouton de service ?'

  // Git
  , 'git-commit-all-done': "Tous les fichiers ont été versés sur Github"

})

Object.assign(ERRORS, {
  'premier': "juste pour virgule"
  // Nouveaus messages d'erreur à mettre dans les ERRORS.js

  // File
  , 'file-already-exists-at': "Un fichier existe déjà à cet emplacement : $1"
  , 'unknown-shebang': "$1 n'est pas un langage scriptable directement."
  , 'unrunnable-file': "Le fichier $1 n'est ni exécutable, ni d'un langage connu."

  // Git
  , 'backend-icloud-dataless-files': "Problème de synchro iCloud. Pour les fichiers marqués d'un ⚠️, passer par un Terminal au dossier."
})
