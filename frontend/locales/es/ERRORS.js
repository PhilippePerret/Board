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
    , 'hour-not-valid': "hora no válida: '$1'"
    , 'repeat-not-valid': "la repetición no es válida en '$1'"
    , 'error-duration': "La duración « $1 » debería tener la forma '&lt;número> &lt;unidad>' donde unidad puede ser 'mes', 'semana', 'día', 'hora', 'minuto' y sus abreviaturas (por ejemplo '12 h')."
    , 'prop-cant-be-empty': "La propiedad « $1 » no puede estar vacía."
    , 'must-be-num-between': "« $1 » debería ser un número entre $2 y $3"
    , 'invalid-phone-number': "El número de teléfono $1 no es válido."

    , 'select-project-to-what': "Hay que seleccionar el proyecto a $1."

    // --- Application ---
    , 'unknown-app-data': "Dato de aplicación desconocido: '$1'"

    // --- Projets ---
    , 'project-folder-not-selected': 'La carpeta del proyecto debe seleccionarse en Finder.'
    , 'folder-required': 'Es imprescindible elegir una carpeta.'
    , 'no-current-projet': "Ningún proyecto actual."
    , '--untitled-project--': '-proyecto sin título-'

    // Services
    , 'serv-error-on-return': "Error en la respuesta del servicio"
    , 'service-requires-a-name': "Un servicio debe tener un :name. ($1)"

    // Scripts services
    , 'scserv-abort': "Servicio cancelado"
    , 'Script-service-definition-error': 'Error de definición del Script-service'
    , 'Script-service-file-contains-errors': 'El archivo de definición del script-service contiene errores.'
    , 'scserv-unknown-step': "El paso con identificador '$1' es desconocido."
    , 'scserv-list-required': "El archivo YAML debería definir una lista de pasos ($1)."
    , 'scserv-type-required': "Un paso de script-service ($1) siempre debe tener un tipo ($2)."
    , 'scserv-id-required': "Un paso de script-service debe tener obligatoriamente un identificador ($1) ($2)."
    , 'scserv-id-invalid': "El identificador del paso $1 no es válido ($2)."
    , 'scserv-step-type-unknowned': "tipo de paso desconocido: $1 ($2)."
    , 'scserv-param-required': "El parámetro '$1' es obligatorio, para el tipo '$2' ($3)."
    , 'scserv-unknown-param': "El parámetro '$1' es desconocido para el servicio de tipo '$2' ($3)."
    , 'scserv-param-bad-type': "El parámetro '$1' no tiene el tipo correcto. Esperado: $2, actual: $3 ($4)."
    , 'scserv-on-get-file-values': "Se produjo un error al intentar leer los datos del archivo '$1': $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "El select del paso $1, cuyos datos son tablas, requiere el parámetro key_value que define el valor del menú ($2)"
    , 'scserv-select-with-object-requires-title-values': "El select del paso $1, cuyos datos son tablas, requiere el parámetro key_title que define el título del menú ($2)"
    , 'scserv-select-with-object-unknown-key': "Para el select del paso $1, el objeto $2 no define la clave '$3' para el valor ($4)."
    , 'scserv-select-with-object-unknown-title': "Para el select del paso $1, el objeto $2 no define la clave '$3' para el título ($4)."
    , 'scserv-unknown-evaluator': "El evaluador del paso '$1' es desconocido: $2 ($3)."
    , 'scserv-unknown-marker-translate': "El marcador de traducción '$1' del paso '$2' es desconocido. Los marcadores posibles son: $3 ($4)."

    // Documentation
    , 'docu-error-on-update': "Error durante la actualización"

    // TODOIST
    , 'todoist-key-task-unknown': "La clave « $1 » es desconocida, para una tarea de Todoist."
    , 'no-tasks-checked': "Ninguna tarea marcada"
    , 'checked-only-modify-task': "Solo debe marcarse la tarea a modificar."

}
