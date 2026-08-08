/**
 * Patch locales
 * 
 * On met dans ce fichier toutes les nouvelles locales qui ne sont pas
 * encore traduites et qui devront l'être.
 */
Object.assign(MESSAGES, {
  'premier':"juste pour virgule"
  // Nouveaux messages à mettre dans les MESSAGES.js

  // App
  , 'backend-app-data-save': "Données de l'application sauvées."
  
  // Git
  , 'git-issue-gestion': "Gestion des issues Github"
  , 'backend-add-labels-ajout': " + définition des labels."
  , 'backend-git-ready': "Git préparé pour le dossier"
  , 'backend-git-failed': "git $1 a échoué : $2"

  // File
  , 'backend-file-created': "Le fichier $1 a été créé."

  // Documentation
  , 'backend-docu-opened-in': "Dossier de documentation ouvert avec succès dans $1"

  // Archive
  , 'backend-archiv-move-and-num': "Déplacé dans l'archive et renuméroté $1"
  , 'backend-archiv-saved': "Version sauvegardée en archives."
})

Object.assign.ERRORS, {
  'premier': "juste pour virgule"
  // Nouveaus messages d'erreur à mettre dans les ERRORS.js

  // App
  , 'backend-app-project-unfound': "Projet $1 introuvable dans les archives."
  , 'backend-unknown-action': ":Action inconnue : '$1'."
  , 'backend-access-unabled': "Board n'a pas la permission Accessibilité activée : Réglages Système → Confidentialité et sécurité → Accessibilité → cocher Board."
  , 'backend-command-not-found': "La commande bash '$1' est inconnue."

  // File
  , 'backend-unfound-file': "Fichier introuvable : $1"
  , 'backend-invalid-yaml': "Code YAML invalide ($1) : $2"
  , 'backend-unfound-folder-unable-file': "Le dossier '$1' est introuvable. Impossible de créer le fichier '$2' en toute confiance."
  , 'backend-unable-to-create-file': "Le fichier $1 n'a pas pu être créé."
  , 'backend-no-xml-file': "Pas encore de lecture des fichiers XML."
  , 'backend-version-no-num': "Le fichier $1 ne contient pas de numéro de version, impossible de le versionner."

  // Git
  , 'backend-unabled-labels': "Impossible de récupérer les labels existants : $1"
  , 'backend-already-git': "Git est déjà initialisé pour ce projet."
  , 'backend-unabled-to-destroy-labels': "Impossible de détruire les labels existants : $1"
  , 'backend-unable-to-create-labels': "Impossible de créer les nouveaux labels : $1"
  , 'backend-remote-test-required': "Il faut le git remote de test"
  , 'backend-not-a-git-folder': "Ce dossier n'est pas un dépôt git ($1)." 
  , 'backend-not-a-git-repo': "Le dossier $1 n'est pas un repo Git."
  , 'backend-git-unknown-ope': "Opération Git inconnue : $1"

  // Script
  , 'backend-script-unfound': "Impossible de trouver le script à jouer ($1)"

  // Todoist
  , 'backend-todoist-unfound-project': "Projet « $1 » introuvable dans Todoist."
  , 'backend-task-error': "Tâche $1 : $2"

  // Documentation
  , 'backend-docu-unfound-folder': "Le dossier de documantation '$1' est introuvable."

  // Archives
  , 'backend-archiv-unknown-problem': "Version non archivées suite à un problème inconnu."
  , 'backend-archiv-unfound-folder': "Dossier archives introuvable : $1."


}