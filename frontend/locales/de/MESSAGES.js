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
    , 'Board': "Board"
    , 'Help': "Hilfe"
    , 'Debug': "Debug"
    , 'Tools': "Werkzeuge"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "Ja"
    , 'btn-no': "Nein"
    , 'OK': 'OK'
    , 'GO!': 'LOS!'
    , ':'   :   ': '
    , 'new…': "Neu…"
    , 'None': 'Keiner'
    , 'Nonee': 'Keine'
    , 'Empty': 'Leer'
    , 'error:': "Fehler:"
    , 'other-value…': 'Anderer Wert…'
    , 'date/at': 'um' // pour une date avec heure
    , 'date/months': "Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember"
    , 'date/format': "%J. %_M %Y"
    , 'Cancel': "Abbrechen"
    , 'Correct': "Korrigieren"
    , 'its-noted': "Verstanden"
    , 'remind-me-later': "Später erinnern"
    , '(by-default)': "(Standard)"
    , 'Color': 'Farbe'
    , 'Image': 'Bild'
    , 'Nothing': 'Nichts'
    , 'This-one': 'Dieser'
    , 'This-onee': "Diese"
    , 'Preserve': "Beibehalten"
    , 'app-to-use': "Zu verwendende Anwendung"
    , 'choosing-files-to': "Auswahl der Dateien zum $1"
    , 'choose-files-to': "Wähle die Dateien zum $1"
    , 'select-filter-placeholder': "Filtern…"
    , 'select-all-tooltip': "Alle auswählen"
    , 'select-none-tooltip': "Alle abwählen"
    , 'fatal-error': "Schwerwiegender Fehler"
    , 'ope-aborted': 'Vorgang abgebrochen'
    , 'samples': "Beispiele" // (musique)
    , 'work-duration:': 'Arbeitszeit: '
    , 'created-at:': 'erstellt: '
    , 'modify-at:': '/geänd.: '
    , 'url-definition': 'URL-Definition'

    // Verbes
    , 'vb-commit': 'committen'
    , 'Ignore': 'Ignorieren'
    , 'Finish': "Beenden" // dans le sens d'un ordre donné
    , 'Apply': "Anwenden"
    , 'Import': 'Importieren'
    , 'sustract': "entfernen"
    , 'Open-url…': 'URL öffnen…'
    , 'modify-it': 'Bearbeiten'
    , 'Validate': 'Bestätigen'

    // Logique
    , 'id-is-required': "Eine Kennung (`id`) ist erforderlich"
    , 'type-is-required': "Der Typ muss definiert sein."

    // Data
    , 'path-to-data': "Pfad zu den Daten"
    , 'id-in-data': 'ID in den Daten (falls nötig)'

    // Prompt
    , 'Parameter-definition': 'Parameterdefinition'

    // File
    , 'add-to-file-at': "Zu einer Datei hinzufügen, an beliebiger Stelle"
    , 'which-url-to-reach': 'Welche URL soll erreicht werden?'
    , 'destination-folder-or-file': 'Ziel (Ordner oder Datei)'
    , 'backend-file-created': "Die Datei $1 wurde erstellt."

    // App
    , 'app-config': 'Anwendungskonfiguration'
    , 'app-version': 'Anwendungsversion'
    , 'remember-last-project': 'Letztes Projekt merken'
    , 'default-browser': 'Standardbrowser'
    , 'code-editor': 'Code-Editor'
    , 'text-simple-editor': 'Editor für einfachen Text'
    , 'yaml-editor': 'YAML-Editor'
    , 'docu-editor': 'Editor für die Dokumentation'
    , 'docu-folder-name': 'Name des Dokumentationsordners'
    , 'changelog-file-name': 'Name der Changelog-Datei'
    , 'todo-file-name': 'Name der TODO-Datei'
    , 'last-project-id': 'Zuletzt ausgewähltes Projekt'
    , 'backend-app-data-save': "Anwendungsdaten gespeichert."

    // Minuteur
    , 'work-session-duration': 'Dauer einer Arbeitssitzung (Minuten)'
    , 'work-section-duration': 'Dauer eines Arbeitsabschnitts (Minuten)'
    , 'start-clock': 'Uhr starten'
    , 'clock-work-done': 'Während der Sitzung geleistete Arbeit: '
    , 'clock-work-is-done': "Du hast die Arbeitsfrist erreicht"
    , 'clock-10-minutes-remaining': "Dir bleiben noch 10 Minuten Arbeit"
    , 'of-work-on-project': " am Projekt „$1“."
    , 'clock-ask-work-restarted': "Wurde die Arbeit wieder aufgenommen?"
    , 'clock-todo-next-session': "Zu erledigende Arbeit in der nächsten Sitzung: "
    , 'clock-work-time': "Arbeitszeit:"
    , 'clock-restart': 'Neu starten'
    , 'Confirm': 'Bestätigen'
    , 'End-of-session': 'Sitzungsende'
    , 'Find': "Suchen"
    , 'file-opened': "Die Datei '$1' ist geöffnet."
    , 'Minuteur': "Timer"
    , 'Next': 'Weiter'
    , 'Save': 'Speichern'
    , 'scripts': "Skripte"
    , 'ask-still-working': "Wird noch am Projekt „$1“ gearbeitet?"

    // --- UI ---
    , 'Window-position-and-size': 'Fensterposition und -größe'
    , 'which-widhow-app': 'Welche Anwendung soll für das Vordergrundfenster berücksichtigt werden?' + '<div class="small">Größe und Position werden in die Zwischenablage kopiert</div>'
    , 'window-position-and-size': "Position und Größe des vordersten Fensters in der Anwendung $1:"
    , 'click-button-if-data-ok': "Wenn diese Daten stimmen, klicke auf die Schaltfläche „$1“"
    , 'countdown-timer': "Timer"
    , 'lifecycle': "Lebenszyklus"
    , 'open-folder-project': "Projektordner öffnen"
    , 'opening': "Öffnen"
    , 'run-a-script': "Ein Skript ausführen"
    , 'run-a-script-service': "Einen Skript-Service ausführen"
    , 'Defining-a-color': "Definition einer Farbe"
    , 'choose-a-color': "Wähle eine Farbe mit dem Picker unten."
    , 'group-tools': "Werkzeuge"
    , 'error-precise-description:': "Genaue Beschreibung des Fehlers:"
    , 'clock-set-pause': "Pausieren"

    // --- PROJETS ---
    , 'current-projects-displayed': "Aktuelle Projekte angezeigt."
    , 'data-project-id': 'Projekt-ID'
    , 'data-project-icon': 'Projektsymbol'
    , 'data-project-folder': 'Projektordner'
    , 'data-project-title': "Projekttitel"
    , 'data-project-nature': "Projektart"
    , 'importing-new-project': "Import eines neuen Projekts"
    , 'data-project-standby': 'Projekt in den Standby versetzen'
    , 'data-project-todoist': 'Projekt-ID in Todoist'
    , 'data-github-account': 'Github-Konto (des Projekts)'
    , 'data-project-createdat': "Erstellungsdatum des Projekts"
    , 'data-project-lastmod': 'Datum der letzten Änderung'
    , 'duration-work-done': 'Geleistete Arbeitszeit (Min)'
    , 'background-img-or-color': 'Hintergrundfarbe oder -bild'
    , 'githug-label-desc': "Github-Issue-Labels"

    , 'title-project': "Projekt „$1“"
    , 'new-project-name': "Name des neuen Projekts"
    , 'name-to-give-to-project': "Name für dieses Projekt"
    , 'title-data-of-project': "Daten des Projekts „$1“"
    , 'select-project-folder-and-ok': "Wähle den Projektordner im Finder aus und klicke auf „OK“."
    , 'project-saved-success': "Projekt „$1“ erfolgreich um $2 gespeichert."
    , 'alert-before-edit-projet': "Achtung, sensible Daten. Nur fortfahren, wenn du weißt, was du tust."
    , 'expli-retrait-projet': "Das Entfernen des Projekts „$1“ betrifft nicht den Ordner selbst. Es wird nur aus diesem Dashboard entfernt oder archiviert (damit es später wiederhergestellt werden kann)\n\nAchtung, wenn das Projekt nicht archiviert wird, gehen alle seine Services und Daten natürlich verloren."
    , 'project-folder-not-selected': 'Der Projektordner muss im Finder ausgewählt werden'
    , 'folder-required': 'Es muss unbedingt ein Ordner gewählt werden.'
    , 'Other-genre': "Andere Art…"
    , 'editing-project-data': "Projektdaten bearbeiten"
    , 'versionning-which-num': 'Welche Nummer soll aktualisiert werden?'
    , 'versionning-patch': 'Patch'
    , 'versionning-minor': 'Nebenversion'
    , 'versionning-major': 'Hauptversion'
    , 'select-archives-folder': 'Wähle den Archivordner im Finder aus (oder keinen, wenn die Datei nicht archiviert werden soll).'
    , 'archives…': "Archive…"
    , 'confirming-import': "Bestätigung des Imports"
    , 'confirming-project-substract': "Bestätigung der Projektentfernung"
    , 'project-substracted': "Projekt aus der Projektliste entfernt."
    , 'ending-startup-project-x': "Ende des Starts von Projekt „$1“."
    , 'modifying-project-title': "Bearbeitung des Projekttitels"
    , 'click-to-modify-title': 'Klicken, um den Titel zu ändern'
    // Projet et Service
    , 'startup-services': 'Startdienste'
    , 'others-services': 'Andere Dienste'
    // Projet et Todoist
    , 'todoist-tasks': 'Todoist-Aufgaben'
    // Projet et archives
    , 'archived-projects': "Archivierte Projekte"
    , 'choose-project-to-restart': "Wähle das zu reaktivierende Projekt."

    // Finder
    , 'open-file…': 'Datei öffnen…'
    , 'file-to-open': "Zu öffnende Datei"
    , 'opening-window-in-finder': 'Ein Fenster im Finder öffnen'
    , 'sidebar-setting': "Sidebar-Einstellung"
    , 'sidebar?': "Möchtest du die Sidebar?"
    , 'what-size-for-sidebar': 'Welche Größe soll die Sidebar haben (0 zum Ausblenden)?'
    , 'Choosing-finder-element': "Auswahl eines Finder-Elements"
    , 'select-el-in-finder-and-ok': "Wähle das Element im Finder aus und klicke auf OK."    , 'which-url': "Welche URL soll erreicht werden?"
    , 'select-file-in-finder-and-btn': "Wähle die zu öffnende Datei im Finder aus, dann „Wählen“."
    , 'Choosing-a-folder': "Auswahl eines Ordners"
    , 'select-folder-and-ok': "Wähle den Ordner im Finder aus und klicke auf OK."
    , 'select-el-in-project-and-ok': "Wähle das Element im Projektordner aus und klicke auf OK."
    , 'set-window-in-finder-and-ok': "Öffne das Fenster im Finder und stelle es wie gewünscht ein (Position, Größe, Ansichtstyp), dann klicke auf OK."
    , 'pos-window-in-finder-and-ok' : "Positioniere das Fenster im Finder und klicke auf „OK“."
    , 'sel-el-in-finder-or-click-none' : "Wähle das Element im Finder aus oder klicke auf 'Keiner'."

    // -- Service --
    , 'Common-services': 'Gemeinsame Dienste'
    , 'Custom-services': 'Benutzerdefinierte Dienste'
    , 'running-service-x': "Starte Dienst $1…"
    , 'service-success': ' Dienst „$1“ erfolgreich ausgeführt (<span class="tiny">(Dienst $2)</span>).'
    , 'service-exec-bash-code': 'Bash-Code ausführen…'
    , 'service-exec-js-code': "JS-Code ausführen…"
    , 'ask-for-code-to-exec': 'Auszuführender Code:'
    , 'ask-save-work-time': 'Soll die Arbeitszeit gespeichert werden?'
    , 'Defining-parameter': 'Parameterdefinition'
    , 'app-choice': "Auswahl einer Anwendung"
    , 'choose-app-to-use': 'Wähle die zu verwendende Anwendung'
    , 'other-app': 'Andere Anwendung…'
    , 'new-service-name': 'Neuer Name des Dienstes'
    , 'which-name-for-project-service': 'Welchen neuen Namen soll dieser Dienst für das Projekt haben?'
    , 'choose-color-or-image': "Eine Farbe oder ein Bild wählen"
    , 'which-background': 'Was möchtest du als Hintergrund wählen?'
    , 'phone-number': 'Telefonnummer'
    , 'which-phone-number': 'Bitte eine gültige Telefonnummer angeben.'
    , 'date-and-hour': 'Datum und Uhrzeit'
    , 'versioning-file': 'Eine Datei/einen Ordner versionieren'
    , "Service supprimé ($1)": "Dienst entfernt ($1)"
    , 'Learn-to-select-the-service': "Lernen, den Dienst auszuwählen"
    , 'aborted-definition': 'Definition abgebrochen.'
    // Scripts-services
    , 'Scripts-services': "Script-Service"
    , 'script-service-canceled': "Script-Service abgebrochen."

    // IDE et Terminaux
    , 'iterm-at-folder': 'iTerm im Ordner'
    , 'terminal-at-folder': 'Terminal im Ordner'
    , 'open-in-vscode': 'In VSCode öffnen'
    , 'code-to-run-at-launch': 'Beim Start auszuführender Code'
    // Git
    , 'gh-save-a-error': "Einen Fehler speichern (gh)"
    , 'initing-git-for-project': "Git für das Projekt initialisieren…"
    , 'github-account': "Name deines Github-Kontos"
    , 'github-project-name': "Projektname auf Github"
    , 'git-committing': "Auf Github committen"
    , 'git-message-commit': 'Commit-Nachricht für diese Dateien'
    , 'git-commit-message-title': "Commit-Nachricht"
    , 'gh-issues-create': "Neues Issue vom Typ…"
    , 'git-issue-list': "Issues vom Typ…"
    , 'github-label': "Github-Label:"
    , 'Message:': "Nachricht:"
    , 'gh-description:': "Genauere Beschreibung:"
    , 'gh-operation': "Auszuführende gh-Operation"
    , 'gh-message-operation': "Mit der Operation verknüpfte Nachricht:"
    , 'action-on-checked-issues': "Wähle die zu bearbeitenden Issues aus und lege die Aktion fest."
    , 'gh-close': "Schließen / entfernen"
    , 'gh-comment': "Kommentieren"
    , 'gh-pin': 'Anheften'
    , 'gh-unpin': 'Lösen'
    , 'git-installing-labels': "Definition der Git-Labels"
    , 'git-init-btn': "Git für das Projekt initialisieren"
    , 'git-issue-gestion': "Verwaltung der Github-Issues"
    , 'backend-add-labels-ajout': " + Definition der Labels."
    , 'backend-git-ready': "Git für den Ordner vorbereitet"
    , 'backend-git-failed': "git $1 fehlgeschlagen: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Wähle das Service-Skript im Finder aus, dann „OK“.'
    , 'scserv-end': 'Script-Service erfolgreich beendet (zumindest ohne Fehler).'
    , 'scserv-datetime-default-format': 'TT MM HH:MM (03 08 05:12 für den 3. August um 5:12 Uhr)'
    , 'Opening-script-file': 'Öffnen der Skriptdatei'
    , 'ask-for-modify-script-file': "Möchtest du die Skriptdatei (die die Schritte definiert) bearbeiten?"

    // -- Documentation --
    , 'Documentation': 'Dokumentation'
    , 'group-documentation': "Dokumentation"
    , 'docu-folder': 'Dokumentationsordner'
    , 'editing-documentation': 'Dokumentation bearbeiten'
    , 'initing-documentation': "Dokumentation initialisieren"
    , 'update-documentation': 'Dokumentation aktualisieren'
    , 'open-documentation': 'Dokumentation öffnen'
    , 'select-docu-folder-and-ok': 'Wähle den Ordner, in dem die Dokumentation abgelegt werden soll, dann „OK“.'
    , 'select-docu-folder': 'Wähle den Dokumentationsordner im Finder aus'
    , 'select-docu-main-file': 'Wähle die Hauptdatei der Dokumentation aus (Standard: docu.adoc)'
    , 'select-doc-main-final-file': 'Wähle die Handbuchdatei aus (Standard: docu.html)'
    , 'docu-main-file-name': 'Docu: Name der bearbeitbaren Datei'
    , 'docu-main-disp-file': 'Docu: Name der veröffentlichten Datei'
    , 'backend-docu-opened-in': "Dokumentationsordner erfolgreich geöffnet in $1"

    // Archive
    , 'backend-archiv-move-and-num': "In das Archiv verschoben und neu nummeriert $1"
    , 'backend-archiv-saved': "Version im Archiv gespeichert."

    // Tools
    , 'tools-confirm-scheduling-alert': "Erinnerung erfolgreich geplant."

    // Reminder / Rappels
    , 'remind-started': "Gestartet"
    , 'remind-remove': "Entfernen"
    , 'scheduling-alert': "Planung einer Erinnerung"
    , 'schedule-a-alert': "Eine Erinnerung planen"
    , 'hour-and-day-of-alert': "Uhrzeit der Erinnerung (und Tag, falls später)"
    , 'alert-message': "Nachricht der Erinnerung"

    // -- Todoist --
    , 'todoist-content'     : "Inhalt"
    , 'todoist-description' : "Beschreibung"
    , 'todoist-due'         : "Beginn"
    , 'todoist-deadline'    : "Frist"
    , 'todoist-duration'    : "Dauer"
    , 'todoist-priority'    : "Priorität"
    , 'todoist-labels'      : "Labels"
    , 'todoist-repeat'      : "wiederholt"
    , 'task-due-to-start'   : "Entschuldige die Störung, aber die Aufgabe „$1“ muss begonnen werden."

    , 'New task...': "Neue Aufgabe…"
    , 'New task': "Neue Aufgabe"
    , 'todoist-message-new-task': "Lege unten die allgemeinen Parameter dieser neuen Aufgabe fest. Du kannst nicht benötigte Parameter löschen und vereinfachte Marker verwenden (today, tomorrow, 4d usw.)"
    , 'todoist-message-mod-task': "Definiere unten die Parameter der Aufgabe neu."
    , 'todoist-default-fields-task': "Inhalt: $1\\\nBeschreibung: $2\\\n\\\nBeginn: $3\\\nwiederholt: $4\\\nDauer: $5\\\nPriorität: $6\\\nFrist: $7\\\nLabels: $8"
    , 'todoist-default-due-task': "TT/MM/JJJJ um h:mm"
    , 'todoist-text-new-task': "✔ Neue Aufgabe: $1"
    , 'todoist-text-mod-task': "✔ Aufgabe geändert: $1"
    , 'todoist-project-title': "Projekttitel in Todoist"
    , 'todoist-tasks': "Todoist-Aufgaben" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Bitte gib unten den Titel des Projekts $1 in der Todoist-Anwendung an."
    , 'todoist-message-today-project-task': "Liste der heutigen Aufgaben für Projekt „$1“."
    , 'confirm-tasks-checks': "Bestätigung der Aufgaben"
    , 'ask-for-confirm-tasks-checks': "Bitte bestätige die Vorgänge für die Aufgaben des Projekts „$1“.$2"
    , 'mark-task-checked': "Die Aufgabe „$1“ ist als erledigt zu markieren."
    , 'todoist-fin-tasks-done-and-create': "Die Aufgaben des Projekts „$1“ wurden aktualisiert (erledigt: $2, neu: $3)."
    , 'todoist-tasks-created-message': "Die neuen Aufgaben des Projekts „$1“ wurden erstellt ($2)."
    , 'todoist-new-task-title-errors': "Ungültige Aufgabe"
    , 'todoist-new-task-msg-correct-errors': "Bitte korrigiere die folgenden Fehler:"
    , 'todoist-no-task-done': "Keine Aufgabe als erledigt zu markieren."
    , 'todoist-no-new-task': "Keine neue Aufgabe."
    , 'todoist-modify-checked': "✔ ändern…"
    , 'todoist-errors-update-tasks': "Fehler bei der Aktualisierung der Aufgaben"
    , 'todoist-message-actualisation': "Aktualisierung der Aufgaben: neu: $1, erledigt: $2, geändert: $3"
    // -- test --
    , 'test-raw':   'ersetzt $1'
    , 'test-array': 'ersetzt $1 und $2'
    , 'test-objet': 'ersetzt $ceci und ${cela}'

    // --- Finder ---
    , 'window-opened': "Fenster erfolgreich geöffnet."
    , 'folder-opened': "Ordner erfolgreich geöffnet."

    // --- Git ---
    , 'git-init-success': "Git erfolgreich installiert."
    , 'Which-labels': "Labels?"
    , 'which-labels-to-create': "Zu erstellende Labels (keines auswählen, um sie nicht zu verändern)."

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm im Ordner geöffnet."
    , 'terminal-opened-at-folder': "Terminal im Ordner geöffnet."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - API-Schlüssel"
    , 'which-todoist-api-key': "Bitte gib deinen Todoist-API-Schlüssel (Token) an"

    // --- Documentation ---
    , 'docu-opened-in-browser': "Dokumentation geöffnet."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "Uhr|Std|h"
    , 'regexp:relative-days': "vorgestern|übermorgen|gestern|morgen|heute"
    , 'regexp:date-unit': "Monat|Monate|Woche|Wochen|Wo|Tag|Tage|T|Stunde|Stunden|Std|h|Minute|Minuten|Min"
    , 'regexp:duration-in': "in ([0-9]+) (Monat|Monate|Woche|Wochen|Wo|Tag|Tage|T|Stunde|Stunden|Std|h|Minute|Minuten|Min)"
    , 'regexp:every-prefix': "jeden "
    , 'regexp:day-word': "Tage"
    , 'regexp:weekdays': "montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag"
    , 'regexp:of-month': "des Monats"
    , 'regexp:unit-month': "Monat|Monate"
    , 'regexp:unit-week': "Woche|Wochen|Wo"
    , 'regexp:unit-day': "Tag|Tage|T"
    , 'regexp:unit-hour': "Stunde|Stunden|Std|h"
    , 'regexp:unit-minute': "Minute|Minuten|Min"
    , 'regexp:day-before-yesterday': "vorgestern"
    , 'regexp:yesterday': "gestern"
    , 'regexp:today': "heute"
    , 'regexp:tomorrow': "morgen"
    , 'regexp:day-after-tomorrow': "übermorgen"
    , 'View': "Anzeigen"
    , 'app-launching': "Initialisierung der Anwendung…"
    , 'init-projects-services-and-reminders': "Initialisierung von Projekten, Diensten und Erinnerungen…"
    , 'app-backup-running': "Sicherheitssicherung…"
    , 'app-ready': "Anwendung bereit."
    , 'app-backup-discrepancy-title': "Große Datenabweichung"
    , 'app-backup-discrepancy-intro': "Große Datenabweichung:"
    , 'app-backup-projects-diff': "$1 Projekt$3 vorher, $2 jetzt"
    , 'app-backup-services-diff': "$1 Dienst$3 vorher, $2 jetzt"
    , 'app-backup-confirm-btn': "Ich bestätige"
    , 'app-backup-restore-btn': "Zum vorherigen Backup zurückkehren"
    , 'github-pr-cycle-confirming-init': "Bestätigung der Initialisierung."
    , 'github-pr-cycle-confirm-init': "Möchten Sie diesen Github-PR-Zyklus wirklich starten?\n\nEin neuer Entwicklungsbranch wird von main aus erstellt."
    , 'github-pr-cycle-init': "Github-PR-Zyklus – Starten"
    , 'github-pr-cycle-commit': "Github-PR-Zyklus – Commit"
    , 'github-pr-cycle-submit': "Github-PR-Zyklus – Einreichen"
    , 'github-pr-cycle-confirming-submit': "Bestätigung der Einreichung."
    , 'github-pr-cycle-confirm-submit': "Möchten Sie die Einreichung der committeten Dateien wirklich bestätigen, um einen Github-Pull-Request zu erzeugen?\n\nSehr wahrscheinlich löst diese PR einen Testlauf (Github Action) aus und eventuell eine Aktualisierung der Website oder Anwendung. Bestätigen Sie also in voller Kenntnis der Sachlage."
    , 'github-pr-cycle-submission-ok': "Einreichung des Pull Requests erfolgreich abgeschlossen!"
    , 'github-pr-cycle-branch-name': "Name des zu erstellenden Entwicklungsbranches"
    , 'github-pr-cycle-commit-title': "Titel dieses Commits"
    , 'github-pr-cycle-commit-body': "Textkörper dieses Commits (kann leer bleiben)"
    , 'github-pr-cycle-inited': "Github-PR-Zyklus gestartet für $1."
    , 'git-pr-cycle-branche': "Name des Branches eines Github-PR-Zyklus."
    , 'git-title-conflict-errors-section': "<div class=title>Konfliktprobleme</div>"
    , 'git-title-syntax-errors-section': "<div class=title>Erkannte Syntaxprobleme</div>"
    , 'github-repo-visibility': "Sichtbarkeit des neuen Repositorys"
    , 'github-repo-visibility-q': "Dieses Github-Repository existiert noch nicht: Es wird erstellt. Welche Sichtbarkeit möchten Sie ihm geben?"
    , 'Private': "Privat"
    , 'Public': "Öffentlich"
    , 'github-repo-checking': "Überprüfung des Github-Repositorys…"
    , 'github-repo-description': "Repo-Beschreibung"
    , 'github-repo-description-q': "Welche Beschreibung für dieses Github-Repository?"
    , 'select-docu-folder-and-ok': "Erstellen Sie den Ordner, wählen Sie ihn im Finder aus und klicken Sie dann auf „OK“."
    , 'eval-code-btn': 'Code auswerten…'
    , 'eval-code-title': 'Code auswerten'
    , 'eval-code-run-btn': 'Interpretieren…'
    , 'eval-code-finish-btn': 'Beenden'
    , 'eval-code-running': '…'
    , 'eval-code-make-script-btn': 'Daraus ein Skript machen'
    , 'eval-code-choose-script-folder': "Wählen Sie den Ordner für das Skript aus und klicken Sie dann auf „OK“."
    , 'eval-code-script-name-title': 'Skriptname'
    , 'eval-code-script-name-q': 'Welcher Name für das Skript?'
    , 'eval-code-run-now-title': 'Skript ausführen'
    , 'eval-code-run-now-q': 'Skript jetzt ausführen?'
    , 'eval-code-add-service-title': 'Projektdienst'
    , 'eval-code-add-service-q': "Dieses Skript zu einem Dienst des Projekts $1 machen?"
    , 'eval-code-service-name-title': 'Name der Schaltfläche'
    , 'eval-code-service-name-q': 'Welcher Name für diese Dienst-Schaltfläche?'
    , 'git-commit-all-done': "Alle Dateien wurden auf Github übertragen."
    , 'create-a-file': "Datei erstellen"
    , 'ask-path-to-file-in-folder': 'Pfad zur Datei:\n\n(relativ zum Projektordner; alle neuen Ordner werden erstellt)'
    , 'ask-file-content': "Dateiinhalt:"
    , 'reload-project-data-title': "Persistente Projektdaten neu laden"
    , 'edit-projet-reload-hint': "Um die geänderten Daten neu zu laden, klicken Sie auf das Werkzeug $1"
    , 'project-data-reloaded': "Daten von „$1“ neu geladen."
    , 'search-documentation': "Suchen…"
    , 'search-type-q': "Suchtyp:"
    , 'search-type-any': "Beliebiger Text"
    , 'search-type-target': "Ziel: [[...]]"
    , 'search-type-link': "Link: <<...>>"
    , 'search-text-q': "Zu suchender Text (regulärer Ausdruck möglich):"
    , 'search-results-title': "Suchergebnisse"
    , 'search-results-query': "Suche: $1"
    , 'search-results-empty': "Kein Ergebnis."
    , 'search-results-close-btn': "Schließen"
    , 'backend-search-done': "$1 Ergebnis(se) gefunden."
    , 'search-project': "Im Projekt suchen…"
    , 'excluded-folders-q': "Von der Suche auszuschließende Ordner (durch Kommas getrennt):"
    , 'choose-folder-btn': "Ordner…"
    , 'extensions-q': "Zu durchsuchende Dateiendungen (keine ausgewählt = alle):"
    , 'search-results-count-one': " ($1 Treffer)"
    , 'search-results-count-many': " ($1 Treffer)"
    , 'gh-issue-created': "Issue #$1 erfolgreich gespeichert."
}
