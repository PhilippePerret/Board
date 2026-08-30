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
    , 'error-date': "Das Datum '$1' ist ungültig. Gültige Formate: TT/MM/JJJJ, 'morgen', 'übermorgen', oder 'in X Stunden/Tagen/Wochen/Monaten'."
    , 'deadline-before-start': "Die Frist '$1' muss nach dem Startdatum '$2' liegen."
    , 'repeat-not-valid': "die Wiederholung ist in '$1' ungültig"
    , 'error-duration': "Die Dauer « $1 » sollte die Form '&lt;Zahl> &lt;Einheit>' haben, wobei Einheit 'Monat', 'Woche', 'Tag', 'Stunde', 'Minute' oder deren Abkürzungen sein kann (zum Beispiel '12 h')."
    , 'prop-cant-be-empty': "Die Eigenschaft « $1 » darf nicht leer sein."
    , 'must-be-num-between': "« $1 » sollte eine Zahl zwischen $2 und $3 sein"
    , 'invalid-phone-number': "Die Telefonnummer $1 ist ungültig."

    , 'select-project-to-what': "Das Projekt für $1 muss ausgewählt werden."

    // --- Application ---
    , 'unknown-app-data': "Unbekannte Anwendungsdaten: '$1'"
    , 'app-sorry-fatal-error': "Ein schwerwiegender Fehler ist aufgetreten, bitte entschuldigen Sie."
    , 'backend-app-project-unfound': "Projekt $1 in den Archiven nicht gefunden."
    , 'backend-unknown-action': "Unbekannte Aktion: '$1'."
    , 'backend-access-unabled': "Board hat keine aktivierte Bedienungshilfen-Berechtigung: Systemeinstellungen → Datenschutz & Sicherheit → Bedienungshilfen → Board aktivieren."
    , 'backend-command-not-found': "Der Bash-Befehl '$1' ist unbekannt."

    // --- Projets ---
    , 'project-folder-not-selected': 'Der Projektordner muss im Finder ausgewählt werden.'
    , 'folder-required': 'Es muss unbedingt ein Ordner gewählt werden.'
    , 'no-current-projet': "Kein aktuelles Projekt."
    , '--untitled-project--': '-Projekt ohne Titel-'

    // Services
    , 'serv-error-on-return': "Fehler bei der Rückgabe des Dienstes"
    , 'service-requires-a-name': "Ein Dienst muss einen :name haben. ($1)"

    // Scripts services
    , 'backend-open-file-failed': "Die Datei '$1' konnte nicht mit der Anwendung '$2' geöffnet werden."
    , 'scserv-abort': "Dienst abgebrochen"
    , 'Script-service-definition-error': 'Fehler bei der Definition des Script-Service'
    , 'Script-service-file-contains-errors': 'Die Definitionsdatei des Script-Service enthält Fehler.'
    , 'scserv-unknown-step': "Der Schritt mit der Kennung '$1' ist unbekannt."
    , 'scserv-list-required': "Die YAML-Datei sollte eine Liste von Schritten definieren ($1)."
    , 'scserv-type-required': "Ein Script-Service-Schritt ($1) muss immer einen Typ haben ($2)."
    , 'scserv-id-required': "Ein Script-Service-Schritt muss unbedingt eine Kennung haben ($1) ($2)."
    , 'scserv-id-invalid': "Die Kennung des Schritts $1 ist ungültig ($2)."
    , 'scserv-step-type-unknowned': "Schritt '$1': unbekannter Schritttyp: $2 ($3)."
    , 'scserv-param-required': "Schritt '$1': der Parameter '$2' ist erforderlich, für den Typ '$3' ($4)."
    , 'scserv-unknown-param': "Schritt '$1': der Parameter '$2' ist für den Dienst vom Typ '$3' unbekannt ($4)."
    , 'scserv-param-bad-type': "Der Parameter '$1' hat nicht den richtigen Typ. Erwartet: $2, aktuell: $3 ($4)."
    , 'scserv-on-get-file-values': "Beim Versuch, die Daten der Datei '$1' zu lesen, ist ein Fehler aufgetreten: $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "Das Select des Schritts $1, dessen Daten Tabellen sind, benötigt den Parameter key_value, der den Menüwert definiert ($2)"
    , 'scserv-select-with-object-requires-title-values': "Das Select des Schritts $1, dessen Daten Tabellen sind, benötigt den Parameter key_title, der den Menütitel definiert ($2)"
    , 'scserv-select-with-object-unknown-key': "Für das Select des Schritts $1 definiert das Objekt $2 nicht den Schlüssel '$3' für den Wert ($4)."
    , 'scserv-select-with-object-unknown-title': "Für das Select des Schritts $1 definiert das Objekt $2 nicht den Schlüssel '$3' für den Titel ($4)."
    , 'scserv-unknown-evaluator': "Der Evaluator des Schritts '$1' ist unbekannt: $2 ($3)."
    , 'scserv-unknown-marker-translate': "Der Übersetzungsmarker '$1' des Schritts '$2' ist unbekannt. Mögliche Marker sind: $3 ($4)."

    // File
    , 'backend-unfound-file': "Datei nicht gefunden: $1"
    , 'backend-invalid-yaml': "Ungültiger YAML-Code ($1): $2"
    , 'backend-unfound-folder-unable-file': "Der Ordner '$1' wurde nicht gefunden. Die Datei '$2' kann nicht sicher erstellt werden."
    , 'backend-unable-to-create-file': "Die Datei $1 konnte nicht erstellt werden."
    , 'backend-no-xml-file': "Noch kein Lesen von XML-Dateien."
    , 'backend-version-no-num': "Die Datei $1 enthält keine Versionsnummer, sie kann nicht versioniert werden."

    // Git
    , 'backend-unabled-labels': "Bestehende Labels konnten nicht abgerufen werden: $1"
    , 'backend-already-git': "Git ist für dieses Projekt bereits initialisiert."
    , 'backend-unabled-to-destroy-labels': "Bestehende Labels konnten nicht gelöscht werden: $1"
    , 'backend-unable-to-create-labels': "Neue Labels konnten nicht erstellt werden: $1"
    , 'backend-remote-test-required': "Das Test-Git-Remote ist erforderlich"
    , 'backend-not-a-git-folder': "Dieser Ordner ist kein Git-Repository ($1)."
    , 'backend-not-a-git-repo': "Der Ordner $1 ist kein Git-Repository."
    , 'backend-git-unknown-ope': "Unbekannte Git-Operation: $1"

    // Script
    , 'backend-script-unfound': "Das auszuführende Skript wurde nicht gefunden ($1)"

    // Documentation
    , 'docu-error-on-update': "Fehler bei der Aktualisierung"
    , 'backend-docu-unfound-folder': "Der Dokumentationsordner '$1' wurde nicht gefunden."

    // TODOIST
    , 'todoist-key-task-unknown': "Der Schlüssel « $1 » ist für eine Todoist-Aufgabe unbekannt."
    , 'no-tasks-checked': "Keine Aufgabe ausgewählt"
    , 'checked-only-modify-task': "Es darf nur die zu ändernde Aufgabe ausgewählt sein."
    , 'backend-todoist-unfound-project': "Projekt « $1 » in Todoist nicht gefunden."
    , 'backend-task-error': "Aufgabe $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "Version aufgrund eines unbekannten Problems nicht archiviert."
    , 'backend-archiv-unfound-folder': "Archivordner nicht gefunden: $1."

    // Date
    , 'invalid-date': "Ungültiges Datum: '$1': $2"

    // UI
    , 'no-open-window-in': "Kein Fenster in der Anwendung $1 geöffnet."
    , 'app-unfound-or-close': "Anwendung $1 nicht gefunden oder geschlossen."

    // Finder
    , 'no-selection': "Keine Auswahl"
    , 'not-a-folder': "Die Auswahl sollte ein Ordner sein"
    , 'backend-app-backup-failed': "Die tägliche Sicherung ist fehlgeschlagen."
    , 'backend-app-backup-no-previous': "Kein vorheriges Backup verfügbar."
    , 'backend-app-backup-restore-failed': "Die Wiederherstellung des vorherigen Backups ist fehlgeschlagen."
    , 'unknown-syntax-file-extension': "Erweiterung nicht in der Prüftabelle aufgeführt: $1."
    , 'invalid-value': "Ungültiger Wert: $1."
    , 'git-commit-title-erros': "Fehler beim Commit aufgetreten"
    , 'git-status-not-clean': "Der Git-Status ist nicht sauber."
    , 'git-status-not-empty': "Es müssen noch Dateien/Ordner committet werden."
    , 'git-branch-not-main': "Sie sollten sich auf dem Branch main befinden."
    , 'git-status-added-both-sides': "auf beiden Seiten hinzugefügt (unterschiedliche Inhalte)."
    , 'git-status-deleted-both-sides': "auf beiden Seiten gelöscht."
    , 'git-status-modified-both-sides': "auf beiden Seiten geändert."
    , 'git-status-add-and-absent': "von uns hinzugefügt, auf der anderen Seite fehlend."
    , 'git-status-absent-and-add': "auf der anderen Seite hinzugefügt, bei uns fehlend."
    , 'git-status-deleted-and-modified': "von uns gelöscht, auf der anderen Seite geändert."
    , 'git-status-modified-and-deleted': "von uns geändert, auf der anderen Seite gelöscht."
    , 'git-bad-branch': "Sie befinden sich auf dem falschen Git-Branch. Erwartet: $1."
    , 'git-commit-error': "Git-Fehler beim Committen der Dateien: $1."
    , 'git-push-error': "Git-Fehler beim Pushen der Commits: $1"
    , 'git-pr-create-error': "GH-Fehler beim Erstellen des Github-Pull-Requests: $1."
    , 'git-pr-waiting-checks-error': "GH-Fehler beim Warten auf den Check: $1."
    , 'git-pr-waiting-checks-failure': "GH-Fehler beim Check: ein Test ist fehlgeschlagen."
    , 'git-unable-checkout-main': "Git-Fehler: Rückkehr zum Hauptbranch nicht möglich ($1)."
    , 'git-unable-pr-merge': "Git-Fehler: Pull Request kann nicht gemerged werden ($1)."
    , 'git-commit-init-required': "Um Ihre Dateien in einem Github-PR-Zyklus zu committen, müssen Sie diesen Zyklus zuerst starten (hauptsächlich: einen Entwicklungsbranch wählen).\n\nWenn dieser Branch bereits ohne Initialisierung definiert ist, können Sie ihn in den Projektdaten in der Eigenschaft `git_pr_cycle_branche` angeben."
    , 'github-pr-cycle-require-clean-status-to-submit': "Das Einreichen eines Github-PR erfordert einen sauberen Status (es sollte keine Datei mehr zu committen sein).\n\nVerwenden Sie den vorherigen Dienst dafür."
    , 'git-unable-destroy-branch': "Der Git-Branch kann nicht gelöscht werden: $1."
    , 'github-pr-cycle-branch-should-have-been-deleted': "Der Entwicklungsbranch $1 kann nicht gelöscht werden: $2"
    , 'git-init-no-push-permission': "Sie haben keine Schreibrechte (Push) für das Github-Repository $1."
    , 'git-init-repo-exists-not-empty': "Das Github-Repository $1 existiert bereits und ist nicht leer.\n\nSind Sie sicher, dass es das richtige Repository ist? Es muss geleert werden, bevor es mit dieser Initialisierung verwendet werden kann."
    , 'backend-github-api-error': "Fehler bei der Abfrage der Github-API: $1."
    , 'backend-github-repo-create-error': "Fehler beim Erstellen des Github-Repositorys: $1."
    , 'project-data-invalid-bad-count': "Die Daten des Projekts $1 für den Dienst $2 sind ungültig. $3 Datum$5 erwartet, $4 Datum$6 angegeben."
    , 'file-already-exists-at': "An diesem Ort existiert bereits eine Datei: $1"
    , 'unknown-shebang': "$1 ist keine direkt skriptfähige Sprache."
    , 'unrunnable-file': "Die Datei $1 ist weder ausführbar noch in einer bekannten Sprache."
    , 'backend-icloud-dataless-files': "iCloud-Synchronisierungsproblem. Öffnen Sie für die mit ⚠️ markierten Dateien den Ordner über ein Terminal."
    , 'backend-search-invalid-regex': "Ungültiger regulärer Ausdruck: $1 ($2)"
    , 'backend-search-project-unfound-folder': "Der Projektordner '$1' wurde nicht gefunden."
    , 'excluded-folder-outside-project': "Dieser Ordner ist kein Unterordner des Projekts — Auswahl ignoriert."
}
