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
  , 'action-on-checked-issues': "Sélectionnez les issues à traiter et choisissez l'action."
  
  // Verbes
  , 'View': "Afficher"

  // App
  , 'app-launching': "Initialisation de l'application…"
  , 'init-projects-services-and-reminders': "Initialisation des projets, services et des rappels…"
  , 'app-backup-running': "Sauvegarde de sécurité…"
  , 'app-ready': "Application prête."
  , 'app-backup-discrepancy-title': "Grande différence de données"
  , 'app-backup-discrepancy-intro': "Grande différence de données :"
  , 'app-backup-projects-diff': "$1 projet$3 précédemment, $2 maintenant"
  , 'app-backup-services-diff': "$1 service$3 précédemment, $2 maintenant"
  , 'app-backup-confirm-btn': "Je confirme"
  , 'app-backup-restore-btn': "Revenir au backup précédent"

  // Git
  , 'github-pr-cycle-init': "Initier le PR Cycle Github"
  , 'github-pr-cycle-commit': "PR Cycle - Commiter"

  , 'github-pr-cycle-branch-name': "Nom de la branche de développement à créer"
  , 'github-pr-cycle-commit-title': "Titre de ce commit"
  , 'github-pr-cycle-commit-body': "Corps de texte de ce commit (peut rester vide)"
  , 'github-pr-cycle-inited': "Github PR Cycle initié pour $1."
  , 'git-pr-cycle-branche': "Nom de la branche d'un Cycle PR Github."

})

Object.assign(ERRORS, {
  'premier': "juste pour virgule"
  // Nouveaus messages d'erreur à mettre dans les ERRORS.js

  // App
  , 'backend-app-backup-failed': "Le backup quotidien a échoué."
  , 'backend-app-backup-no-previous': "Aucun backup précédent disponible."
  , 'backend-app-backup-restore-failed': "La restauration du backup précédent a échoué."

  // Git
  , 'git-status-not-clean': "Le statut de Git n'est pas clean."
  , 'git-status-not-empty': "Des fichiers/dossiers restent à commiter."
  , 'git-branch-not-main': "On devrait se trouver sur la branche main."

  // Services
  , 'project-data-invalid-bad-count': "Les données du projet $1 pour le service $2 sont invalides. $3 donnée$5 attendue$5, $4 donnée$6 fournie$6."
})
