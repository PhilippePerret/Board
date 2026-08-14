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
  , 'github-pr-cycle-init': "PR Cycle Github – Initier"
  , 'github-pr-cycle-commit': "PR Cycle Github – Commiter"
  , 'github-pr-cycle-submit': "PR Cycle Github – Soumettre"
  , 'github-pr-cycle-confirming-submit': "Confirmation de la soumission."
  , 'github-pr-cycle-confirm-submit': "Êtes-vous sûr de confirmer la soumission des fichiers commités pour générer une Pull Request Github ?\n\nTrès vraisemblabement, cette PR va entrainer un lancement de tests (Github Action) et peut-être une actualisation de site ou d'application. Confirmez donc en toute connaissance de cause."
  , 'github-pr-cycle-submission-ok': "Soumission de Pull-Request effectuée avec succès !"

  , 'github-pr-cycle-branch-name': "Nom de la branche de développement à créer"
  , 'github-pr-cycle-commit-title': "Titre de ce commit"
  , 'github-pr-cycle-commit-body': "Corps de texte de ce commit (peut rester vide)"
  , 'github-pr-cycle-inited': "Github PR Cycle initié pour $1."
  , 'git-pr-cycle-branche': "Nom de la branche d'un Cycle PR Github."
  , 'git-title-conflict-errors-section': "<div class=title>Problèmes de conflit</div>"
  , 'git-title-syntax-errors-section': "<div class=title>Problèmes de syntaxe détectés</div>"

})

Object.assign(ERRORS, {
  'premier': "juste pour virgule"
  // Nouveaus messages d'erreur à mettre dans les ERRORS.js

  // App
  , 'backend-app-backup-failed': "Le backup quotidien a échoué."
  , 'backend-app-backup-no-previous': "Aucun backup précédent disponible."
  , 'backend-app-backup-restore-failed': "La restauration du backup précédent a échoué."

  // File
  , 'unknown-syntax-file-extension': 'Extension non répertoriée dans la table de vérification : $1.'

  // Git
  , 'git-commit-title-erros': "Erreurs survenues au cours du commit"
  , 'git-status-not-clean': "Le statut de Git n'est pas clean."
  , 'git-status-not-empty': "Des fichiers/dossiers restent à commiter."
  , 'git-branch-not-main': "On devrait se trouver sur la branche main."
  , 'git-status-added-both-sides':'ajouté des deux côtés (contenus différents).'
  , 'git-status-deleted-both-sides' : 'supprimé des deux côtés.'
  , 'git-status-modified-both-sides': 'modifié des deux côtés.'
  , 'git-status-add-and-absent': 'ajouté par nous, absent en face.'
  , 'git-status-absent-and-add': 'ajouté en face, absent chez nous.'
  , 'git-status-deleted-and-modified': 'supprimé par nous, modifié en face.'
  , 'git-status-modified-and-deleted': 'modifié par nous, supprimé en face.'
  , 'git-bad-branch': "Vous vous trouvez sur la mauvaise branch Git. Attendue : $1."
  , 'git-commit-error': "Erreur Git en commitant les fichiers : $1."
  , 'git-push-error': "Erreur Git en pushant les commits : $1"
  , 'git-pr-create-error': "Erreur GH en créant la pull-request Github : $1."
  , 'git-pr-waiting-checks-error': "Erreur GH au cours de l'attente du check : $1."
  , 'git-pr-waiting-checks-failure': "Erreur GH au cours du check : un test a échoué."
  , 'git-unable-checkout-main': "Erreur Git : impossible de revenir à la branche principale ($1)."
  , 'git-unable-pr-merge': "Erreur Git : impossible de merger la Pull-Request ($1)."
  , 'git-commit-init-required': 'Pour pouvoir commiter vos fichiers dans un Github PR Cyle, vous devez au préalable initier ce cycle (principalement : choisir une branche de développement).'+"\n\nSi cette branche est déjà définie sans initialisation, vous pouvez la renseigner dans les données du projet, dans la propriété `git_pr_cycle_branche`."
  , 'github-pr-cycle-require-clean-status-to-submit': "La soumission pour une PR Gitub nécessite un status clean (aucun fichier ne devrait être à commiter.\n\nUtilisez le service précédent pour le faire."
  , 'git-unable-destroy-branch': "Impossible de détruire la branche Git : $1."
  , 'github-pr-cycle-branch-should-have-been-deleted': "Impossible de détruire la branche de développement $1 : $2"

  // Services
  , 'project-data-invalid-bad-count': "Les données du projet $1 pour le service $2 sont invalides. $3 donnée$5 attendue$5, $4 donnée$6 fournie$6."
})
