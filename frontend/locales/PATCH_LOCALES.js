/**
 * Patch locales
 *
 * On met dans ce fichier toutes les nouvelles locales qui ne sont pas
 * encore traduites et qui devront l'être.
 */
Object.assign(MESSAGES, {
  'premier':"juste pour virgule"
  // Nouveaux messages à mettre dans les MESSAGES.js

  // Verbes
  , 'View': "Afficher"


  // À MODIFIER
  , 'action-on-checked-issues': "Sélectionnez les issues à traiter et choisissez l'action."

  // Git
  , 'github-pr-cycle-init': "Initier le PR Cycle Github"
  , 'github-pr-cycle-branch-name': "Nom de la branche de développement à créer"
  , 'github-pr-cycle-inited': "Github PR Cycle initié pour $1."
  , 'git-pr-cycle-branche': "Nom de la branche d'un Cycle PR Github."

})

Object.assign(ERRORS, {
  'premier': "juste pour virgule"
  // Nouveaus messages d'erreur à mettre dans les ERRORS.js

  // Git
  , 'git-status-not-clean': "Le statut de Git n'est pas clean."
  , 'git-status-not-empty': "Des fichiers/dossiers restent à commiter."
  , 'git-branch-not-main': "On devrait se trouver sur la branche main."

  // Services
  , 'project-data-invalid-bad-count': "Les données du projet $1 pour le service $2 sont invalides. $3 donnée$5 attendue$5, $4 donnée$6 fournie$6."
})
