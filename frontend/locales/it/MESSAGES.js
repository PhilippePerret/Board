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
    , 'Board': "Bacheca"
    , 'Help': "Aiuto"
    , 'Debug': "Debug"
    , 'Tools': "Strumenti"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Sì"
    , 'btn-no': "No"
    , 'OK': 'OK'
    , 'GO!': 'VIA!'
    , ':'   :   ': '
    , 'new…': "Nuovo…"
    , 'None': 'Nessuno'
    , 'Nonee': 'Nessuna'
    , 'Empty': 'Vuoto'
    , 'error:': "Errore:"
    , 'other-value…': 'Altro valore…'
    , 'date/at': 'alle' // pour une date avec heure
    , 'Cancel': "Annulla"
    , 'Correct': "Correggi"
    , 'its-noted': "Va bene"
    , 'remind-me-later': "Ricordamelo più tardi"
    , '(by-default)': "(predefinito)"
    , 'Color': 'Colore'
    , 'Image': 'Immagine'
    , 'Nothing': 'Niente'
    , 'This-one': 'Questo'
    , 'This-onee': "Questa"
    , 'Preserve': "Conserva"
    , 'app-to-use': "Applicazione da usare"
    , 'choosing-files-to': "Scelta dei file da $1"
    , 'choose-files-to': "Scegli i file da $1"
    , 'select-filter-placeholder': "Filtra…"
    , 'fatal-error': "Errore fatale"
    , 'ope-aborted': 'Operazione annullata'
    , 'samples': "Campioni" // (musique)
    , 'work-duration:': 'Tempo di lavoro: '
    , 'created-at:': 'creato: '
    , 'modify-at:': '/mod.: '
    , 'url-definition': 'Definizione URL'

    // Verbes
    , 'vb-commit': 'fare il commit'
    , 'Ignore': 'Ignora'
    , 'Finish': "Termina" // dans le sens d'un ordre donné
    , 'Apply': "Applica"
    , 'Import': 'Importa'
    , 'sustract': "rimuovere"
    , 'Open-url…': 'Apri URL…'
    , 'modify-it': 'Modificarlo'
    , 'Validate': 'Convalida'

    // Logique
    , 'id-is-required': "Un identificatore (`id`) è obbligatorio"
    , 'type-is-required': "Il tipo deve essere definito."

    // Data
    , 'path-to-data': "Percorso dei dati"
    , 'id-in-data': 'ID nei dati (se necessario)'

    // Prompt
    , 'Parameter-definition': 'Definizione del parametro'

    // File
    , 'add-to-file-at': "Aggiunta a un file, in un punto qualsiasi"
    , 'which-url-to-reach': 'Quale URL bisogna raggiungere?'
    , 'destination-folder-or-file': 'Destinazione (cartella o file)'
    , 'backend-file-created': "Il file $1 è stato creato."

    // App
    , 'app-config': 'Configurazione dell’applicazione'
    , 'app-version': 'Versione dell’applicazione'
    , 'remember-last-project': 'Ricordare l’ultimo progetto'
    , 'default-browser': 'Browser predefinito'
    , 'code-editor': 'Editor per il codice'
    , 'text-simple-editor': 'Editor per testi semplici'
    , 'yaml-editor': 'Editor YAML'
    , 'docu-editor': 'Editor per la documentazione'
    , 'docu-folder-name': 'Nome della cartella di documentazione'
    , 'changelog-file-name': 'Nome del file changelog'
    , 'todo-file-name': 'Nome del file TODO'
    , 'last-project-id': 'Ultimo progetto selezionato'
    , 'backend-app-data-save': "Dati dell'applicazione salvati."

    // Minuteur
    , 'work-session-duration': 'Durata di una sessione di lavoro (minuti)'
    , 'work-section-duration': 'Durata di un blocco di lavoro (minuti)'
    , 'start-clock': 'Avviare l’orologio'
    , 'clock-work-done': 'Lavoro svolto durante la sessione: '
    , 'clock-work-is-done': "Hai raggiunto la scadenza del lavoro"
    , 'clock-10-minutes-remaining': "Ti restano 10 minuti di lavoro"
    , 'of-work-on-project': " sul progetto “$1”."
    , 'clock-ask-work-restarted': "Il lavoro è ripreso?"
    , 'clock-todo-next-session': "Lavoro da svolgere alla prossima sessione: "
    , 'clock-work-time': "Tempo di lavoro:"
    , 'clock-restart': 'Riavvia'
    , 'Confirm': 'Conferma'
    , 'End-of-session': 'Fine sessione'
    , 'Find': "Cerca"
    , 'file-opened': "Il file '$1' è aperto."
    , 'Minuteur': "Timer"
    , 'Next': 'Successivo'
    , 'Save': 'Salva'
    , 'scripts': "Script"
    , 'ask-still-working': "Il lavoro è ancora in corso sul progetto “$1”?"

    // --- UI ---
    , 'Window-position-and-size': 'Posizione e dimensione della finestra'
    , 'which-widhow-app': 'Di quale applicazione bisogna considerare la finestra in primo piano?' + '<div class="small">La sua dimensione e posizione saranno copiate negli appunti</div>'
    , 'window-position-and-size': "Posizione e dimensione della finestra in primo piano nell'applicazione $1:"
    , 'click-button-if-data-ok': "Se questi dati vanno bene, clicca il pulsante “$1”"
    , 'countdown-timer': "Timer"
    , 'lifecycle': "Ciclo di vita"
    , 'open-folder-project': "Aprire la cartella del progetto"
    , 'opening': "Apertura"
    , 'run-a-script': "Eseguire uno script"
    , 'run-a-script-service': "Eseguire uno script-service"
    , 'Defining-a-color': "Definizione di un colore"
    , 'choose-a-color': "Seleziona un colore con il selettore qui sotto."
    , 'group-tools': "Strumenti"
    , 'error-precise-description:': "Descrizione precisa dell'errore:"
    , 'clock-set-pause': "Mettere in pausa"

    // --- PROJETS ---
    , 'current-projects-displayed': "Progetti correnti visualizzati."
    , 'data-project-id': 'ID del progetto'
    , 'data-project-icon': 'Icona del progetto'
    , 'data-project-folder': 'Cartella del progetto'
    , 'data-project-title': "Titolo del progetto"
    , 'data-project-nature': "Natura del progetto"
    , 'importing-new-project': "Importazione di un nuovo progetto"
    , 'data-project-standby': 'Mettere il progetto in standby'
    , 'data-project-todoist': 'ID progetto in Todoist'
    , 'data-github-account': 'Account Github (del progetto)'
    , 'data-project-createdat': "Data di creazione del progetto"
    , 'data-project-lastmod': 'Data dell’ultima modifica'
    , 'duration-work-done': 'Durata di lavoro svolta (min)'
    , 'background-img-or-color': 'Colore o immagine di sfondo'
    , 'githug-label-desc': "Etichette delle issue Github"

    , 'title-project': "Progetto “$1”"
    , 'new-project-name': "Nome del nuovo progetto"
    , 'name-to-give-to-project': "Nome da dare a questo progetto"
    , 'title-data-of-project': "Dati del progetto “$1”"
    , 'select-project-folder-and-ok': "Seleziona la cartella del progetto in Finder, poi clicca “OK”."
    , 'project-saved-success': "Progetto « $1 » salvato con successo alle $2."
    , 'alert-before-edit-projet': "Attenzione, dati sensibili. Procedi solo se sai cosa stai facendo."
    , 'expli-retrait-projet': "La rimozione del progetto “$1” non tocca la sua cartella. Viene solo tolto da questa bacheca o archiviato (per poterlo recuperare più tardi)\n\nAttenzione, se il progetto non viene archiviato, tutti i suoi servizi e dati andranno ovviamente persi."
    , 'project-folder-not-selected': 'La cartella del progetto deve essere selezionata in Finder'
    , 'folder-required': 'È indispensabile scegliere una cartella.'
    , 'Other-genre': "Altro tipo…"
    , 'editing-project-data': "Modificare i dati del progetto"
    , 'versionning-which-num': 'Quale numero aggiornare?'
    , 'versionning-patch': 'Patch'
    , 'versionning-minor': 'Versione minore'
    , 'versionning-major': 'Versione maggiore'
    , 'select-archives-folder': 'Seleziona la cartella archivi in Finder (o nessuna se il file non deve essere archiviato).'
    , 'archives…': "Archivi…"
    , 'confirming-import': "Conferma dell'importazione"
    , 'confirming-project-substract': "Conferma della rimozione del progetto"
    , 'project-substracted': "Progetto rimosso dall’elenco dei progetti."
    , 'ending-startup-project-x': "Fine avvio del progetto “$1”."
    , 'modifying-project-title': "Modifica del titolo del progetto"
    , 'click-to-modify-title': 'Clicca per modificare il titolo'
    // Projet et Service
    , 'startup-services': 'Servizi all’avvio'
    , 'others-services': 'Altri servizi'
    // Projet et Todoist
    , 'todoist-tasks': 'Attività Todoist'
    // Projet et archives
    , 'archived-projects': "Progetti archiviati"
    , 'choose-project-to-restart': "Scegli il progetto da riattivare."

    // Finder
    , 'open-file…': 'Aprire il file…'
    , 'file-to-open': "File da aprire"
    , 'opening-window-in-finder': 'Aprire una finestra in Finder'
    , 'sidebar-setting': "Impostazione della sidebar"
    , 'sidebar?': "Vuoi la sidebar?"
    , 'what-size-for-sidebar': 'Che dimensione dare alla sidebar (metti 0 per nasconderla)?'
    , 'Choosing-finder-element': "Scelta di un elemento del Finder"
    , 'select-el-in-finder-and-ok': "Seleziona l'elemento nel Finder e clicca su OK."    , 'which-url': "Quale URL bisogna raggiungere?"
    , 'select-file-in-finder-and-btn': "Seleziona il file da aprire nel Finder, poi “Scegli”."
    , 'Choosing-a-folder': "Scelta di una cartella"
    , 'select-folder-and-ok': "Seleziona la cartella nel Finder e clicca su OK."
    , 'select-el-in-project-and-ok': "Seleziona l'elemento nella cartella del progetto e clicca su OK."
    , 'set-window-in-finder-and-ok': "Apri la finestra in Finder e impostala come desiderato (posizione, dimensione, tipo di vista) poi clicca OK."
    , 'pos-window-in-finder-and-ok' : "Posiziona la finestra in Finder e clicca “OK”."
    , 'sel-el-in-finder-or-click-none' : "Seleziona l'elemento nel Finder oppure clicca 'Nessuno'."

    // -- Service --
    , 'Common-services': 'Servizi comuni'
    , 'Custom-services': 'Servizi personalizzati'
    , 'running-service-x': "Avvio del servizio $1…"
    , 'service-success': ' Servizio “$1” eseguito con successo (<span class="tiny">(servizio $2)</span>).'
    , 'service-exec-bash-code': 'Eseguire codice bash…'
    , 'service-exec-js-code': "Eseguire codice JS…"
    , 'ask-for-code-to-exec': 'Codice da eseguire:'
    , 'ask-save-work-time': 'Bisogna salvare il tempo di lavoro?'
    , 'Defining-parameter': 'Definizione del parametro'
    , 'app-choice': "Scelta di un'applicazione"
    , 'choose-app-to-use': 'Scegli l’applicazione da usare'
    , 'other-app': 'Altra applicazione…'
    , 'new-service-name': 'Nuovo nome del servizio'
    , 'which-name-for-project-service': 'Che nuovo nome dare a questo servizio per il progetto?'
    , 'choose-color-or-image': "Scegliere un colore o un'immagine"
    , 'which-background': 'Cosa vuoi scegliere come sfondo?'
    , 'phone-number': 'Numero di telefono'
    , 'which-phone-number': 'Per favore fornisci un numero di telefono valido.'
    , 'date-and-hour': 'Data e ora'
    , 'versioning-file': 'Versionare un file/cartella'
    , "Service supprimé ($1)": "Servizio rimosso ($1)"
    , 'Learn-to-select-the-service': "Imparare a selezionare il servizio"
    , 'aborted-definition': 'Definizione annullata.'
    // Scripts-services
    , 'Scripts-services': "Script service"
    , 'script-service-canceled': "Script-service annullato."

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm nella cartella'
    , 'terminal-at-folder': 'Terminale nella cartella'
    , 'open-in-vscode': 'Aprire in VSCode'
    , 'code-to-run-at-launch': 'Codice da eseguire all’apertura'
    // Git
    , 'gh-save-a-error': "Registrare un errore (gh)"
    , 'initing-git-for-project': "Inizializzare Git per il progetto"
    , 'github-account': "Nome del tuo account Github"
    , 'github-project-name': "Nome del progetto su Github"
    , 'git-committing': "Fare il commit su Github"
    , 'git-message-commit': 'Messaggio di commit per questi file'
    , 'git-commit-message-title': "Messaggio del commit"
    , 'gh-issues-create': "Nuova issue di tipo…"
    , 'git-issue-list': "Issue di tipo…"
    , 'github-label': "Etichetta Github:"
    , 'Message:': "Messaggio:"
    , 'gh-description:': "Descrizione più precisa:"
    , 'gh-operation': "Operazione gh da eseguire"
    , 'gh-message-operation': "Messaggio da associare all'operazione:"
    , 'action-on-checked-issues': "Seleziona le issue da trattare e scegli l'azione."
    , 'gh-close': "Chiudere / rimuovere"
    , 'gh-comment': "Commentare"
    , 'gh-pin': 'Fissare'
    , 'gh-unpin': 'Non fissare più'
    , 'git-installing-labels': "Definizione delle etichette Git"
    , 'git-init-btn': "Inizializzare Git sul progetto"
    , 'git-issue-gestion': "Gestione delle issue Github"
    , 'backend-add-labels-ajout': " + definizione delle etichette."
    , 'backend-git-ready': "Git pronto per la cartella"
    , 'backend-git-failed': "git $1 non riuscito: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Seleziona lo script del servizio nel Finder poi “OK”.'
    , 'scserv-end': 'Script-service terminato con successo (almeno senza errori).'
    , 'scserv-datetime-default-format': 'GG MM HH:MM (03 08 05:12 per il 3 agosto alle 5:12)'
    , 'Opening-script-file': 'Apertura del file script'
    , 'ask-for-modify-script-file': "Vuoi modificare il file dello script (che definisce le fasi)?"

    // -- Documentation --
    , 'Documentation': 'Documentazione'
    , 'group-documentation': "Documentazione"
    , 'docu-folder': 'Cartella documentazione'
    , 'editing-documentation': 'Modificare la documentazione'
    , 'initing-documentation': "Inizializzare la documentazione"
    , 'update-documentation': 'Aggiornare la documentazione'
    , 'open-documentation': 'Aprire la documentazione'
    , 'select-docu-folder-and-ok': 'Seleziona la cartella in cui inserire la documentazione, poi “OK”.'
    , 'select-docu-folder': 'Seleziona la cartella di documentazione nel Finder'
    , 'select-docu-main-file': 'Seleziona il file principale della documentazione (predefinito: docu.adoc)'
    , 'select-doc-main-final-file': 'Seleziona il file del manuale (predefinito: docu.html)'
    , 'docu-main-file-name': 'Docu: nome del file modificabile'
    , 'docu-main-disp-file': 'Docu: nome del file pubblicato'
    , 'backend-docu-opened-in': "Cartella della documentazione aperta con successo in $1"

    // Archive
    , 'backend-archiv-move-and-num': "Spostato nell'archivio e rinumerato $1"
    , 'backend-archiv-saved': "Versione salvata negli archivi."

    // Tools
    , 'tools-confirm-scheduling-alert': "Avviso programmato con successo."

    // Reminder / Rappels
    , 'remind-started': "Avviato"
    , 'remind-remove': "Rimuovere"
    , 'scheduling-alert': "Programmazione di un avviso"
    , 'schedule-a-alert': "Programmare un avviso"
    , 'hour-and-day-of-alert': "Ora dell'avviso (e giorno se successivo)"
    , 'alert-message': "Messaggio dell'avviso"

    // -- Todoist --
    , 'todoist-content'     : "contenuto"
    , 'todoist-description' : "descrizione"
    , 'todoist-due'         : "inizio"
    , 'todoist-deadline'    : "scadenza"
    , 'todoist-duration'    : "durata"
    , 'todoist-priority'    : "priorità"
    , 'todoist-labels'      : "etichette"
    , 'todoist-repeat'      : "ripete"
    , 'task-due-to-start'   : "Scusa il disturbo, ma l'attività “$1” deve essere iniziata."

    , 'New task...': "Nuova attività…"
    , 'New task': "Nuova attività"
    , 'todoist-message-new-task': "Definisci qui sotto i parametri generali di questa nuova attività. Puoi eliminare i parametri non necessari e usare marcatori semplificati (today, tomorrow, 4d, ecc.)"
    , 'todoist-message-mod-task': "Ridefinisci qui sotto i parametri dell'attività."
    , 'todoist-default-fields-task': "contenuto: $1\\\ndescrizione: $2\\\n\\\ninizio: $3\\\nripete: $4\\\ndurata: $5\\\npriorità: $6\\\nscadenza: $7\\\netichette: $8"
    , 'todoist-default-due-task': "GG/MM/AAAA alle h:mm"
    , 'todoist-text-new-task': "✔ Nuova attività: $1"
    , 'todoist-text-mod-task': "✔ Attività modificata: $1"
    , 'todoist-project-title': "Titolo del progetto in Todoist"
    , 'todoist-tasks': "Attività Todoist" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Indica qui sotto il titolo del progetto $1 nell'applicazione Todoist."
    , 'todoist-message-today-project-task': "Elenco delle attività di oggi per il progetto “$1”."
    , 'confirm-tasks-checks': "Conferma delle attività"
    , 'ask-for-confirm-tasks-checks': "Per favore conferma le operazioni sulle attività del progetto “$1”.$2"
    , 'mark-task-checked': "L'attività “$1” va segnata come completata."
    , 'todoist-fin-tasks-done-and-create': "Le attività del progetto “$1” sono state aggiornate (completate: $2, nuove: $3)."
    , 'todoist-tasks-created-message': "Le nuove attività del progetto “$1” sono state create ($2)."
    , 'todoist-new-task-title-errors': "Attività non valida"
    , 'todoist-new-task-msg-correct-errors': "Per favore correggi gli errori qui sotto:"
    , 'todoist-no-task-done': "Nessuna attività da segnare come completata."
    , 'todoist-no-new-task': "Nessuna nuova attività."
    , 'todoist-modify-checked': "Modificare ✔…"
    , 'todoist-errors-update-tasks': "Errori nell'aggiornamento delle attività"
    , 'todoist-message-actualisation': "Aggiornamento attività: nuove: $1, completate: $2, modificate: $3"
    // -- test --
    , 'test-raw':   'sostituisce $1'
    , 'test-array': 'sostituisce $1 e $2'
    , 'test-objet': 'sostituisce $ceci e ${cela}'

    // --- Finder ---
    , 'window-opened': "Finestra aperta con successo."
    , 'folder-opened': "Cartella aperta con successo."

    // --- Git ---
    , 'git-init-success': "Git installato con successo."
    , 'Which-labels': "Etichette?"
    , 'which-labels-to-create': "Etichette da creare (non selezionarne per non modificarle)."

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm aperto nella cartella."
    , 'terminal-opened-at-folder': "Terminal aperto nella cartella."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - Chiave API"
    , 'which-todoist-api-key': "Inserisci la tua chiave API (token) Todoist"

    // --- Documentation ---
    , 'docu-opened-in-browser': "Documentazione aperta."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "ora|h"
    , 'regexp:relative-days': "l'altro ieri|dopodomani|ieri|domani|oggi"
    , 'regexp:date-unit': "mese|mesi|settimana|settimane|sett|giorno|giorni|g|ora|ore|h|minuto|minuti|min"
    , 'regexp:duration-in': "tra ([0-9]+) (mese|mesi|settimana|settimane|sett|giorno|giorni|g|ora|ore|h|minuto|minuti|min)"
    , 'regexp:every-prefix': "ogni "
    , 'regexp:day-word': "giorni"
    , 'regexp:weekdays': "lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica"
    , 'regexp:of-month': "del mese"
    , 'regexp:unit-month': "mese|mesi"
    , 'regexp:unit-week': "settimana|settimane|sett"
    , 'regexp:unit-day': "giorno|giorni|g"
    , 'regexp:unit-hour': "ora|ore|h"
    , 'regexp:unit-minute': "minuto|minuti|min"
    , 'regexp:day-before-yesterday': "l'altro ieri"
    , 'regexp:yesterday': "ieri"
    , 'regexp:today': "oggi"
    , 'regexp:tomorrow': "domani"
    , 'regexp:day-after-tomorrow': "dopodomani"
}
