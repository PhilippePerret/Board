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
    , 'choose-files-to': "Wähle die Dateien zum $1 (Klick)"
    , 'select-filter-placeholder': "Filtern…"
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
    , 'size-and-position-in-clipboard': "Position/Größe in die Zwischenablage kopiert: $1, $2, $3, $4."
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
    , 'initing-git-for-project': "Git für das Projekt initialisieren"
    , 'github-account': "Name deines Github-Kontos"
    , 'github-project-name': "Projektname auf Github"
    , 'git-committing': "Auf Github committen"
    , 'git-message-commit': 'Commit-Nachricht für diese Dateien'
    , 'git-commit-message-title': "Commit-Nachricht"
    , 'gh-issues-create': "Neues Issue vom Typ…"
    , 'git-issue-list': "Issues vom Typ markieren…"
    , 'github-label': "Github-Label:"
    , 'Message:': "Nachricht:"
    , 'gh-description:': "Genauere Beschreibung:"
    , 'gh-operation': "Auszuführende gh-Operation"
    , 'gh-message-operation': "Mit der Operation verknüpfte Nachricht:"
    , 'action-on-checked-issues': "Wähle die zu bearbeitenden Issues aus und wähle die Aktion."
    , 'gh-close': "Schließen / entfernen"
    , 'gh-comment': "Kommentieren"
    , 'gh-pin': 'Anheften'
    , 'gh-unpin': 'Lösen'
    , 'git-installing-labels': "Definition der Git-Labels"
    , 'git-init-btn': "Git für das Projekt initialisieren"

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
}
