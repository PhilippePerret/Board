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
    , 'Board': "Panel"
    , 'Help': "Ayuda"
    , 'Debug': "Debug"
    , 'Tools': "Herramientas"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Sí"
    , 'btn-no': "No"
    , 'OK': 'OK'
    , 'GO!': '¡YA!'
    , ':'   :   ': '
    , 'new…': "Nuevo…"
    , 'None': 'Ninguno'
    , 'Nonee': 'Ninguna'
    , 'Empty': 'Vacío'
    , 'error:': "Error:"
    , 'other-value…': 'Otro valor…'
    , 'date/at': 'a las' // pour une date avec heure
    , 'Cancel': "Cancelar"
    , 'Correct': "Corregir"
    , 'its-noted': "Entendido"
    , 'remind-me-later': "Recordármelo más tarde"
    , '(by-default)': "(por defecto)"
    , 'Color': 'Color'
    , 'Image': 'Imagen'
    , 'Nothing': 'Nada'
    , 'This-one': 'Este'
    , 'This-onee': "Esta"
    , 'Preserve': "Conservar"
    , 'app-to-use': "Aplicación a usar"
    , 'choosing-files-to': "Elección de los archivos a $1"
    , 'choose-files-to': "Elige los archivos a $1"
    , 'select-filter-placeholder': "Filtrar…"
    , 'fatal-error': "Error fatal"
    , 'ope-aborted': 'Operación cancelada'
    , 'samples': "Muestras" // (musique)
    , 'work-duration:': 'Tiempo de trabajo: '
    , 'created-at:': 'creado: '
    , 'modify-at:': '/mod.: '
    , 'url-definition': 'Definición de URL'

    // Verbes
    , 'vb-commit': 'hacer commit'
    , 'Ignore': 'Ignorar'
    , 'Finish': "Terminar" // dans le sens d'un ordre donné
    , 'Apply': "Aplicar"
    , 'Import': 'Importar'
    , 'sustract': "quitar"
    , 'Open-url…': 'Abrir la URL…'
    , 'modify-it': 'Modificarlo'
    , 'Validate': 'Validar'

    // Logique
    , 'id-is-required': "Se requiere un identificador (`id`)"
    , 'type-is-required': "El tipo debe estar definido."

    // Data
    , 'path-to-data': "Ruta de los datos"
    , 'id-in-data': 'ID en los datos (si es necesario)'

    // Prompt
    , 'Parameter-definition': 'Definición de parámetro'

    // File
    , 'add-to-file-at': "Añadir a un archivo, en cualquier lugar"
    , 'which-url-to-reach': '¿Qué URL hay que alcanzar?'
    , 'destination-folder-or-file': 'Destino (carpeta o archivo)'
    , 'backend-file-created': "El archivo $1 ha sido creado."

    // App
    , 'app-config': 'Configuración de la aplicación'
    , 'app-version': 'Versión de la aplicación'
    , 'remember-last-project': 'Recordar el último proyecto'
    , 'default-browser': 'Navegador predeterminado'
    , 'code-editor': 'Editor de código'
    , 'text-simple-editor': 'Editor de texto simple'
    , 'yaml-editor': 'Editor YAML'
    , 'docu-editor': 'Editor de documentación'
    , 'docu-folder-name': 'Nombre de la carpeta de documentación'
    , 'changelog-file-name': 'Nombre del archivo changelog'
    , 'todo-file-name': 'Nombre del archivo TODO'
    , 'last-project-id': 'Último proyecto seleccionado'
    , 'backend-app-data-save': "Datos de la aplicación guardados."

    // Minuteur
    , 'work-session-duration': 'Duración de una sesión de trabajo (minutos)'
    , 'work-section-duration': 'Duración de un bloque de trabajo (minutos)'
    , 'start-clock': 'Iniciar el reloj'
    , 'clock-work-done': 'Trabajo realizado durante la sesión: '
    , 'clock-work-is-done': "Has llegado al límite de trabajo"
    , 'clock-10-minutes-remaining': "Te quedan 10 minutos de trabajo"
    , 'of-work-on-project': " en el proyecto “$1”."
    , 'clock-ask-work-restarted': "¿Se ha reanudado el trabajo?"
    , 'clock-todo-next-session': "Trabajo por hacer en la próxima sesión: "
    , 'clock-work-time': "Tiempo de trabajo:"
    , 'clock-restart': 'Reiniciar'
    , 'Confirm': 'Confirmar'
    , 'End-of-session': 'Fin de la sesión'
    , 'Find': "Buscar"
    , 'file-opened': "El archivo '$1' está abierto."
    , 'Minuteur': "Temporizador"
    , 'Next': 'Siguiente'
    , 'Save': 'Guardar'
    , 'scripts': "Scripts"
    , 'ask-still-working': "¿Se sigue trabajando en el proyecto “$1”?"

    // --- UI ---
    , 'Window-position-and-size': 'Posición y tamaño de la ventana'
    , 'which-widhow-app': '¿De qué aplicación hay que tener en cuenta la ventana en primer plano?' + '<div class="small">Su tamaño y posición se copiarán en el portapapeles</div>'
    , 'window-position-and-size': "Posición y tamaño de la ventana en primer plano en la aplicación $1:"
    , 'click-button-if-data-ok': "Si estos datos son correctos, haz clic en el botón “$1”"
    , 'countdown-timer': "Temporizador"
    , 'lifecycle': "Ciclo de vida"
    , 'open-folder-project': "Abrir la carpeta del proyecto"
    , 'opening': "Apertura"
    , 'run-a-script': "Ejecutar un script"
    , 'run-a-script-service': "Ejecutar un script-service"
    , 'Defining-a-color': "Definición de un color"
    , 'choose-a-color': "Selecciona un color con el selector de abajo."
    , 'group-tools': "Herramientas"
    , 'error-precise-description:': "Descripción precisa del error:"
    , 'clock-set-pause': "Poner en pausa"

    // --- PROJETS ---
    , 'current-projects-displayed': "Proyectos actuales mostrados."
    , 'data-project-id': 'ID del proyecto'
    , 'data-project-icon': 'Icono del proyecto'
    , 'data-project-folder': 'Carpeta del proyecto'
    , 'data-project-title': "Título del proyecto"
    , 'data-project-nature': "Naturaleza del proyecto"
    , 'importing-new-project': "Importación de un nuevo proyecto"
    , 'data-project-standby': 'Poner el proyecto en espera'
    , 'data-project-todoist': 'ID del proyecto en Todoist'
    , 'data-github-account': 'Cuenta Github (del proyecto)'
    , 'data-project-createdat': "Fecha de creación del proyecto"
    , 'data-project-lastmod': 'Fecha de la última modificación'
    , 'duration-work-done': 'Duración de trabajo realizada (min)'
    , 'background-img-or-color': 'Color o imagen de fondo'
    , 'githug-label-desc': "Etiquetas de issues de Github"

    , 'title-project': "Proyecto “$1”"
    , 'new-project-name': "Nombre del nuevo proyecto"
    , 'name-to-give-to-project': "Nombre a dar a este proyecto"
    , 'title-data-of-project': "Datos del proyecto “$1”"
    , 'select-project-folder-and-ok': "Selecciona la carpeta del proyecto en Finder, luego haz clic en “OK”."
    , 'project-saved-success': "Proyecto « $1 » guardado con éxito a las $2."
    , 'alert-before-edit-projet': "Atención, datos sensibles. Continúa solo si sabes lo que haces."
    , 'expli-retrait-projet': "Quitar el proyecto “$1” no afecta a su carpeta en sí. Solo se retira de este panel o se archiva (para poder recuperarlo más tarde)\n\nAtención, si el proyecto no se archiva, todos sus servicios y datos se perderán, por supuesto."
    , 'project-folder-not-selected': 'La carpeta del proyecto debe seleccionarse en Finder'
    , 'folder-required': 'Es imprescindible elegir una carpeta.'
    , 'Other-genre': "Otro tipo…"
    , 'editing-project-data': "Editar los datos del proyecto"
    , 'versionning-which-num': '¿Qué número hay que actualizar?'
    , 'versionning-patch': 'Patch'
    , 'versionning-minor': 'Versión menor'
    , 'versionning-major': 'Versión mayor'
    , 'select-archives-folder': 'Selecciona la carpeta de archivos en Finder (o ninguna si el archivo no debe archivarse).'
    , 'archives…': "Archivos…"
    , 'confirming-import': "Confirmación de la importación"
    , 'confirming-project-substract': "Confirmación de la eliminación del proyecto"
    , 'project-substracted': "Proyecto retirado de la lista de proyectos."
    , 'ending-startup-project-x': "Fin del inicio del proyecto “$1”."
    , 'modifying-project-title': "Modificación del título del proyecto"
    , 'click-to-modify-title': 'Haz clic para modificar el título'
    // Projet et Service
    , 'startup-services': 'Servicios de inicio'
    , 'others-services': 'Otros servicios'
    // Projet et Todoist
    , 'todoist-tasks': 'Tareas de Todoist'
    // Projet et archives
    , 'archived-projects': "Proyectos archivados"
    , 'choose-project-to-restart': "Elige el proyecto a reactivar."

    // Finder
    , 'open-file…': 'Abrir el archivo…'
    , 'file-to-open': "Archivo a abrir"
    , 'opening-window-in-finder': 'Abrir una ventana en Finder'
    , 'sidebar-setting': "Ajuste de la barra lateral"
    , 'sidebar?': "¿Quieres la barra lateral?"
    , 'what-size-for-sidebar': '¿Qué tamaño darle a la barra lateral (pon 0 para ocultarla)?'
    , 'Choosing-finder-element': "Elección de un elemento de Finder"
    , 'select-el-in-finder-and-ok': "Selecciona el elemento en Finder y haz clic en OK."    , 'which-url': "¿Qué URL hay que alcanzar?"
    , 'select-file-in-finder-and-btn': "Selecciona el archivo a abrir en Finder, luego “Elegir”."
    , 'Choosing-a-folder': "Elección de una carpeta"
    , 'select-folder-and-ok': "Selecciona la carpeta en Finder y haz clic en OK."
    , 'select-el-in-project-and-ok': "Selecciona el elemento en la carpeta del proyecto y haz clic en OK."
    , 'set-window-in-finder-and-ok': "Abre la ventana en Finder y ajústala como desees (posición, tamaño, tipo de vista) luego haz clic en OK."
    , 'pos-window-in-finder-and-ok' : "Posiciona la ventana en Finder y haz clic en “OK”."
    , 'sel-el-in-finder-or-click-none' : "Selecciona el elemento en Finder o haz clic en 'Ninguno'."

    // -- Service --
    , 'Common-services': 'Servicios comunes'
    , 'Custom-services': 'Servicios personalizados'
    , 'running-service-x': "Iniciando el servicio $1…"
    , 'service-success': ' Servicio “$1” ejecutado con éxito (<span class="tiny">(servicio $2)</span>).'
    , 'service-exec-bash-code': 'Ejecutar código bash…'
    , 'service-exec-js-code': "Ejecutar código JS…"
    , 'ask-for-code-to-exec': 'Código a ejecutar:'
    , 'ask-save-work-time': '¿Hay que guardar el tiempo de trabajo?'
    , 'Defining-parameter': 'Definición de parámetro'
    , 'app-choice': "Elección de una aplicación"
    , 'choose-app-to-use': 'Elige la aplicación a usar'
    , 'other-app': 'Otra aplicación…'
    , 'new-service-name': 'Nuevo nombre del servicio'
    , 'which-name-for-project-service': '¿Qué nuevo nombre darle a este servicio para el proyecto?'
    , 'choose-color-or-image': "Elegir un color o una imagen"
    , 'which-background': '¿Qué quieres elegir como fondo?'
    , 'phone-number': 'Número de teléfono'
    , 'which-phone-number': 'Por favor, proporciona un número de teléfono válido.'
    , 'date-and-hour': 'Fecha y hora'
    , 'versioning-file': 'Versionar un archivo/carpeta'
    , "Service supprimé ($1)": "Servicio eliminado ($1)"
    , 'Learn-to-select-the-service': "Aprender a seleccionar el servicio"
    , 'aborted-definition': 'Definición cancelada.'
    // Scripts-services
    , 'Scripts-services': "Script service"
    , 'script-service-canceled': "Script-service cancelado."

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm en la carpeta'
    , 'terminal-at-folder': 'Terminal en la carpeta'
    , 'open-in-vscode': 'Abrir en VSCode'
    , 'code-to-run-at-launch': 'Código a ejecutar al iniciar'
    // Git
    , 'gh-save-a-error': "Guardar un error (gh)"
    , 'initing-git-for-project': "Inicializar Git para el proyecto"
    , 'github-account': "Nombre de tu cuenta de Github"
    , 'github-project-name': "Nombre del proyecto en Github"
    , 'git-committing': "Hacer commit en Github"
    , 'git-message-commit': 'Mensaje de commit para estos archivos'
    , 'git-commit-message-title': "Mensaje del commit"
    , 'gh-issues-create': "Nueva issue de tipo…"
    , 'git-issue-list': "Issues de tipo…"
    , 'github-label': "Etiqueta Github:"
    , 'Message:': "Mensaje:"
    , 'gh-description:': "Descripción más precisa:"
    , 'gh-operation': "Operación gh a ejecutar"
    , 'gh-message-operation': "Mensaje a asociar con la operación:"
    , 'action-on-checked-issues': "Marca las issues a tratar y elige la acción."
    , 'gh-close': "Cerrar / eliminar"
    , 'gh-comment': "Comentar"
    , 'gh-pin': 'Fijar'
    , 'gh-unpin': 'Desfijar'
    , 'git-installing-labels': "Definición de las etiquetas Git"
    , 'git-init-btn': "Inicializar Git en el proyecto"
    , 'git-issue-gestion': "Gestión de issues de Github"
    , 'backend-add-labels-ajout': " + definición de las etiquetas."
    , 'backend-git-ready': "Git preparado para la carpeta"
    , 'backend-git-failed': "git $1 ha fallado: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Selecciona el script del servicio en Finder, luego “OK”.'
    , 'scserv-end': 'Script-service terminado con éxito (al menos sin errores).'
    , 'scserv-datetime-default-format': 'DD MM HH:MM (03 08 05:12 para el 3 de agosto a las 5:12)'
    , 'Opening-script-file': 'Apertura del archivo de script'
    , 'ask-for-modify-script-file': "¿Quieres modificar el archivo del script (que define los pasos)?"

    // -- Documentation --
    , 'Documentation': 'Documentación'
    , 'group-documentation': "Documentación"
    , 'docu-folder': 'Carpeta de documentación'
    , 'editing-documentation': 'Editar la documentación'
    , 'initing-documentation': "Inicializar la documentación"
    , 'update-documentation': 'Actualizar la documentación'
    , 'open-documentation': 'Abrir la documentación'
    , 'select-docu-folder-and-ok': 'Selecciona la carpeta en la que colocar la documentación, luego “OK”.'
    , 'select-docu-folder': 'Selecciona la carpeta de documentación en Finder'
    , 'select-docu-main-file': 'Selecciona el archivo principal de documentación (por defecto: docu.adoc)'
    , 'select-doc-main-final-file': 'Selecciona el archivo del manual (por defecto: docu.html)'
    , 'docu-main-file-name': 'Docu: nombre del archivo editable'
    , 'docu-main-disp-file': 'Docu: nombre del archivo publicado'
    , 'backend-docu-opened-in': "Carpeta de documentación abierta con éxito en $1"

    // Archive
    , 'backend-archiv-move-and-num': "Movido al archivo y renumerado $1"
    , 'backend-archiv-saved': "Versión guardada en archivos."

    // Tools
    , 'tools-confirm-scheduling-alert': "Alerta programada con éxito."

    // Reminder / Rappels
    , 'remind-started': "Iniciada"
    , 'remind-remove': "Eliminar"
    , 'scheduling-alert': "Programación de una alerta"
    , 'schedule-a-alert': "Programar una alerta"
    , 'hour-and-day-of-alert': "Hora de la alerta (y día si es posterior)"
    , 'alert-message': "Mensaje de la alerta"

    // -- Todoist --
    , 'todoist-content'     : "contenido"
    , 'todoist-description' : "descripción"
    , 'todoist-due'         : "inicio"
    , 'todoist-deadline'    : "vencimiento"
    , 'todoist-duration'    : "duración"
    , 'todoist-priority'    : "prioridad"
    , 'todoist-labels'      : "etiquetas"
    , 'todoist-repeat'      : "se repite"
    , 'task-due-to-start'   : "Perdona la interrupción, pero la tarea “$1” debe comenzar."

    , 'New task...': "Nueva tarea…"
    , 'New task': "Nueva tarea"
    , 'todoist-message-new-task': "Define abajo los parámetros generales de esta nueva tarea. Puedes eliminar los parámetros innecesarios y usar marcadores simplificados (today, tomorrow, 4d, etc.)"
    , 'todoist-message-mod-task': "Redefine abajo los parámetros de la tarea."
    , 'todoist-default-fields-task': "contenido: $1\\\ndescripción: $2\\\n\\\ninicio: $3\\\nse repite: $4\\\nduración: $5\\\nprioridad: $6\\\nvencimiento: $7\\\netiquetas: $8"
    , 'todoist-default-due-task': "DD/MM/AAAA a las h:mm"
    , 'todoist-text-new-task': "✔ Nueva tarea: $1"
    , 'todoist-text-mod-task': "✔ Tarea modificada: $1"
    , 'todoist-project-title': "Título del proyecto en Todoist"
    , 'todoist-tasks': "Tareas de Todoist" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Por favor, indica abajo el título del proyecto $1 en la aplicación Todoist."
    , 'todoist-message-today-project-task': "Lista de tareas de hoy para el proyecto “$1”."
    , 'confirm-tasks-checks': "Confirmación de las tareas"
    , 'ask-for-confirm-tasks-checks': "Por favor, confirma las operaciones sobre las tareas del proyecto “$1”.$2"
    , 'mark-task-checked': "La tarea “$1” debe marcarse como completada."
    , 'todoist-fin-tasks-done-and-create': "Las tareas del proyecto “$1” se han actualizado (completadas: $2, nuevas: $3)."
    , 'todoist-tasks-created-message': "Las nuevas tareas del proyecto “$1” se han creado ($2)."
    , 'todoist-new-task-title-errors': "Tarea no válida"
    , 'todoist-new-task-msg-correct-errors': "Por favor, corrige los errores de abajo:"
    , 'todoist-no-task-done': "Ninguna tarea que marcar como completada."
    , 'todoist-no-new-task': "Ninguna tarea nueva."
    , 'todoist-modify-checked': "Modificar ✔…"
    , 'todoist-errors-update-tasks': "Errores al actualizar las tareas"
    , 'todoist-message-actualisation': "Actualización de tareas: nuevas: $1, completadas: $2, modificadas: $3"
    // -- test --
    , 'test-raw':   'reemplaza $1'
    , 'test-array': 'reemplaza $1 y $2'
    , 'test-objet': 'reemplaza $ceci y ${cela}'

    // --- Finder ---
    , 'window-opened': "Ventana abierta con éxito."
    , 'folder-opened': "Carpeta abierta con éxito."

    // --- Git ---
    , 'git-init-success': "Git instalado con éxito."
    , 'Which-labels': "¿Etiquetas?"
    , 'which-labels-to-create': "Etiquetas a crear (no seleccionar ninguna para no tocarlas)."

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm abierto en la carpeta."
    , 'terminal-opened-at-folder': "Terminal abierto en la carpeta."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - Clave API"
    , 'which-todoist-api-key': "Indica tu clave API (token) de Todoist"

    // --- Documentation ---
    , 'docu-opened-in-browser': "Documentación abierta."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "hora|h"
    , 'regexp:relative-days': "anteayer|pasado mañana|ayer|mañana|hoy"
    , 'regexp:date-unit': "mes|meses|semana|semanas|sem|día|días|d|hora|horas|h|minuto|minutos|min"
    , 'regexp:duration-in': "en ([0-9]+) (mes|meses|semana|semanas|sem|día|días|d|hora|horas|h|minuto|minutos|min)"
    , 'regexp:every-prefix': "cada "
    , 'regexp:day-word': "días"
    , 'regexp:weekdays': "lunes|martes|miércoles|jueves|viernes|sábado|domingo"
    , 'regexp:of-month': "del mes"
    , 'regexp:unit-month': "mes|meses"
    , 'regexp:unit-week': "semana|semanas|sem"
    , 'regexp:unit-day': "día|días|d"
    , 'regexp:unit-hour': "hora|horas|h"
    , 'regexp:unit-minute': "minuto|minutos|min"
    , 'regexp:day-before-yesterday': "anteayer"
    , 'regexp:yesterday': "ayer"
    , 'regexp:today': "hoy"
    , 'regexp:tomorrow': "mañana"
    , 'regexp:day-after-tomorrow': "pasado mañana"
}
