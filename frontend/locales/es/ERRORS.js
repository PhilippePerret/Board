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
    , 'error-date': "La fecha '$1' no es válida. Formatos válidos: DD/MM/AAAA, 'mañana', 'pasado mañana', o 'en X horas/días/semanas/meses'."
    , 'deadline-before-start': "La fecha límite '$1' debe ser posterior a la fecha de inicio '$2'."
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
    , 'backend-open-file-failed': "No se pudo abrir el archivo '$1' con la aplicación '$2'."
    , 'scserv-abort': "Servicio cancelado"
    , 'Script-service-definition-error': 'Error de definición del Script-service'
    , 'Script-service-file-contains-errors': 'El archivo de definición del script-service contiene errores.'
    , 'scserv-unknown-step': "El paso con identificador '$1' es desconocido."
    , 'scserv-list-required': "El archivo YAML debería definir una lista de pasos ($1)."
    , 'scserv-type-required': "Un paso de script-service ($1) siempre debe tener un tipo ($2)."
    , 'scserv-id-required': "Un paso de script-service debe tener obligatoriamente un identificador ($1) ($2)."
    , 'scserv-id-invalid': "El identificador del paso $1 no es válido ($2)."
    , 'scserv-step-type-unknowned': "paso '$1': tipo de paso desconocido: $2 ($3)."
    , 'scserv-param-required': "paso '$1': el parámetro '$2' es obligatorio, para el tipo '$3' ($4)."
    , 'scserv-unknown-param': "paso '$1': el parámetro '$2' es desconocido para el servicio de tipo '$3' ($4)."
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

    // Date
    , 'invalid-date': "Fecha inválida: '$1': $2"

    // UI
    , 'no-open-window-in': "No hay ninguna ventana abierta en la aplicación $1."
    , 'app-unfound-or-close': "Aplicación $1 no encontrada o cerrada."

    // Finder
    , 'no-selection': "Sin selección"
    , 'not-a-folder': "La selección debería ser una carpeta"
    , 'backend-app-backup-failed': "La copia de seguridad diaria falló."
    , 'backend-app-backup-no-previous': "No hay ninguna copia de seguridad anterior disponible."
    , 'backend-app-backup-restore-failed': "La restauración de la copia de seguridad anterior falló."
    , 'unknown-syntax-file-extension': "Extensión no incluida en la tabla de verificación: $1."
    , 'invalid-value': "Valor inválido: $1."
    , 'git-commit-title-erros': "Errores ocurridos durante el commit"
    , 'git-status-not-clean': "El estado de Git no está limpio."
    , 'git-status-not-empty': "Aún quedan archivos/carpetas por confirmar."
    , 'git-branch-not-main': "Debería estar en la rama main."
    , 'git-status-added-both-sides': "añadido en ambos lados (contenidos diferentes)."
    , 'git-status-deleted-both-sides': "eliminado en ambos lados."
    , 'git-status-modified-both-sides': "modificado en ambos lados."
    , 'git-status-add-and-absent': "añadido por nosotros, ausente en el otro lado."
    , 'git-status-absent-and-add': "añadido en el otro lado, ausente en el nuestro."
    , 'git-status-deleted-and-modified': "eliminado por nosotros, modificado en el otro lado."
    , 'git-status-modified-and-deleted': "modificado por nosotros, eliminado en el otro lado."
    , 'git-bad-branch': "Está en la rama Git incorrecta. Esperada: $1."
    , 'git-commit-error': "Error de Git al confirmar los archivos: $1."
    , 'git-push-error': "Error de Git al hacer push de los commits: $1"
    , 'git-pr-create-error': "Error de GH al crear la pull request de Github: $1."
    , 'git-pr-waiting-checks-error': "Error de GH mientras se esperaba el check: $1."
    , 'git-pr-waiting-checks-failure': "Error de GH durante el check: una prueba falló."
    , 'git-unable-checkout-main': "Error de Git: no se puede volver a la rama principal ($1)."
    , 'git-unable-pr-merge': "Error de Git: no se puede fusionar la Pull Request ($1)."
    , 'git-commit-init-required': "Para poder confirmar sus archivos en un ciclo de PR de Github, primero debe iniciar este ciclo (principalmente: elegir una rama de desarrollo).\n\nSi esta rama ya está definida sin inicialización, puede indicarla en los datos del proyecto, en la propiedad `git_pr_cycle_branche`."
    , 'github-pr-cycle-require-clean-status-to-submit': "El envío de una PR de Github requiere un estado limpio (no debería quedar ningún archivo por confirmar).\n\nUtilice el servicio anterior para hacerlo."
    , 'git-unable-destroy-branch': "No se puede eliminar la rama Git: $1."
    , 'github-pr-cycle-branch-should-have-been-deleted': "No se puede eliminar la rama de desarrollo $1: $2"
    , 'git-init-no-push-permission': "No tiene permisos de escritura (push) en el repositorio de Github $1."
    , 'git-init-repo-exists-not-empty': "El repositorio de Github $1 ya existe y no está vacío.\n\n¿Está seguro de que es el repositorio correcto? Habrá que vaciarlo antes de poder usarlo con esta inicialización."
    , 'backend-github-api-error': "Error al consultar la API de Github: $1."
    , 'backend-github-repo-create-error': "Error al crear el repositorio de Github: $1."
    , 'project-data-invalid-bad-count': "Los datos del proyecto $1 para el servicio $2 no son válidos. $3 dato$5 esperado$5, $4 dato$6 proporcionado$6."
}
