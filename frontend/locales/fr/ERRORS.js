/**
 * 
 * Définition des erreurs
 * 
 * Usage
 * 
 *  getErr(errId, params)
 */
const ERRORS = {
    'premier': 'pour-virgule'
    // --- Données générales ---
    , 'hour-not-valid': "heure non valide : '$1'"
    , 'error-date': "La date '$1' est invalide. Formats valides : JJ/MM/AAAA, 'demain', 'après-demain', ou 'dans X heures/jours/semaines/mois'."
    , 'deadline-before-start': "L'échéance '$1' doit être après la date de début '$2'."
    , 'repeat-not-valid': "la répétition n'est pas valide dans '$1'"
    , 'error-duration': "La durée « $1 » devrait avoir la forme '&lt;nombre> &lt;unité>' où unité peut être 'mois', 'semaine', 'jour', 'heure', 'minute' et leurs diminutifs (par exemple '12 h')."
    , 'prop-cant-be-empty': "La propriété « $1 » ne peut pas être vide."
    , 'must-be-num-between': "« $1 » devrait être un nombre entre $2 et $3"
    , 'invalid-phone-number': "Le numéro de téléphone $1 est invalide."

    , 'select-project-to-what': "Il faut sélectionner le projet à $1."
    
    // --- Application ---
    , 'unknown-app-data': "Donnée application inconnue : '$1'"
    , 'app-sorry-fatal-error': "Une erreur fatale s'est produite, merci de nous excuser."
    , 'backend-app-project-unfound': "Projet $1 introuvable dans les archives."
    , 'backend-unknown-action': ":Action inconnue : '$1'."
    , 'backend-access-unabled': "Board n'a pas la permission Accessibilité activée : Réglages Système → Confidentialité et sécurité → Accessibilité → cocher Board."
    , 'backend-command-not-found': "La commande bash '$1' est inconnue."
    
    // --- Projets ---
    , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder.'
    , 'folder-required': 'Il faut impérativement choisir un dossier.'
    , 'no-current-projet': "Aucun projet courant."
    , '--untitled-project--': '-projet sans titre-'

    // Services
    , 'serv-error-on-return': "Erreur au retour du service"
    , 'service-requires-a-name': "Un service doit avoir un :name. ($1)"

    // Scripts services
    , 'backend-open-file-failed': "Impossible d'ouvrir le fichier '$1' avec l'application '$2'."
    , 'scserv-abort': "Abandon du service"
    , 'Script-service-definition-error': 'Erreur de définition du Script-service'
    , 'Script-service-file-contains-errors': 'Le fichier de définition du script-service contient des erreurs.'
    , 'scserv-unknown-step': "L'étape d'identifiant '$1' est inconnue."
    , 'scserv-list-required': "Le fichier YAML devrait définir une liste d’étapes ($1)."
    , 'scserv-type-required': "Une étape de script-service ($1) doit toujours avoir un type ($2)."
    , 'scserv-id-required': "Une étape de script-service doit absolument avoir un identifiant ($1) ($2)."
    , 'scserv-id-invalid': "L’identifiant de l'étape $1 n'est pas valide ($2)."
    , 'scserv-step-type-unknowned': "étape '$1' : type d’étape inconnu : $2 ($3)."
    , 'scserv-param-required': "étape '$1' : le paramètre '$2' est requis, pour le type '$3' ($4)."
    , 'scserv-unknown-param': "étape '$1' : le paramètre '$2' est inconnu du service de type '$3' ($4)."
    , 'scserv-param-bad-type': "Le paramètre '$1' n'a pas le bon type. Attendu: $2, actuel: $3 ($4)."
    , 'scserv-on-get-file-values': "Une erreur s'est produite en essayant de relever les données du fichier '$1' : $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "Le select de l'étape $1 dont les données sont des tables nécessite le paramètre key_value définissant la valeur du menu ($2)"
    , 'scserv-select-with-object-requires-title-values': "Le select de l'étape $1 dont les données sont des tables nécessite le paramètre key_title définissant le titre du menu ($2)"
    , 'scserv-select-with-object-unknown-key': "Pour le select de l'étape $1, l'objet $2 ne définit pas la clé '$3' pour la valeur ($4)."
    , 'scserv-select-with-object-unknown-title': "Pour le select de l'étape $1, l'objet $2 ne définit pas la clé '$3' pour le titre ($4)."
    , 'scserv-unknown-evaluator': "L'évaluator de l'étape '$1' est inconnu : $2 ($3)."
    , 'scserv-unknown-marker-translate': "Le marqueur de translation '$1' de l'étape '$2' est inconnu. Les marqueurs possibles sont : $3 ($4)."

    // File
    , 'backend-unfound-file': "Fichier introuvable : $1"
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

    // Documentation
    , 'docu-error-on-update': "Erreur en cours d'actualisation"
    , 'backend-docu-unfound-folder': "Le dossier de documentation '$1' est introuvable."
    
    // TODOIST
    , 'todoist-key-task-unknown': "La clé « $1 » est inconnue, pour une tâche Todoist."
    , 'no-tasks-checked': "Aucune tâche cochée"
    , 'checked-only-modify-task': "Il faut cocher seulement la tâche à modifier."
    , 'backend-todoist-unfound-project': "Projet « $1 » introuvable dans Todoist."
    , 'backend-task-error': "Tâche $1 : $2"

    // Archives
    , 'backend-archiv-unknown-problem': "Version non archivée suite à un problème inconnu."
    , 'backend-archiv-unfound-folder': "Dossier archives introuvable : $1."

    // Date
    , 'invalid-date': "Date invalide : '$1' : $2"

    // UI
    , 'no-open-window-in': "Aucune fenêtre ouverte dans l'application $1."
    , 'app-unfound-or-close': "Application $1 introuvable ou fermée."

    // Finder
    , 'no-selection': "Aucune sélection"
    , 'not-a-folder': "La sélection devrait être un dossier"
    , 'backend-app-backup-failed': "Le backup quotidien a échoué."
    , 'backend-app-backup-no-previous': "Aucun backup précédent disponible."
    , 'backend-app-backup-restore-failed': "La restauration du backup précédent a échoué."
    , 'unknown-syntax-file-extension': "Extension non répertoriée dans la table de vérification : $1."
    , 'invalid-value': "Valeur invalide : $1."
    , 'git-commit-title-erros': "Erreurs survenues au cours du commit"
    , 'git-status-not-clean': "Le statut de Git n'est pas clean."
    , 'git-status-not-empty': "Des fichiers/dossiers restent à commiter."
    , 'git-branch-not-main': "On devrait se trouver sur la branche main."
    , 'git-status-added-both-sides': "ajouté des deux côtés (contenus différents)."
    , 'git-status-deleted-both-sides': "supprimé des deux côtés."
    , 'git-status-modified-both-sides': "modifié des deux côtés."
    , 'git-status-add-and-absent': "ajouté par nous, absent en face."
    , 'git-status-absent-and-add': "ajouté en face, absent chez nous."
    , 'git-status-deleted-and-modified': "supprimé par nous, modifié en face."
    , 'git-status-modified-and-deleted': "modifié par nous, supprimé en face."
    , 'git-bad-branch': "Vous vous trouvez sur la mauvaise branch Git. Attendue : $1."
    , 'git-commit-error': "Erreur Git en commitant les fichiers : $1."
    , 'git-push-error': "Erreur Git en pushant les commits : $1"
    , 'git-pr-create-error': "Erreur GH en créant la pull-request Github : $1."
    , 'git-pr-waiting-checks-error': "Erreur GH au cours de l'attente du check : $1."
    , 'git-pr-waiting-checks-failure': "Erreur GH au cours du check : un test a échoué."
    , 'git-unable-checkout-main': "Erreur Git : impossible de revenir à la branche principale ($1)."
    , 'git-unable-pr-merge': "Erreur Git : impossible de merger la Pull-Request ($1)."
    , 'git-commit-init-required': "Pour pouvoir commiter vos fichiers dans un Github PR Cyle, vous devez au préalable initier ce cycle (principalement : choisir une branche de développement).\n\nSi cette branche est déjà définie sans initialisation, vous pouvez la renseigner dans les données du projet, dans la propriété `git_pr_cycle_branche`."
    , 'github-pr-cycle-require-clean-status-to-submit': "La soumission pour une PR Gitub nécessite un status clean (aucun fichier ne devrait être à commiter.\n\nUtilisez le service précédent pour le faire."
    , 'git-unable-destroy-branch': "Impossible de détruire la branche Git : $1."
    , 'github-pr-cycle-branch-should-have-been-deleted': "Impossible de détruire la branche de développement $1 : $2"
    , 'git-init-no-push-permission': "Vous n'avez pas les droits d'écriture (push) sur le dépôt Github $1."
    , 'git-init-repo-exists-not-empty': "Le dépôt Github $1 existe déjà et n'est pas vide.\n\nÊtes-vous sûr qu'il s'agit du bon dépôt ? Il faudra le vider avant de pouvoir l'utiliser avec cette initialisation."
    , 'backend-github-api-error': "Erreur en interrogeant l'API Github : $1."
    , 'backend-github-repo-create-error': "Erreur en créant le dépôt Github : $1."
    , 'project-data-invalid-bad-count': "Les données du projet $1 pour le service $2 sont invalides. $3 donnée$5 attendue$5, $4 donnée$6 fournie$6."
}