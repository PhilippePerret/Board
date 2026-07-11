-- Actions Finder utilisées par les tests : sélectionner un dossier (pour
-- simuler l'étape manuelle "on choisit un dossier dans le Finder"), et
-- fermer proprement les fenêtres que cette sélection a pu ouvrir.
--
-- Usage : osascript Tests/support/finder.applescript <action> [args]
--   select       <posixPath>
--   deselect                    (ouvre une fenêtre sur un dossier neutre, sans rien sélectionner dedans)
--   window-ids                 (id des fenêtres Finder ouvertes, une par ligne)
--   close-window <id>          (ferme la fenêtre si elle existe encore)
--   front-window-name          (nom de la fenêtre Finder au premier plan, "" si aucune)
--   close-front-window-if-named <name> (ferme la fenêtre Finder au premier
--     plan SEULEMENT si elle porte ce nom — sinon ignore, ne ferme rien)

on run argv
	set theAction to item 1 of argv

	if theAction is "select" then
		tell application "Finder"
			select (POSIX file (item 2 of argv) as alias)
		end tell

	else if theAction is "deselect" then
		-- "set selection to {}" ne vide pas fiablement la sélection Finder.
		-- Ouvrir une fenêtre sur un dossier, sans cliquer dessus, donne une
		-- sélection vide par construction (rien n'est sélectionné dedans).
		tell application "Finder"
			make new Finder window to (path to home folder)
		end tell

	else if theAction is "window-ids" then
		set out to ""
		tell application "Finder"
			set wids to id of every window
		end tell
		repeat with wid in wids
			set out to out & wid & linefeed
		end repeat
		return out

	else if theAction is "close-window" then
		set targetId to (item 2 of argv) as integer
		tell application "Finder"
			try
				close (first window whose id is targetId)
			end try
		end tell

	else if theAction is "front-window-name" then
		tell application "Finder"
			try
				return name of front window
			on error
				return ""
			end try
		end tell

	else if theAction is "close-front-window-if-named" then
		-- Ne ferme QUE si la fenêtre Finder au premier plan porte bien ce nom
		-- juste avant de fermer (pas seulement au moment de l'ouverture) :
		-- si autre chose a pris le focus entre-temps (une fenêtre Finder
		-- personnelle de l'utilisateur, par exemple), on ne touche à rien.
		set expectedName to item 2 of argv
		tell application "Finder"
			try
				set actualName to name of front window
			on error
				return "erreur : aucune fenêtre Finder au premier plan"
			end try
			if actualName is not expectedName then
				return "ignoré : fenêtre au premier plan = " & actualName & " (attendu " & expectedName & ")"
			end if
			try
				close front window
				return "ok"
			on error errMsg
				return "erreur fermeture : " & errMsg
			end try
		end tell

	else
		error "Action Finder inconnue : " & theAction
	end if
end run
