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
    , 'hour-not-valid': "invalid time: '$1'"
    , 'repeat-not-valid': "the repetition is not valid in '$1'"
    , 'error-duration': "The duration « $1 » should have the form '&lt;number> &lt;unit>' where unit can be 'month', 'week', 'day', 'hour', 'minute' and their abbreviations (for example '12 h')."
    , 'prop-cant-be-empty': "The property « $1 » cannot be empty."
    , 'must-be-num-between': "« $1 » should be a number between $2 and $3"
    , 'invalid-phone-number': "The phone number $1 is invalid."

    , 'select-project-to-what': "The project to $1 must be selected."

    // --- Application ---
    , 'unknown-app-data': "Unknown application data: '$1'"
    , 'app-sorry-fatal-error': "A fatal error occurred, please accept our apologies."
    , 'backend-app-project-unfound': "Project $1 not found in the archives."
    , 'backend-unknown-action': "Unknown action: '$1'."
    , 'backend-access-unabled': "Board does not have Accessibility permission enabled: System Settings → Privacy & Security → Accessibility → check Board."
    , 'backend-command-not-found': "The bash command '$1' is unknown."

    // --- Projets ---
    , 'project-folder-not-selected': 'The project folder must be selected in Finder.'
    , 'folder-required': 'A folder must be chosen.'
    , 'no-current-projet': "No current project."
    , '--untitled-project--': '-untitled project-'

    // Services
    , 'serv-error-on-return': "Error on service return"
    , 'service-requires-a-name': "A service must have a :name. ($1)"

    // Scripts services
    , 'scserv-abort': "Service aborted"
    , 'Script-service-definition-error': 'Script-service definition error'
    , 'Script-service-file-contains-errors': 'The script-service definition file contains errors.'
    , 'scserv-unknown-step': "The step with identifier '$1' is unknown."
    , 'scserv-list-required': "The YAML file should define a list of steps ($1)."
    , 'scserv-type-required': "A script-service step ($1) must always have a type ($2)."
    , 'scserv-id-required': "A script-service step must absolutely have an identifier ($1) ($2)."
    , 'scserv-id-invalid': "The identifier of step $1 is not valid ($2)."
    , 'scserv-step-type-unknowned': "unknown step type: $1 ($2)."
    , 'scserv-param-required': "Parameter '$1' is required, for type '$2' ($3)."
    , 'scserv-unknown-param': "Parameter '$1' is unknown for the service of type '$2' ($3)."
    , 'scserv-param-bad-type': "Parameter '$1' does not have the right type. Expected: $2, actual: $3 ($4)."
    , 'scserv-on-get-file-values': "An error occurred while trying to read the data of file '$1': $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "The select of step $1, whose data are tables, requires the key_value parameter defining the menu value ($2)"
    , 'scserv-select-with-object-requires-title-values': "The select of step $1, whose data are tables, requires the key_title parameter defining the menu title ($2)"
    , 'scserv-select-with-object-unknown-key': "For the select of step $1, object $2 does not define the key '$3' for the value ($4)."
    , 'scserv-select-with-object-unknown-title': "For the select of step $1, object $2 does not define the key '$3' for the title ($4)."
    , 'scserv-unknown-evaluator': "The evaluator of step '$1' is unknown: $2 ($3)."
    , 'scserv-unknown-marker-translate': "The translation marker '$1' of step '$2' is unknown. Possible markers are: $3 ($4)."

    // File
    , 'backend-unfound-file': "File not found: $1"
    , 'backend-invalid-yaml': "Invalid YAML code ($1): $2"
    , 'backend-unfound-folder-unable-file': "The folder '$1' was not found. Cannot safely create the file '$2'."
    , 'backend-unable-to-create-file': "The file $1 could not be created."
    , 'backend-no-xml-file': "No XML file reading yet."
    , 'backend-version-no-num': "The file $1 has no version number, it cannot be versioned."

    // Git
    , 'backend-unabled-labels': "Unable to retrieve existing labels: $1"
    , 'backend-already-git': "Git is already initialized for this project."
    , 'backend-unabled-to-destroy-labels': "Unable to delete existing labels: $1"
    , 'backend-unable-to-create-labels': "Unable to create new labels: $1"
    , 'backend-remote-test-required': "The test git remote is required"
    , 'backend-not-a-git-folder': "This folder is not a git repository ($1)."
    , 'backend-not-a-git-repo': "The folder $1 is not a Git repository."
    , 'backend-git-unknown-ope': "Unknown Git operation: $1"

    // Script
    , 'backend-script-unfound': "Unable to find the script to run ($1)"

    // Documentation
    , 'docu-error-on-update': "Error while updating"
    , 'backend-docu-unfound-folder': "The documentation folder '$1' was not found."

    // TODOIST
    , 'todoist-key-task-unknown': "The key « $1 » is unknown, for a Todoist task."
    , 'no-tasks-checked': "No task checked"
    , 'checked-only-modify-task': "Only the task to modify must be checked."
    , 'backend-todoist-unfound-project': "Project « $1 » not found in Todoist."
    , 'backend-task-error': "Task $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "Version not archived due to an unknown problem."
    , 'backend-archiv-unfound-folder': "Archive folder not found: $1."

    // Date
    , 'invalid-date': "Invalid date: '$1': $2"

    // UI
    , 'no-open-window-in': "No window open in application $1."
    , 'app-unfound-or-close': "Application $1 not found or closed."

    // Finder
    , 'no-selection': "No selection"
    , 'not-a-folder': "The selection should be a folder"
}
