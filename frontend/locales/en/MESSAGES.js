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
    , 'Board': "Board"
    , 'Help': "Help"
    , 'Debug': "Debug"
    , 'Tools': "Tools"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Yes"
    , 'btn-no': "No"
    , 'OK': 'OK'
    , 'GO!': 'GO!'
    , ':'   :   ': '
    , 'new…': "New…"
    , 'None': 'None'
    , 'Nonee': 'None'
    , 'Empty': 'Empty'
    , 'error:': "Error:"
    , 'other-value…': 'Other value…'
    , 'date/at': 'at' // pour une date avec heure
    , 'Cancel': "Cancel"
    , 'Correct': "Fix"
    , 'its-noted': "Got it"
    , 'remind-me-later': "Remind me later"
    , '(by-default)': "(by default)"
    , 'Color': 'Color'
    , 'Image': 'Image'
    , 'Nothing': 'Nothing'
    , 'This-one': 'This one'
    , 'This-onee': "This one"
    , 'Preserve': "Preserve"
    , 'app-to-use': "Application to use"
    , 'choosing-files-to': "Choosing files to $1"
    , 'choose-files-to': "Choose the files to $1"
    , 'select-filter-placeholder': "Filter…"
    , 'fatal-error': "Fatal error"
    , 'ope-aborted': 'Operation aborted'
    , 'samples': "Samples" // (musique)
    , 'work-duration:': 'Work time: '
    , 'created-at:': 'created: '
    , 'modify-at:': '/mod.: '
    , 'url-definition': 'URL definition'

    // Verbes
    , 'vb-commit': 'commit'
    , 'Ignore': 'Ignore'
    , 'Finish': "Finish" // dans le sens d'un ordre donné
    , 'Apply': "Apply"
    , 'Import': 'Import'
    , 'sustract': "remove"
    , 'Open-url…': 'Open URL…'
    , 'modify-it': 'Edit it'
    , 'Validate': 'Validate'

    // Logique
    , 'id-is-required': "An identifier (`id`) is required"
    , 'type-is-required': "The type must be defined."

    // Data
    , 'path-to-data': "Path to the data"
    , 'id-in-data': 'ID in the data (if needed)'

    // Prompt
    , 'Parameter-definition': 'Parameter definition'

    // File
    , 'add-to-file-at': "Add to a file, at any location"
    , 'which-url-to-reach': 'Which URL should be reached?'
    , 'destination-folder-or-file': 'Destination (folder or file)'
    , 'backend-file-created': "The file $1 was created."

    // App
    , 'app-config': 'Application configuration'
    , 'app-version': 'Application version'
    , 'remember-last-project': 'Remember the last project'
    , 'default-browser': 'Default browser'
    , 'code-editor': 'Code editor'
    , 'text-simple-editor': 'Plain text editor'
    , 'yaml-editor': 'YAML editor'
    , 'docu-editor': 'Documentation editor'
    , 'docu-folder-name': 'Documentation folder name'
    , 'changelog-file-name': 'Changelog file name'
    , 'todo-file-name': 'TODO file name'
    , 'last-project-id': 'Last selected project'
    , 'backend-app-data-save': "Application data saved."

    // Minuteur
    , 'work-session-duration': 'Duration of a work session (minutes)'
    , 'work-section-duration': 'Duration of a work slot (minutes)'
    , 'start-clock': 'Start the clock'
    , 'clock-work-done': 'Work done during the session: '
    , 'clock-work-is-done': "You have reached the work deadline"
    , 'clock-10-minutes-remaining': "You have 10 minutes of work left"
    , 'of-work-on-project': " on project “$1”."
    , 'clock-ask-work-restarted': "Has the work resumed?"
    , 'clock-todo-next-session': "Work to do next session: "
    , 'clock-work-time': "Work time:"
    , 'clock-restart': 'Restart'
    , 'Confirm': 'Confirm'
    , 'End-of-session': 'End of session'
    , 'Find': "Find"
    , 'file-opened': "The file '$1' is open."
    , 'Minuteur': "Timer"
    , 'Next': 'Next'
    , 'Save': 'Save'
    , 'scripts': "Scripts"
    , 'ask-still-working': "Is work still in progress on project “$1”?"

    // --- UI ---
    , 'Window-position-and-size': 'Window position and size'
    , 'which-widhow-app': 'Which application\'s foreground window should be used?' + '<div class="small">Its size and position will be copied to the clipboard</div>'
    , 'window-position-and-size': "Position and size of the frontmost window in application $1:"
    , 'click-button-if-data-ok': "If you agree with this data, click the “$1” button"
    , 'countdown-timer': "Timer"
    , 'lifecycle': "Lifecycle"
    , 'open-folder-project': "Open the project folder"
    , 'opening': "Opening"
    , 'run-a-script': "Run a script"
    , 'run-a-script-service': "Run a script-service"
    , 'Defining-a-color': "Defining a color"
    , 'choose-a-color': "Select a color with the picker below."
    , 'group-tools': "Tools"
    , 'error-precise-description:': "Precise description of the error:"
    , 'clock-set-pause': "Pause"

    // --- PROJETS ---
    , 'current-projects-displayed': "Current projects displayed."
    , 'data-project-id': 'Project ID'
    , 'data-project-icon': 'Project icon'
    , 'data-project-folder': 'Project folder'
    , 'data-project-title': "Project title"
    , 'data-project-nature': "Project nature"
    , 'importing-new-project': "Importing a new project"
    , 'data-project-standby': 'Put the project on standby'
    , 'data-project-todoist': 'Project ID in Todoist'
    , 'data-github-account': 'Github account (of the project)'
    , 'data-project-createdat': "Project creation date"
    , 'data-project-lastmod': 'Last modification date'
    , 'duration-work-done': 'Work time done (min)'
    , 'background-img-or-color': 'Background color or image'
    , 'githug-label-desc': "Github issue labels"

    , 'title-project': "Project “$1”"
    , 'new-project-name': "Name of the new project"
    , 'name-to-give-to-project': "Name to give to this project"
    , 'title-data-of-project': "Data of project “$1”"
    , 'select-project-folder-and-ok': "Select the project folder in Finder, then click “OK”."
    , 'project-saved-success': "Project “$1” saved successfully at $2."
    , 'alert-before-edit-projet': "Warning, sensitive data. Only proceed if you know what you're doing."
    , 'expli-retrait-projet': "Removing project “$1” does not touch its folder itself. It is just removed from this dashboard or archived (so it can be recovered later)\n\nWarning, if the project is not archived, all its services and data will of course be lost."
    , 'project-folder-not-selected': 'The project folder must be selected in Finder'
    , 'folder-required': 'A folder must be chosen.'
    , 'Other-genre': "Other kind…"
    , 'editing-project-data': "Edit the project data"
    , 'versionning-which-num': 'Which number should be updated?'
    , 'versionning-patch': 'Patch'
    , 'versionning-minor': 'Minor version'
    , 'versionning-major': 'Major version'
    , 'select-archives-folder': 'Select the archives folder in Finder (or none if the file should not be archived).'
    , 'archives…': "Archives…"
    , 'confirming-import': "Confirming the import"
    , 'confirming-project-substract': "Confirming project removal"
    , 'project-substracted': "Project removed from the project list."
    , 'ending-startup-project-x': "End of startup for project “$1”."
    , 'modifying-project-title': "Modifying the project title"
    , 'click-to-modify-title': 'Click to modify the title'
    // Projet et Service
    , 'startup-services': 'Startup services'
    , 'others-services': 'Other services'
    // Projet et Todoist
    , 'todoist-tasks': 'Todoist tasks'
    // Projet et archives
    , 'archived-projects': "Archived projects"
    , 'choose-project-to-restart': "Choose the project to reactivate."

    // Finder
    , 'open-file…': 'Open the file…'
    , 'file-to-open': "File to open"
    , 'opening-window-in-finder': 'Open a window in Finder'
    , 'sidebar-setting': "Sidebar setting"
    , 'sidebar?': "Do you want the sidebar?"
    , 'what-size-for-sidebar': 'What size should the sidebar be (put 0 to hide it)?'
    , 'Choosing-finder-element': "Choosing a Finder element"
    , 'select-el-in-finder-and-ok': "Select the element in Finder and click OK."    , 'which-url': "Which URL should be reached?"
    , 'select-file-in-finder-and-btn': "Select the file to open in Finder, then “Choose”."
    , 'Choosing-a-folder': "Choosing a folder"
    , 'select-folder-and-ok': "Select the folder in Finder and click OK."
    , 'select-el-in-project-and-ok': "Select the element in the project folder and click OK."
    , 'set-window-in-finder-and-ok': "Open the window in Finder and set it as wanted (position, size, view type) then click OK."
    , 'pos-window-in-finder-and-ok' : "Position the window in Finder and click “OK”."
    , 'sel-el-in-finder-or-click-none' : "Select the element in Finder or click 'None'."

    // -- Service --
    , 'Common-services': 'Common services'
    , 'Custom-services': 'Custom services'
    , 'running-service-x': "Running service $1…"
    , 'service-success': ' Service “$1” run successfully (<span class="tiny">(service $2)</span>).'
    , 'service-exec-bash-code': 'Run bash code…'
    , 'service-exec-js-code': "Run JS code…"
    , 'ask-for-code-to-exec': 'Code to run:'
    , 'ask-save-work-time': 'Should the work time be saved?'
    , 'Defining-parameter': 'Parameter definition'
    , 'app-choice': "Choosing an application"
    , 'choose-app-to-use': 'Choose the application to use'
    , 'other-app': 'Other application…'
    , 'new-service-name': 'New name of the service'
    , 'which-name-for-project-service': 'What new name should this service have for the project?'
    , 'choose-color-or-image': "Choose a color or an image"
    , 'which-background': 'What do you want to choose as background?'
    , 'phone-number': 'Phone number'
    , 'which-phone-number': 'Please provide a valid phone number.'
    , 'date-and-hour': 'Date and time'
    , 'versioning-file': 'Version a file/folder'
    , "Service supprimé ($1)": "Service removed ($1)"
    , 'Learn-to-select-the-service': "Learn how to select the service"
    , 'aborted-definition': 'Definition aborted.'
    // Scripts-services
    , 'Scripts-services': "Script service"
    , 'script-service-canceled': "Script-service canceled."

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm at folder'
    , 'terminal-at-folder': 'Terminal at folder'
    , 'open-in-vscode': 'Open in VSCode'
    , 'code-to-run-at-launch': 'Code to run on launch'
    // Git
    , 'gh-save-a-error': "Save an error (gh)"
    , 'initing-git-for-project': "Initialize Git for the project"
    , 'github-account': "Your Github account name"
    , 'github-project-name': "Project name on Github"
    , 'git-committing': "Commit to Github"
    , 'git-message-commit': 'Commit message for these files'
    , 'git-commit-message-title': "Commit message"
    , 'gh-issues-create': "New issue of type…"
    , 'git-issue-list': "Issues of type…"
    , 'github-label': "Github label:"
    , 'Message:': "Message:"
    , 'gh-description:': "More precise description:"
    , 'gh-operation': "gh operation to run"
    , 'gh-message-operation': "Message to attach to the operation:"
    , 'action-on-checked-issues': "Check the issues to process and choose the action."
    , 'gh-close': "Close / remove"
    , 'gh-comment': "Comment"
    , 'gh-pin': 'Pin'
    , 'gh-unpin': 'Unpin'
    , 'git-installing-labels': "Defining Git labels"
    , 'git-init-btn': "Initialize Git on the project"
    , 'git-issue-gestion': "Github issue management"
    , 'backend-add-labels-ajout': " + label definition."
    , 'backend-git-ready': "Git ready for the folder"
    , 'backend-git-failed': "git $1 failed: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Select the service script in Finder then “OK”.'
    , 'scserv-end': 'Script-service finished successfully (no error at least).'
    , 'scserv-datetime-default-format': 'DD MM HH:MM (03 08 05:12 for Aug 3rd at 5:12)'
    , 'Opening-script-file': 'Opening the script file'
    , 'ask-for-modify-script-file': "Do you want to edit the script file (defining the steps)?"

    // -- Documentation --
    , 'Documentation': 'Documentation'
    , 'group-documentation': "Documentation"
    , 'docu-folder': 'Documentation folder'
    , 'editing-documentation': 'Edit the documentation'
    , 'initing-documentation': "Initialize the documentation"
    , 'update-documentation': 'Update the documentation'
    , 'open-documentation': 'Open the documentation'
    , 'select-docu-folder-and-ok': 'Select the folder in which to place the documentation, then “OK”.'
    , 'select-docu-folder': 'Select the documentation folder in Finder'
    , 'select-docu-main-file': 'Select the main documentation file (default: docu.adoc)'
    , 'select-doc-main-final-file': 'Select the manual file (default: docu.html)'
    , 'docu-main-file-name': 'Docu: editable file name'
    , 'docu-main-disp-file': 'Docu: published file name'
    , 'backend-docu-opened-in': "Documentation folder successfully opened in $1"

    // Archive
    , 'backend-archiv-move-and-num': "Moved to archive and renumbered $1"
    , 'backend-archiv-saved': "Version saved to archive."

    // Tools
    , 'tools-confirm-scheduling-alert': "Alert scheduled successfully."

    // Reminder / Rappels
    , 'remind-started': "Started"
    , 'remind-remove': "Remove"
    , 'scheduling-alert': "Scheduling an alert"
    , 'schedule-a-alert': "Schedule an alert"
    , 'hour-and-day-of-alert': "Alert time (and day if later)"
    , 'alert-message': "Alert message"

    // -- Todoist --
    , 'todoist-content'     : "content"
    , 'todoist-description' : "description"
    , 'todoist-due'         : "start"
    , 'todoist-deadline'    : "deadline"
    , 'todoist-duration'    : "duration"
    , 'todoist-priority'    : "priority"
    , 'todoist-labels'      : "labels"
    , 'todoist-repeat'      : "repeats"
    , 'task-due-to-start'   : "Sorry to interrupt you, but task “$1” must be started."

    , 'New task...': "New task…"
    , 'New task': "New task"
    , 'todoist-message-new-task': "Set the general parameters of this new task below. You can delete any unneeded parameter and use simplified markers (today, tomorrow, 4d, etc.)"
    , 'todoist-message-mod-task': "Redefine the task's parameters below."
    , 'todoist-default-fields-task': "content: $1\\\ndescription: $2\\\n\\\nstart: $3\\\nrepeats: $4\\\nduration: $5\\\npriority: $6\\\ndeadline: $7\\\nlabels: $8"
    , 'todoist-default-due-task': "DD/MM/YYYY at h:mm"
    , 'todoist-text-new-task': "✔ New task: $1"
    , 'todoist-text-mod-task': "✔ Task modified: $1"
    , 'todoist-project-title': "Project title in Todoist"
    , 'todoist-tasks': "Todoist tasks" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Please indicate below the title of project $1 in the Todoist application."
    , 'todoist-message-today-project-task': "List of today's tasks for project “$1”."
    , 'confirm-tasks-checks': "Confirming tasks"
    , 'ask-for-confirm-tasks-checks': "Please confirm the operations on the tasks of project “$1”.$2"
    , 'mark-task-checked': "Task “$1” should be marked as done."
    , 'todoist-fin-tasks-done-and-create': "The tasks of project “$1” have been updated (done: $2, new: $3)."
    , 'todoist-tasks-created-message': "The new tasks of project “$1” have been created ($2)."
    , 'todoist-new-task-title-errors': "Invalid task"
    , 'todoist-new-task-msg-correct-errors': "Please fix the errors below:"
    , 'todoist-no-task-done': "No task to mark as done."
    , 'todoist-no-new-task': "No new task."
    , 'todoist-modify-checked': "Modify ✔…"
    , 'todoist-errors-update-tasks': "Errors updating tasks"
    , 'todoist-message-actualisation': "Task update: new: $1, done: $2, modified: $3"
    // -- test --
    , 'test-raw':   'replaces $1'
    , 'test-array': 'replaces $1 and $2'
    , 'test-objet': 'replaces $ceci and ${cela}'

    // --- Finder ---
    , 'window-opened': "Window opened successfully."
    , 'folder-opened': "Folder opened successfully."

    // --- Git ---
    , 'git-init-success': "Git installed successfully."
    , 'Which-labels': "Labels?"
    , 'which-labels-to-create': "Labels to create (select none to leave them untouched)."

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm opened at folder."
    , 'terminal-opened-at-folder': "Terminal opened at folder."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - API Key"
    , 'which-todoist-api-key': "Please provide your Todoist API key (token)"

    // --- Documentation ---
    , 'docu-opened-in-browser': "Documentation opened."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "hour|hr|h"
    , 'regexp:relative-days': "day before yesterday|day after tomorrow|yesterday|tomorrow|today"
    , 'regexp:date-unit': "month|week|wk|day|d|hour|hr|h|minute|min|mn"
    , 'regexp:duration-in': "in ([0-9]+) (month|week|wk|day|d|hour|hr|h|minute|min|mn)s?"
    , 'regexp:every-prefix': "every "
    , 'regexp:day-word': "days"
    , 'regexp:weekdays': "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
    , 'regexp:of-month': "of the month"
    , 'regexp:unit-month': "month"
    , 'regexp:unit-week': "week|wk"
    , 'regexp:unit-day': "day|d"
    , 'regexp:unit-hour': "hour|hr|h"
    , 'regexp:unit-minute': "minute|min|mn"
    , 'regexp:day-before-yesterday': "day before yesterday"
    , 'regexp:yesterday': "yesterday"
    , 'regexp:today': "today"
    , 'regexp:tomorrow': "tomorrow"
    , 'regexp:day-after-tomorrow': "day after tomorrow"
}
