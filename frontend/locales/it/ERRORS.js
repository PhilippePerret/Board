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
    , 'hour-not-valid': "ora non valida: '$1'"
    , 'error-date': "La data '$1' non è valida. Formati validi: GG/MM/AAAA, 'domani', 'dopodomani', o 'tra X ore/giorni/settimane/mesi'."
    , 'deadline-before-start': "La scadenza '$1' deve essere successiva alla data di inizio '$2'."
    , 'repeat-not-valid': "la ripetizione non è valida in '$1'"
    , 'error-duration': "La durata « $1 » dovrebbe avere la forma '&lt;numero> &lt;unità>' dove l'unità può essere 'mese', 'settimana', 'giorno', 'ora', 'minuto' e le loro abbreviazioni (ad esempio '12 h')."
    , 'prop-cant-be-empty': "La proprietà « $1 » non può essere vuota."
    , 'must-be-num-between': "« $1 » dovrebbe essere un numero tra $2 e $3"
    , 'invalid-phone-number': "Il numero di telefono $1 non è valido."

    , 'select-project-to-what': "Bisogna selezionare il progetto da $1."

    // --- Application ---
    , 'unknown-app-data': "Dato applicazione sconosciuto: '$1'"
    , 'app-sorry-fatal-error': "Si è verificato un errore fatale, ci scusiamo."
    , 'backend-app-project-unfound': "Progetto $1 non trovato negli archivi."
    , 'backend-unknown-action': "Azione sconosciuta: '$1'."
    , 'backend-access-unabled': "Board non ha il permesso di Accessibilità attivato: Impostazioni di Sistema → Privacy e sicurezza → Accessibilità → seleziona Board."
    , 'backend-command-not-found': "Il comando bash '$1' è sconosciuto."

    // --- Projets ---
    , 'project-folder-not-selected': 'La cartella del progetto deve essere selezionata in Finder.'
    , 'folder-required': 'È indispensabile scegliere una cartella.'
    , 'no-current-projet': "Nessun progetto corrente."
    , '--untitled-project--': '-progetto senza titolo-'

    // Services
    , 'serv-error-on-return': "Errore nella risposta del servizio"
    , 'service-requires-a-name': "Un servizio deve avere un :name. ($1)"

    // Scripts services
    , 'backend-open-file-failed': "Impossibile aprire il file '$1' con l'applicazione '$2'."
    , 'scserv-abort': "Servizio annullato"
    , 'Script-service-definition-error': 'Errore di definizione dello Script-service'
    , 'Script-service-file-contains-errors': 'Il file di definizione dello script-service contiene errori.'
    , 'scserv-unknown-step': "La fase con identificatore '$1' è sconosciuta."
    , 'scserv-list-required': "Il file YAML dovrebbe definire un elenco di fasi ($1)."
    , 'scserv-type-required': "Una fase di script-service ($1) deve sempre avere un tipo ($2)."
    , 'scserv-id-required': "Una fase di script-service deve assolutamente avere un identificatore ($1) ($2)."
    , 'scserv-id-invalid': "L'identificatore della fase $1 non è valido ($2)."
    , 'scserv-step-type-unknowned': "fase '$1': tipo di fase sconosciuto: $2 ($3)."
    , 'scserv-param-required': "fase '$1': il parametro '$2' è obbligatorio, per il tipo '$3' ($4)."
    , 'scserv-unknown-param': "fase '$1': il parametro '$2' è sconosciuto per il servizio di tipo '$3' ($4)."
    , 'scserv-param-bad-type': "Il parametro '$1' non ha il tipo corretto. Atteso: $2, attuale: $3 ($4)."
    , 'scserv-on-get-file-values': "Si è verificato un errore cercando di leggere i dati del file '$1': $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "Il select della fase $1, i cui dati sono tabelle, richiede il parametro key_value che definisce il valore del menu ($2)"
    , 'scserv-select-with-object-requires-title-values': "Il select della fase $1, i cui dati sono tabelle, richiede il parametro key_title che definisce il titolo del menu ($2)"
    , 'scserv-select-with-object-unknown-key': "Per il select della fase $1, l'oggetto $2 non definisce la chiave '$3' per il valore ($4)."
    , 'scserv-select-with-object-unknown-title': "Per il select della fase $1, l'oggetto $2 non definisce la chiave '$3' per il titolo ($4)."
    , 'scserv-unknown-evaluator': "Il valutatore della fase '$1' è sconosciuto: $2 ($3)."
    , 'scserv-unknown-marker-translate': "Il marcatore di traduzione '$1' della fase '$2' è sconosciuto. I marcatori possibili sono: $3 ($4)."

    // File
    , 'backend-unfound-file': "File non trovato: $1"
    , 'backend-invalid-yaml': "Codice YAML non valido ($1): $2"
    , 'backend-unfound-folder-unable-file': "La cartella '$1' non è stata trovata. Impossibile creare in sicurezza il file '$2'."
    , 'backend-unable-to-create-file': "Il file $1 non è stato possibile crearlo."
    , 'backend-no-xml-file': "Nessuna lettura di file XML per ora."
    , 'backend-version-no-num': "Il file $1 non contiene un numero di versione, impossibile assegnargli una versione."

    // Git
    , 'backend-unabled-labels': "Impossibile recuperare le etichette esistenti: $1"
    , 'backend-already-git': "Git è già inizializzato per questo progetto."
    , 'backend-unabled-to-destroy-labels': "Impossibile eliminare le etichette esistenti: $1"
    , 'backend-unable-to-create-labels': "Impossibile creare le nuove etichette: $1"
    , 'backend-remote-test-required': "È richiesto il remote git di test"
    , 'backend-not-a-git-folder': "Questa cartella non è un repository git ($1)."
    , 'backend-not-a-git-repo': "La cartella $1 non è un repository Git."
    , 'backend-git-unknown-ope': "Operazione Git sconosciuta: $1"

    // Script
    , 'backend-script-unfound': "Impossibile trovare lo script da eseguire ($1)"

    // Documentation
    , 'docu-error-on-update': "Errore durante l'aggiornamento"
    , 'backend-docu-unfound-folder': "La cartella della documentazione '$1' non è stata trovata."

    // TODOIST
    , 'todoist-key-task-unknown': "La chiave « $1 » è sconosciuta, per un'attività Todoist."
    , 'no-tasks-checked': "Nessuna attività selezionata"
    , 'checked-only-modify-task': "Deve essere selezionata solo l'attività da modificare."
    , 'backend-todoist-unfound-project': "Progetto « $1 » non trovato in Todoist."
    , 'backend-task-error': "Attività $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "Versione non archiviata a causa di un problema sconosciuto."
    , 'backend-archiv-unfound-folder': "Cartella archivi non trovata: $1."

    // Date
    , 'invalid-date': "Data non valida: '$1': $2"

    // UI
    , 'no-open-window-in': "Nessuna finestra aperta nell'applicazione $1."
    , 'app-unfound-or-close': "Applicazione $1 non trovata o chiusa."

    // Finder
    , 'no-selection': "Nessuna selezione"
    , 'not-a-folder': "La selezione dovrebbe essere una cartella"
}
