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
    , 'app-sorry-fatal-error': "Se ha producido un error fatal, le pedimos disculpas."
    , 'backend-app-project-unfound': "Proyecto $1 no encontrado en los archivos."
    , 'backend-unknown-action': "Acción desconocida: '$1'."
    , 'backend-access-unabled': "Board no tiene activado el permiso de Accesibilidad: Ajustes del Sistema → Privacidad y seguridad → Accesibilidad → activar Board."
    , 'backend-command-not-found': "El comando bash '$1' es desconocido."

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

    // File
    , 'backend-unfound-file': "Archivo no encontrado: $1"
    , 'backend-invalid-yaml': "Código YAML no válido ($1): $2"
    , 'backend-unfound-folder-unable-file': "La carpeta '$1' no se ha encontrado. No se puede crear con seguridad el archivo '$2'."
    , 'backend-unable-to-create-file': "No se ha podido crear el archivo $1."
    , 'backend-no-xml-file': "Todavía no hay lectura de archivos XML."
    , 'backend-version-no-num': "El archivo $1 no contiene número de versión, no se puede versionar."

    // Git
    , 'backend-unabled-labels': "No se han podido obtener las etiquetas existentes: $1"
    , 'backend-already-git': "Git ya está inicializado para este proyecto."
    , 'backend-unabled-to-destroy-labels': "No se han podido eliminar las etiquetas existentes: $1"
    , 'backend-unable-to-create-labels': "No se han podido crear las nuevas etiquetas: $1"
    , 'backend-remote-test-required': "Se requiere el remote git de prueba"
    , 'backend-not-a-git-folder': "Esta carpeta no es un repositorio git ($1)."
    , 'backend-not-a-git-repo': "La carpeta $1 no es un repositorio Git."
    , 'backend-git-unknown-ope': "Operación Git desconocida: $1"

    // Script
    , 'backend-script-unfound': "No se ha podido encontrar el script a ejecutar ($1)"

    // Documentation
    , 'docu-error-on-update': "Error durante la actualización"
    , 'backend-docu-unfound-folder': "La carpeta de documentación '$1' no se ha encontrado."

    // TODOIST
    , 'todoist-key-task-unknown': "La clave « $1 » es desconocida, para una tarea de Todoist."
    , 'no-tasks-checked': "Ninguna tarea marcada"
    , 'checked-only-modify-task': "Solo debe marcarse la tarea a modificar."
    , 'backend-todoist-unfound-project': "Proyecto « $1 » no encontrado en Todoist."
    , 'backend-task-error': "Tarea $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "Versión no archivada debido a un problema desconocido."
    , 'backend-archiv-unfound-folder': "Carpeta de archivos no encontrada: $1."

}
