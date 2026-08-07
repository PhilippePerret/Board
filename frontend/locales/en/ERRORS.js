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

    // Documentation
    , 'docu-error-on-update': "Error while updating"

    // TODOIST
    , 'todoist-key-task-unknown': "The key « $1 » is unknown, for a Todoist task."
    , 'no-tasks-checked': "No task checked"
    , 'checked-only-modify-task': "Only the task to modify must be checked."

}
