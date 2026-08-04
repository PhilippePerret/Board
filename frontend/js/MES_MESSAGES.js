/**
 * Pour obtenir ces emssages :
 * getMsg(id, params)
 * 
 * FICHIERS LOCALISÉS (TRAITÉS INTÉGRALEMENT)
        Aide.js
        App.js
        AppData.js
        Clock.js
        Dateutils.js
        Debug.js
        Dialog.js
        Dialogs.js

 */
const MESSAGES = {
    'premier': "sans virgule"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Oui"
    , 'btn-no': "Non"
    , 'OK': 'OK'
    , ':'   :   ' : '
    , 'new…': "Nouveau…"
    , 'None': 'Aucun'
    , 'Nonee': 'Aucune'
    , 'error:': "Erreur :"
    , 'other-value…': 'Autre valeur…'
    , 'date/at': 'à' // pour une date avec heure
    , 'Cancel': "Annuler"
    , 'Correct': "Corriger"
    , 'its-noted': "C’est noté"
    , 'remind-me-later': "Me le rappeler plus tard"
    , '(by-default)': "(par défaut)"
    , 'Color': 'Couleur'
    , 'Image': 'Image'
    , 'Nothing': 'Rien'
    , 'This-one': 'Celui-là'
    , 'This-onee': "Celle-là" 
    , 'Preserve': "Préserver"
    , 'app-to-use': "Application à utiliser"
    , 'choosing-files-to': "Choix des fichiers à $1"
    , 'choose-files-to': "Choisisez les fichiers à $1 (click)"
    , 'select-filter-placeholder': "Filtrer…"

    // Verbes
    , 'vb-commit': 'committer'
    , 'Ignore': 'Ignorer'
    , 'Finish': "Finir" // dans le sens d'un ordre donné

    // Data
    , 'path-to-data': "Chemin d'accès aux données"
    , 'id-in-data': 'ID dans les données (au besoin)'

    // File
    , 'add-to-file-at': "Ajout à un fichier, à un endroit quelconque"

    // App
    , 'app-config': 'Configuration de l’application'
    , 'app-version': 'Version de l’application'
    , 'remember-last-project': 'Se souvenir du dernier projet'
    , 'default-browser': 'Navigateur par défaut'
    , 'code-editor': 'Éditeur pour le code'
    , 'text-simple-editor': 'Éditeur pour les textes simples'
    , 'yaml-editor': 'Éditeur YAML'
    , 'docu-editor': 'Éditeur pour la documentation'
    , 'docu-folder-name': 'Nom du dossier de documentation'
    , 'changelog-file-name': 'Nom du fichier changelog'
    , 'todo-file-name': 'Nom du fichier TODO'
    , 'last-project-id': 'Dernier project sélectionné'

    // Minuteur
    , 'work-session-duration': 'Durée d’une session de travail (minutes)'
    , 'work-section-duration': 'Durée d’une tranche de travail (minutes)'
    , 'start-clock': 'Démarrer l’horloge'
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
    , 'ask-still-working': "Le travail est-il toujours en cours sur le projet “$1” ?"

    // --- UI ---
    , 'countdown-timer': "Minuteur"
    , 'lifecycle': "Cycle de vie"
    , 'open-folder-project': "Ouvrir le dossier du projet"
    , 'opening': "Ouverture"
    , 'run-a-script': "Jouer un script"
    , 'run-a-script-service': "Jouer un SCRIPT-SERVICE"
    , 'Defining-a-color': "Définition d'une couleur"
    , 'choose-a-color': "Sélectionner une couleur avec le picker ci-dessous."
    , 'group-tools': "Outils"
    , 'error-precise-description:': "Description précise de l'erreur :"
    , 'clock-set-pause': "Mettre en pause"

    // --- PROJETS ---
    , 'data-project-id': 'ID du projet'
    , 'data-project-icon': 'Icône du projet'
    , 'data-project-folder': 'Dossier du projet'
    , 'data-project-title': "Titre du projet"
    , 'data-project-nature': "Nature du projet"
    , 'data-project-standby': 'Mise en standby du projet'
    , 'data-project-todoist': 'ID projet dans Todoist'
    , 'data-github-account': 'Compte Github (du projet)'
    , 'data-project-createdat': "Date de création du projet"
    , 'data-project-lastmod': 'Date de dernière modification'
    , 'duration-work-done': 'Durée de travail accomplie (mn)'
    , 'background-img-or-color': 'Couleur ou image de fond'

    , 'title-project': "Projet “$1”"
    , 'title-data-of-project': "Données du projet “$1”"
    , 'project-saved-success': "Projet « $1 » enregistré avec succès à $2."
    , 'alert-before-edit-projet': "Attention, données sensibles. Manipuler en sachant ce que vous faites."
    , 'expli-retrait-projet': "Le retrait du projet “$1” ne touche pas son dossier lui-même. Il est juste retiré de ce tablau de bord ou archivé (pour pouvoir le récupérer plus tard)\n\nAttention, si le projet n'est pas archivé, tous ses services et data seront perdues, bien sûr."
    , 'project-folder-not-selected': 'Le dossier du projet doit être sélectionné dans le Finder'
    , 'folder-required': 'Il faut impérativement choisir un dossier.'
    , 'Other-genre': "Autre genre…"
    , 'editing-project-data': "Éditer les données du projet"
    , 'versionning-which-num': 'Quel numéro actualiser ?'
    , 'versionning-patch': 'Patch'
    , 'versionning-minor': 'Version mineure'
    , 'versionning-major': 'Version majeure'
    , 'select-archives-folder': 'Sélectionner le dossier archives dans le Finder (ou aucun si le fichier ne doit pas être archivé).'

    // Finder
    , 'open-file…': 'Ouvrir le fichier…'
    , 'file-to-open': "Fichier à ouvrir"
    , 'opening-window-in-finder': 'Ouvrir une fenêtre dans le Finder'
    , 'sidebar-setting': "Réglage de la Sidebar"
    , 'sidebar?': "Voulez-vous la sidebar ?"
    , 'what-size-for-sidebar': 'Quelle taille donner à la sidebar (mettre 0 pour la cacher) ?'
    , 'Choosing-finder-element': "Choix d'un élément de Finder"
    , 'select-el-in-finder-and-ok': "Sélectionner l'élément dans le Finder et cliquer sur OK."    , 'which-url': "Quelle URL faut-il rejoindre ?"
    , 'select-file-in-finder-and-btn': "Sélectionner le fichier à ouvrir dans le Finder, puis “Choisir”."
    , 'Choosing-a-folder': "Choix d'un dossier"
    , 'select-folder-and-ok': "Sélectionner le dossier dans le Finder et cliquer sur OK."
    , 'select-el-in-project-and-ok': "Sélectionner l'élément dans le dossier du projet et cliquer sur OK."
    , 'set-window-in-finder-and-ok': "Ouvrir la fenêtre dans le Finder et la régler comme voulue (position, taille, type de vue) puis cliquer OK."
    , 'pos-window-in-finder-and-ok' : "Positionner la fenêtre dans le Finder et cliquer “OK”."
    , 'sel-el-in-finder-or-click-none' : "Sélectionner l'élément dans le Finder ou cliquer 'Aucun'."

    // -- Service --
    , 'service-success': ' Service “$1” joué avec succès (<span class="tiny">(service $2)</span>).'
    , 'service-exec-bash-code': 'Exécuter le code bash…'
    , 'service-exec-js-code': "Exécuter le code JS…"
    , 'ask-for-code-to-exec': 'Code à exécuter :'
    , 'ask-save-work-time': 'Faut-il enregistrer le temps de travail ?'
    , 'Defining-parameter': 'Définition de paramètre'
    , 'app-choice': "Choix d'une application"
    , 'choose-app-to-use': 'Choisir l’application à utiliser'
    , 'other-app': 'Autre application…'
    , 'new-service-name': 'Nouveau nom du service'
    , 'which-name-for-project-service': 'Quel nouveau nom donner à ce service pour le projet ?'
    , 'choose-color-or-image': "Choisir une couleur ou une image"
    , 'which-background': 'Que voulez-vous choisir comme fond ?'
    , 'phone-number': 'Numéro de téléphone'
    , 'which-phone-number': 'Merci de bien vouloir fournir un numéro de téléphone valide.'
    , 'date-and-hour': 'Date et heure'
    , 'versioning-file': 'Versionner un fichier/dossier'

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm au dossier'
    , 'terminal-at-folder': 'Terminal au dossier'
    , 'open-in-vscode': 'Ouvrir dans VSCode'
    , 'code-to-run-at-launch': 'Code à exécuter à l’ouverture'
    // Git
    , 'gh-save-a-error': "Enregistrer une erreur (gh)"
    , 'initing-git-for-project': "Initier Git pour le projet"
    , 'github-account': "Nom du votre compte Github"
    , 'github-project-name': "Nom du projet dans Github"
    , 'git-committing': "Commiter sur Github"
    , 'git-message-commit': 'Message de commit pour ces fichiers'
    , 'git-commit-message-title': "Message du commit"
    
    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Sélectionner le script du service dans le Finder puis “OK”.'
    , 'scserv-end': 'Script-service terminé avec succès (en tout cas sans erreur).'
    , 'scserv-datetime-default-format': 'JJ MM HH:MM (03 08 05:12 pour 3 aout à 5 heures 12)'
    
    // -- Documentation --
    , 'Documentation': 'Documentation'
    , 'group-documentation': "Documentation"
    , 'docu-folder': 'Dossier documentation'
    , 'editing-documentation': 'Éditer la documentation'
    , 'initing-documentation': "Initier la documentation"
    , 'update-documentation': 'Actualiser la documentation'
    , 'open-documentation': 'Ouvrir la documentation'
    , 'select-docu-folder-and-ok': 'Sélectionner le dossier dans lequel placer la documentation, puis “OK”.'
    , 'select-docu-folder': 'Sélectionner le dossier de documentation dans le Finder'
    , 'select-docu-main-file': 'Sélectionner le fichier principal de documentation (défaut : docu.adoc)'
    , 'select-doc-main-final-file': 'Sélectionner le fichier du manuel (défaut : docu.html)'
    , 'docu-main-file-name': 'Docu : Nom du fichier éditable'
    , 'docu-main-disp-file': 'Docu : Nom du fichier de diffusion'

    // Tools
    , 'tools-confirm-scheduling-alert': "Alerte programmée avec succès."
    
    // Reminder / Rappels
    , 'remind-started': "Démarrée"
    , 'remind-remove': "Supprimer"

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
    , 'todoist-message-mod-task': "Redéfinissez ci-dessous les paramètres de la tâche."
    , 'todoist-default-fields-task': "contenu: $1\\\ndescription: $2\\\n\\\ndébut: $3\\\nrépète: $4\\\ndurée: $5\\\npriorité: $6\\\néchéance: $7\\\nlabels: $8"
    , 'todoist-default-due-task': "JJ/MM/AAAA à h:mm"
    , 'todoist-text-new-task': "✔ Nouvelle tâche : $1"
    , 'todoist-text-mod-task': "✔ Tâche modifiée : $1"
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
    , 'todoist-modify-checked': "Modifier ✔…"
    , 'todoist-errors-update-tasks': "Erreurs d'actualisation des tâches"
    , 'todoist-message-actualisation': "Actualisation des tâches : nouvelles : $1, achevées : $2, modifiées : $3"
    // -- test --
    , 'test-raw':   'remplace $1'
    , 'test-array': 'remplace $1 et $2'
    , 'test-objet': 'remplace $ceci et ${cela}'
}