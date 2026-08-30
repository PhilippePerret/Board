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
  , 'git-commit-all-done': "Tous les fichiers ont été versés sur Github."

  // File
  , 'create-a-file': "Créer un fichier"
  , 'ask-path-to-file-in-folder': 'Chemin d’accès au fichier :\n\n(relatif au dossier du projet, et tous les nouveaux dossiers seront créés)'
  , 'ask-file-content': "Contenu du fichier :"

  // Rechargement des données persistantes du projet
  , 'reload-project-data-title': "Recharger les données persistantes du projet"
  , 'edit-projet-reload-hint': "Pour recharger les données modifiées, cliquez sur l'outil $1"
  , 'project-data-reloaded': "Données de « $1 » rechargées."

  // Recherche dans la documentation
  , 'search-documentation': "Rechercher…"
  , 'search-type-q': "Type de recherche :"
  , 'search-type-any': "Texte quelconque"
  , 'search-type-target': "Cible : [[...]]"
  , 'search-type-link': "Lien : <<...>>"
  , 'search-text-q': "Texte à rechercher (expression régulière possible) :"
  , 'search-results-title': "Résultats de la recherche"
  , 'search-results-query': "Recherche : $1"
  , 'search-results-empty': "Aucun résultat."
  , 'search-results-close-btn': "Fermer"
  , 'backend-search-done': "$1 résultat(s) trouvé(s)."

  // Recherche dans le projet
  , 'search-project': "Rechercher dans le projet…"
  , 'excluded-folders-q': "Dossiers à exclure de la recherche (séparés par une virgule) :"
  , 'choose-folder-btn': "Dossier…"
  , 'extensions-q': "Extensions de fichiers à rechercher (aucune cochée = toutes) :"
  , 'search-results-count-one': " ($1 occurrence)"
  , 'search-results-count-many': " ($1 occurrences)"

  // Création d'issue Git (create-git-issue, gh-issue-create)
  , 'gh-issue-created': "Issue #$1 bien enregistrée."
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

  // Recherche dans la documentation
  , 'backend-search-invalid-regex': "Expression régulière invalide : $1 ($2)"

  // Recherche dans le projet
  , 'backend-search-project-unfound-folder': "Le dossier du projet '$1' est introuvable."
  , 'excluded-folder-outside-project': "Ce dossier n'est pas un sous-dossier du projet — sélection ignorée."
})
