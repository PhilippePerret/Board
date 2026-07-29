/**
 * Pour obtenir ces emssages :
 * getMsg(id, params)
 */
const MESSAGES = {
    'premier': "sans virgule"

    // --- GÉNÉRAUX ---
    , ':': ' : '
    , 'date/at': 'à' // pour une date avec heure
    , 'Cancel': "Renoncer"
    , 'clock-work-done': 'Travail accompli au cours de la session : '
    , 'clock-work-is-done': "Vous êtes arrivé à échéance de travail"
    , 'clock-10-minutes-remaining': "Il vous reste 10 minutes de travail"
    , 'of-work-on-project': " sur le projet “$1”."
    , 'clock-ask-work-restarted': "Le travail a-t-il repris ?"
    , 'clock-todo-next-session': "Travail à accomplir à la prochaine session : "
    , 'clock-work-time': "Temps de travail :"
    , 'clock-restart': 'Redémarrer'
    , 'Confirm': 'Confirmer'
    , 'End-of-session': 'Fin de session'
    , 'Find': "Chercher"
    , 'file-opened': "Le fichier '$1' est ouvert."
    , 'Minuteur': "Minuteur"
    , 'Next': 'Suivant'
    , 'Save': 'Enregistrer'
    , 'scripts': "Scripts"

    // --- UI ---
    , 'countdown-timer': "Minuteur"
    , 'lifecycle': "Cycle de vie"
    , 'open-folder-project': "Ouvrir le dossier du projet"
    , 'opening': "Ouverture"
    , 'run-a-script': "Jouer un script"
    , 'run-a-script-service': "Jouer un SCRIPT-SERVICE"

    // --- PROJETS ---
    , 'alert-before-edit-projet': "Attention, données sensibles. Manipuler en sachant ce que vous faites."
    , 'expli-retrait-projet': "Le retrait du projet “$1” ne touche pas son dossier lui-même. Il est juste retiré de ce tablau de bord ou archivé (pour pouvoir le récupérer plus tard)\n\nAttention, si le projet n'est pas archivé, tous ses services et data seront perdues, bien sûr."
    , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder'
    , 'folder-required': 'Il faut impérativement choisir un dossier.'

    // -- Script services --
    , 'scserv-end': 'Script-service terminé avec succès (en tout cas sans erreur).'
  
    // -- Todoist --
    , 'todoist-content'     : "contenu"
    , 'todoist-description' : "description"
    , 'todoist-due'         : "début"
    , 'todoist-deadline'    : "échéance"
    , 'todoist-duration'    : "durée"
    , 'todoist-priority'    : "priorité"
    , 'todoist-labels'      : "labels"
    , 'todoist-repeat'      : "répète"
    , 'task-due-to-start'   : "Désolé de vous interrompre, mais la tâche “$1” doit être commencée."

    , 'New task...': "Nouvelle tâche…"
    , 'New task': "Nouvelle tâche"
    , 'todoist-message-new-task': "Définissez ci-dessous les paramètres généraux de cette nouvelle tâche. Vous pouvez supprimer tous les paramètres inutiles et utiliser des marqueurs simplifiés (today, tomorrow, 4j, etc.)"
    , 'todoist-default-new-task': "contenu: \ndescription: \n\ndébut: JJ/MM/AAAA à h:mm\nrépète: \ndurée: \npriorité: 1-5\néchéance: JJ/MM/AAAA\nlabels: lab 1, lab 2, ..."
    , 'todoist-text-new-task': "✔ Nouvelle tâche : $1"
    , 'todoist-project-title': "Titre du projet dans Todoist"
    , 'todoist-tasks': "Tâches Todoist" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Merci d'indiquer ci-dessous le titre du projet $1 dans l'application Todoist."
    , 'todoist-message-today-project-task': "Liste des tâches du jour pour le projet “$1”."
    , 'confirm-tasks-checks': "Confirmation des tâches"
    , 'ask-for-confirm-tasks-checks': "Merci de confirmer opérations sur les tâches du projet “$1”.$2"
    , 'mark-task-checked': "La tâche “$1” est à marquer achevée."
    , 'todoist-fin-tasks-done-and-create': "Les tâches du projet “$1” ont été actualisées (achevées : $2, nouvelles : $3)."
    , 'todoist-tasks-created-message': "Les nouvelles tâches du projet “$1” ont été créées ($2)." 
    , 'todoist-new-task-title-errors': "Tâche invalide"
    , 'todoist-new-task-msg-correct-errors': "Merci de corriger les erreurs ci-dessous :"
    , 'todoist-no-task-done': "Aucune tâche à marquer achevée."
    , 'todoist-no-new-task': "Aucune nouvelle tâche."
    // -- test --
    , 'test-raw':   'remplace $1'
    , 'test-array': 'remplace $1 et $2'
    , 'test-objet': 'remplace $ceci et ${cela}'
}