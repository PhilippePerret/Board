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
    , 'error-date': "The date '$1' is invalid. Valid formats: DD/MM/YYYY, 'tomorrow', 'day after tomorrow', or 'in X hours/days/weeks/months'."
    , 'deadline-before-start': "The deadline '$1' must be after the start date '$2'."
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
    , 'backend-open-file-failed': "Unable to open the file '$1' with the application '$2'."
    , 'scserv-abort': "Service aborted"
    , 'Script-service-definition-error': 'Script-service definition error'
    , 'Script-service-file-contains-errors': 'The script-service definition file contains errors.'
    , 'scserv-unknown-step': "The step with identifier '$1' is unknown."
    , 'scserv-list-required': "The YAML file should define a list of steps ($1)."
    , 'scserv-type-required': "A script-service step ($1) must always have a type ($2)."
    , 'scserv-id-required': "A script-service step must absolutely have an identifier ($1) ($2)."
    , 'scserv-id-invalid': "The identifier of step $1 is not valid ($2)."
    , 'scserv-step-type-unknowned': "step '$1': unknown step type: $2 ($3)."
    , 'scserv-param-required': "step '$1': parameter '$2' is required, for type '$3' ($4)."
    , 'scserv-unknown-param': "step '$1': parameter '$2' is unknown for the service of type '$3' ($4)."
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
    , 'backend-app-backup-failed': "The daily backup failed."
    , 'backend-app-backup-no-previous': "No previous backup available."
    , 'backend-app-backup-restore-failed': "Restoring the previous backup failed."
    , 'unknown-syntax-file-extension': "Extension not listed in the check table: $1."
    , 'invalid-value': "Invalid value: $1."
    , 'git-commit-title-erros': "Errors occurred during the commit"
    , 'git-status-not-clean': "The Git status is not clean."
    , 'git-status-not-empty': "Files/folders still need to be committed."
    , 'git-branch-not-main': "You should be on the main branch."
    , 'git-status-added-both-sides': "added on both sides (different contents)."
    , 'git-status-deleted-both-sides': "deleted on both sides."
    , 'git-status-modified-both-sides': "modified on both sides."
    , 'git-status-add-and-absent': "added by us, absent on the other side."
    , 'git-status-absent-and-add': "added on the other side, absent for us."
    , 'git-status-deleted-and-modified': "deleted by us, modified on the other side."
    , 'git-status-modified-and-deleted': "modified by us, deleted on the other side."
    , 'git-bad-branch': "You are on the wrong Git branch. Expected: $1."
    , 'git-commit-error': "Git error while committing files: $1."
    , 'git-push-error': "Git error while pushing the commits: $1"
    , 'git-pr-create-error': "GH error while creating the Github pull request: $1."
    , 'git-pr-waiting-checks-error': "GH error while waiting for the check: $1."
    , 'git-pr-waiting-checks-failure': "GH error during the check: a test failed."
    , 'git-unable-checkout-main': "Git error: unable to return to the main branch ($1)."
    , 'git-unable-pr-merge': "Git error: unable to merge the Pull Request ($1)."
    , 'git-commit-init-required': "To commit your files in a Github PR Cycle, you must first initiate this cycle (mainly: choose a development branch).\n\nIf this branch is already defined without initialization, you can set it in the project data, in the `git_pr_cycle_branche` property."
    , 'github-pr-cycle-require-clean-status-to-submit': "Submitting a Github PR requires a clean status (no file should remain to be committed).\n\nUse the previous service to do so."
    , 'git-unable-destroy-branch': "Unable to delete the Git branch: $1."
    , 'github-pr-cycle-branch-should-have-been-deleted': "Unable to delete the development branch $1: $2"
    , 'git-init-no-push-permission': "You do not have write (push) permissions on the Github repository $1."
    , 'git-init-repo-exists-not-empty': "The Github repository $1 already exists and is not empty.\n\nAre you sure this is the right repository? It will need to be emptied before it can be used with this initialization."
    , 'backend-github-api-error': "Error while querying the Github API: $1."
    , 'backend-github-repo-create-error': "Error while creating the Github repository: $1."
    , 'project-data-invalid-bad-count': "The data of project $1 for service $2 is invalid. $3 data$5 expected, $4 data$6 provided."
}
