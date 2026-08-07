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
    , 'hour-not-valid': "ungültige Uhrzeit: '$1'"
    , 'repeat-not-valid': "die Wiederholung ist in '$1' ungültig"
    , 'error-duration': "Die Dauer « $1 » sollte die Form '&lt;Zahl> &lt;Einheit>' haben, wobei Einheit 'Monat', 'Woche', 'Tag', 'Stunde', 'Minute' oder deren Abkürzungen sein kann (zum Beispiel '12 h')."
    , 'prop-cant-be-empty': "Die Eigenschaft « $1 » darf nicht leer sein."
    , 'must-be-num-between': "« $1 » sollte eine Zahl zwischen $2 und $3 sein"
    , 'invalid-phone-number': "Die Telefonnummer $1 ist ungültig."

    , 'select-project-to-what': "Das Projekt für $1 muss ausgewählt werden."

    // --- Application ---
    , 'unknown-app-data': "Unbekannte Anwendungsdaten: '$1'"

    // --- Projets ---
    , 'project-folder-not-selected': 'Der Projektordner muss im Finder ausgewählt werden.'
    , 'folder-required': 'Es muss unbedingt ein Ordner gewählt werden.'
    , 'no-current-projet': "Kein aktuelles Projekt."
    , '--untitled-project--': '-Projekt ohne Titel-'

    // Services
    , 'serv-error-on-return': "Fehler bei der Rückgabe des Dienstes"
    , 'service-requires-a-name': "Ein Dienst muss einen :name haben. ($1)"

    // Scripts services
    , 'scserv-abort': "Dienst abgebrochen"
    , 'Script-service-definition-error': 'Fehler bei der Definition des Script-Service'
    , 'Script-service-file-contains-errors': 'Die Definitionsdatei des Script-Service enthält Fehler.'
    , 'scserv-unknown-step': "Der Schritt mit der Kennung '$1' ist unbekannt."
    , 'scserv-list-required': "Die YAML-Datei sollte eine Liste von Schritten definieren ($1)."
    , 'scserv-type-required': "Ein Script-Service-Schritt ($1) muss immer einen Typ haben ($2)."
    , 'scserv-id-required': "Ein Script-Service-Schritt muss unbedingt eine Kennung haben ($1) ($2)."
    , 'scserv-id-invalid': "Die Kennung des Schritts $1 ist ungültig ($2)."
    , 'scserv-step-type-unknowned': "unbekannter Schritttyp: $1 ($2)."
    , 'scserv-param-required': "Der Parameter '$1' ist erforderlich, für den Typ '$2' ($3)."
    , 'scserv-unknown-param': "Der Parameter '$1' ist für den Dienst vom Typ '$2' unbekannt ($3)."
    , 'scserv-param-bad-type': "Der Parameter '$1' hat nicht den richtigen Typ. Erwartet: $2, aktuell: $3 ($4)."
    , 'scserv-on-get-file-values': "Beim Versuch, die Daten der Datei '$1' zu lesen, ist ein Fehler aufgetreten: $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "Das Select des Schritts $1, dessen Daten Tabellen sind, benötigt den Parameter key_value, der den Menüwert definiert ($2)"
    , 'scserv-select-with-object-requires-title-values': "Das Select des Schritts $1, dessen Daten Tabellen sind, benötigt den Parameter key_title, der den Menütitel definiert ($2)"
    , 'scserv-select-with-object-unknown-key': "Für das Select des Schritts $1 definiert das Objekt $2 nicht den Schlüssel '$3' für den Wert ($4)."
    , 'scserv-select-with-object-unknown-title': "Für das Select des Schritts $1 definiert das Objekt $2 nicht den Schlüssel '$3' für den Titel ($4)."
    , 'scserv-unknown-evaluator': "Der Evaluator des Schritts '$1' ist unbekannt: $2 ($3)."
    , 'scserv-unknown-marker-translate': "Der Übersetzungsmarker '$1' des Schritts '$2' ist unbekannt. Mögliche Marker sind: $3 ($4)."

    // Documentation
    , 'docu-error-on-update': "Fehler bei der Aktualisierung"

    // TODOIST
    , 'todoist-key-task-unknown': "Der Schlüssel « $1 » ist für eine Todoist-Aufgabe unbekannt."
    , 'no-tasks-checked': "Keine Aufgabe ausgewählt"
    , 'checked-only-modify-task': "Es darf nur die zu ändernde Aufgabe ausgewählt sein."

}
