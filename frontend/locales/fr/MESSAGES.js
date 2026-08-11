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

    // --- STATIQUE (index.html) ---
    , 'Board': "Tableau de bord"
    , 'Help': "Aide"
    , 'Debug': "Debug"
    , 'Tools': "Outils"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Oui"
    , 'btn-no': "Non"
    , 'OK': 'OK'
    , 'GO!': 'GO !'
    , ':'   :   ' : '
    , 'new…': "Nouveau…"
    , 'None': 'Aucun'
    , 'Nonee': 'Aucune'
    , 'Empty': 'Vide'
    , 'error:': "Erreur :"
    , 'other-value…': 'Autre valeur…'
    , 'date/at': 'à' // pour une date avec heure
    , 'date/months': "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre"
    , 'date/format': "%J %_M %Y"
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
    , 'choose-files-to': "Choisisez les fichiers à $1"
    , 'select-filter-placeholder': "Filtrer…"
    , 'select-all-tooltip': "Tout sélectionner"
    , 'select-none-tooltip': "Tout désélectionner"
    , 'fatal-error': "Erreur fatale"
    , 'ope-aborted': 'Opération abandonnée'
    , 'samples': "Échantillons" // (musique)
    , 'work-duration:': 'Temps de travail : '
    , 'created-at:': 'créé : '
    , 'modify-at:': '/mod. : '
    , 'url-definition': 'Définition d’URL'

    // Verbes
    , 'vb-commit': 'committer'
    , 'Ignore': 'Ignorer'
    , 'Finish': "Finir" // dans le sens d'un ordre donné
    , 'Apply': "Appliquer"
    , 'Import': 'Importer'
    , 'sustract': "retirer"
    , 'Open-url…': 'Ouvrir l’URL…'
    , 'modify-it': 'Le modifier'
    , 'Validate': 'Valider'

    // Logique
    , 'id-is-required': "Un identifiant (`id`) est obligatoire"
    , 'type-is-required': "Le type doit être défini."

    // Data
    , 'path-to-data': "Chemin d'accès aux données"
    , 'id-in-data': 'ID dans les données (au besoin)'

    // Prompt
    , 'Parameter-definition': 'Définition de paramètre'

    // File
    , 'add-to-file-at': "Ajout à un fichier, à un endroit quelconque"
    , 'which-url-to-reach': 'Quel URL faut-il rejoindre ?'
    , 'destination-folder-or-file': 'Destination (dossier ou fichier)'
    , 'backend-file-created': "Le fichier $1 a été créé."

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
    , 'backend-app-data-save': "Données de l'application sauvées."

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
    , 'Window-position-and-size': 'Position et taille de fenêtre'
    , 'which-widhow-app': 'De quelle application faut-il prendre en compte la fenêtre au premier plan ?' + '<div class="small">Sa taille et sa position seront mises dans le presse-papier</div>'
    , 'window-position-and-size': "Position et taille de la fenêtre au premier plan dans l'application $1 :"
    , 'click-button-if-data-ok': "Si tu es d'accord avec ces données, clique le bouton “$1”"
    , 'countdown-timer': "Minuteur"
    , 'lifecycle': "Cycle de vie"
    , 'open-folder-project': "Ouvrir le dossier du projet"
    , 'opening': "Ouverture"
    , 'run-a-script': "Jouer un script"
    , 'run-a-script-service': "Jouer un script-service"
    , 'Defining-a-color': "Définition d'une couleur"
    , 'choose-a-color': "Sélectionner une couleur avec le picker ci-dessous."
    , 'group-tools': "Outils"
    , 'error-precise-description:': "Description précise de l'erreur :"
    , 'clock-set-pause': "Mettre en pause"

    // --- PROJETS ---
    , 'current-projects-displayed': "Projets courants affichés."
    , 'data-project-id': 'ID du projet'
    , 'data-project-icon': 'Icône du projet'
    , 'data-project-folder': 'Dossier du projet'
    , 'data-project-title': "Titre du projet"
    , 'data-project-nature': "Nature du projet"
    , 'importing-new-project': "Importation d'un nouveau projet"
    , 'data-project-standby': 'Mise en standby du projet'
    , 'data-project-todoist': 'ID projet dans Todoist'
    , 'data-github-account': 'Compte Github (du projet)'
    , 'data-project-createdat': "Date de création du projet"
    , 'data-project-lastmod': 'Date de dernière modification'
    , 'duration-work-done': 'Durée de travail accomplie (mn)'
    , 'background-img-or-color': 'Couleur ou image de fond'
    , 'githug-label-desc': "Labels des issues Github"

    , 'title-project': "Projet “$1”"
    , 'new-project-name': "Nom du nouveau projet"
    , 'name-to-give-to-project': "Nom à donner à ce projet"
    , 'title-data-of-project': "Données du projet “$1”"
    , 'select-project-folder-and-ok': "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”."
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
    , 'archives…': "Archives…"
    , 'confirming-import': "Confirmation de l'import"
    , 'confirming-project-substract': "Confirmation du retrait du projet"
    , 'project-substracted': "Projet retiré de la liste des projets."
    , 'ending-startup-project-x': "Fin de démarrage du projet “$1”."
    , 'modifying-project-title': "Modification du titre du projet"
    , 'click-to-modify-title': 'Cliquer pour modifier le titre'
    // Projet et Service
    , 'startup-services': 'Services au démarrage'
    , 'others-services': 'Autres services'
    // Projet et Todoist
    , 'todoist-tasks': 'Tâches Todoist'
    // Projet et archives
    , 'archived-projects': "Projets en archives"
    , 'choose-project-to-restart': "Choisis le projet à remettre en activité."

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
    , 'Common-services': 'Services communs'
    , 'Custom-services': 'Services personnalisés'
    , 'running-service-x': "Lancement du service $1…"
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
    , "Service supprimé ($1)": "Service supprimé ($1)"
    , 'Learn-to-select-the-service': "Apprendre à sélectionner le service"
    , 'aborted-definition': 'Définition abandonnée.'
    // Scripts-services
    , 'Scripts-services': "Script service"
    , 'script-service-canceled': "Abandon du script-service."

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm au dossier'
    , 'terminal-at-folder': 'Terminal au dossier'
    , 'open-in-vscode': 'Ouvrir dans VSCode'
    , 'code-to-run-at-launch': 'Code à exécuter à l’ouverture'
    // Git
    , 'gh-save-a-error': "Enregistrer une erreur (gh)"
    , 'initing-git-for-project': "Initier Git pour le projet"
    , 'git-init-btn': "Initier Git sur le projet"
    , 'github-account': "Nom du votre compte Github"
    , 'github-project-name': "Nom du projet dans Github"
    , 'git-committing': "Commiter sur Github"
    , 'git-message-commit': 'Message de commit pour ces fichiers'
    , 'git-commit-message-title': "Message du commit"
    , 'gh-issues-create': "Nouvelle issue de type…"
    , 'git-issue-list': "Issues de type…"
    , 'github-label': "Label Github :"
    , 'Message:': "Message :"
    , 'gh-description:': "Description plus précise :"
    , 'gh-operation': "Opération gh à exécuter"
    , 'gh-message-operation': "Message à associer à l'opération :"
    , 'action-on-checked-issues': "Cochez les issues à traiter et choisissez l'action."
    , 'gh-close': "Fermer / supprimer"
    , 'gh-comment': "Commenter"
    , 'gh-pin': 'Épingler'
    , 'gh-unpin': 'Désépingler'
    , 'git-installing-labels': "Définition des labels Git"
    , 'git-issue-gestion': "Gestion des issues Github"
    , 'backend-add-labels-ajout': " + définition des labels."
    , 'backend-git-ready': "Git préparé pour le dossier"
    , 'backend-git-failed': "git $1 a échoué : $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Sélectionner le script du service dans le Finder puis “OK”.'
    , 'scserv-end': 'Script-service terminé avec succès (en tout cas sans erreur).'
    , 'scserv-datetime-default-format': 'JJ MM HH:MM (03 08 05:12 pour 3 aout à 5 heures 12)'
    , 'Opening-script-file': 'Ouverture du fichier script'
    , 'ask-for-modify-script-file': "Voulez-vous modifier le fichier du script (définissant les étapes) ?"
    
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
    , 'backend-docu-opened-in': "Dossier de documentation ouvert avec succès dans $1"

    // Archive
    , 'backend-archiv-move-and-num': "Déplacé dans l'archive et renuméroté $1"
    , 'backend-archiv-saved': "Version sauvegardée en archives."

    // Tools
    , 'tools-confirm-scheduling-alert': "Alerte programmée avec succès."
    
    // Reminder / Rappels
    , 'remind-started': "Démarrée"
    , 'remind-remove': "Supprimer"
    , 'scheduling-alert': "Programmation d'alerte"
    , 'schedule-a-alert': "Programmer une alerte"
    , 'hour-and-day-of-alert': "Heure de l'alerte (et jour si plus tard)"
    , 'alert-message': "Message de l'alerte"

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

    // --- Finder ---
    , 'window-opened': "Fenêtre ouverte avec succès."
    , 'folder-opened': "Dossier ouvert avec succès."

    // --- Git ---
    , 'git-init-success': "Git installé avec succès."
    , 'Which-labels': "Labels ?"
    , 'which-labels-to-create': "Labels à créer (n'en sélectionner aucun pour ne pas les toucher)."

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm ouvert au dossier."
    , 'terminal-opened-at-folder': "Terminal ouvert au dossier."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - Clé API"
    , 'which-todoist-api-key': "Merci d'indiquer votre clé API (token) Todoist"

    // --- Documentation ---
    , 'docu-opened-in-browser': "Documentation ouverte."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "le "
    , 'regexp:hour-words': "heure|hr|h"
    , 'regexp:relative-days': "hier|avant-hier|après-demain|demain|dem|aujourd'hui|auj"
    , 'regexp:date-unit': "mois|semaine|sem|jour|jr|j|heure|hr|h|minute|min|mn"
    , 'regexp:duration-in': "dans ([0-9]+) (mois|semaine|sem|jour|jr|j|heure|hr|h|minute|min|mn)s?"
    , 'regexp:every-prefix': "tous les "
    , 'regexp:day-word': "jours"
    , 'regexp:weekdays': "lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche"
    , 'regexp:of-month': "du mois"
    , 'regexp:unit-month': "mois"
    , 'regexp:unit-week': "semaine|sem"
    , 'regexp:unit-day': "jour|jr|j"
    , 'regexp:unit-hour': "heure|hr|h"
    , 'regexp:unit-minute': "minute|min|mn"
    , 'regexp:day-before-yesterday': "avant-hier"
    , 'regexp:yesterday': "hier"
    , 'regexp:today': "aujourd'hui|auj"
    , 'regexp:tomorrow': "demain|dem"
    , 'regexp:day-after-tomorrow': "après-demain"
}