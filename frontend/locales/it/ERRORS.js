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
    , 'repeat-not-valid': "la ripetizione non è valida in '$1'"
    , 'error-duration': "La durata « $1 » dovrebbe avere la forma '&lt;numero> &lt;unità>' dove l'unità può essere 'mese', 'settimana', 'giorno', 'ora', 'minuto' e le loro abbreviazioni (ad esempio '12 h')."
    , 'prop-cant-be-empty': "La proprietà « $1 » non può essere vuota."
    , 'must-be-num-between': "« $1 » dovrebbe essere un numero tra $2 e $3"
    , 'invalid-phone-number': "Il numero di telefono $1 non è valido."

    , 'select-project-to-what': "Bisogna selezionare il progetto da $1."

    // --- Application ---
    , 'unknown-app-data': "Dato applicazione sconosciuto: '$1'"

    // --- Projets ---
    , 'project-folder-not-selected': 'La cartella del progetto deve essere selezionata in Finder.'
    , 'folder-required': 'È indispensabile scegliere una cartella.'
    , 'no-current-projet': "Nessun progetto corrente."
    , '--untitled-project--': '-progetto senza titolo-'

    // Services
    , 'serv-error-on-return': "Errore nella risposta del servizio"
    , 'service-requires-a-name': "Un servizio deve avere un :name. ($1)"

    // Scripts services
    , 'scserv-abort': "Servizio annullato"
    , 'Script-service-definition-error': 'Errore di definizione dello Script-service'
    , 'Script-service-file-contains-errors': 'Il file di definizione dello script-service contiene errori.'
    , 'scserv-unknown-step': "La fase con identificatore '$1' è sconosciuta."
    , 'scserv-list-required': "Il file YAML dovrebbe definire un elenco di fasi ($1)."
    , 'scserv-type-required': "Una fase di script-service ($1) deve sempre avere un tipo ($2)."
    , 'scserv-id-required': "Una fase di script-service deve assolutamente avere un identificatore ($1) ($2)."
    , 'scserv-id-invalid': "L'identificatore della fase $1 non è valido ($2)."
    , 'scserv-step-type-unknowned': "tipo di fase sconosciuto: $1 ($2)."
    , 'scserv-param-required': "Il parametro '$1' è obbligatorio, per il tipo '$2' ($3)."
    , 'scserv-unknown-param': "Il parametro '$1' è sconosciuto per il servizio di tipo '$2' ($3)."
    , 'scserv-param-bad-type': "Il parametro '$1' non ha il tipo corretto. Atteso: $2, attuale: $3 ($4)."
    , 'scserv-on-get-file-values': "Si è verificato un errore cercando di leggere i dati del file '$1': $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "Il select della fase $1, i cui dati sono tabelle, richiede il parametro key_value che definisce il valore del menu ($2)"
    , 'scserv-select-with-object-requires-title-values': "Il select della fase $1, i cui dati sono tabelle, richiede il parametro key_title che definisce il titolo del menu ($2)"
    , 'scserv-select-with-object-unknown-key': "Per il select della fase $1, l'oggetto $2 non definisce la chiave '$3' per il valore ($4)."
    , 'scserv-select-with-object-unknown-title': "Per il select della fase $1, l'oggetto $2 non definisce la chiave '$3' per il titolo ($4)."
    , 'scserv-unknown-evaluator': "Il valutatore della fase '$1' è sconosciuto: $2 ($3)."
    , 'scserv-unknown-marker-translate': "Il marcatore di traduzione '$1' della fase '$2' è sconosciuto. I marcatori possibili sono: $3 ($4)."

    // Documentation
    , 'docu-error-on-update': "Errore durante l'aggiornamento"

    // TODOIST
    , 'todoist-key-task-unknown': "La chiave « $1 » è sconosciuta, per un'attività Todoist."
    , 'no-tasks-checked': "Nessuna attività selezionata"
    , 'checked-only-modify-task': "Deve essere selezionata solo l'attività da modificare."

}
