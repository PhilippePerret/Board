-- Actions Finder utilisées par les tests : sélectionner un dossier (pour
-- simuler l'étape manuelle "on choisit un dossier dans le Finder"), et
-- fermer proprement les fenêtres que cette sélection a pu ouvrir.
--
-- Usage : osascript Tests/support/finder.applescript <action> [args]
--   select       <posixPath>
--   deselect                    (ouvre une fenêtre sur un dossier neutre, sans rien sélectionner dedans)
--   window-ids                 (id des fenêtres Finder ouvertes, une par ligne)
--   close-window <id>          (ferme la fenêtre si elle existe encore)

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

	else
		error "Action Finder inconnue : " & theAction
	end if
end run
