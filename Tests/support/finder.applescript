-- Actions Finder utilisées par les tests : sélectionner un dossier (pour
-- simuler l'étape manuelle "on choisit un dossier dans le Finder"), et
-- fermer proprement les fenêtres que cette sélection a pu ouvrir.
--
-- Usage : osascript Tests/support/finder.applescript <action> [args]
--   select       <posixPath>    ("reveal", pas "select" seul : garantit une
--     fenêtre au premier plan sur l'élément précis — nom renvoyé pour
--     fermeture sûre ensuite, même garantie que "deselect"/"make new Finder
--     window" plus bas. Hypothèse non confirmée : "select" seul, sans
--     fenêtre déjà ouverte sur l'élément, pouvait laisser la sélection de
--     Finder retomber sur autre chose (ex. une fenêtre déjà ouverte ailleurs).
--   deselect                    (ouvre une fenêtre sur un dossier neutre, sans rien sélectionner dedans)
--   window-ids                 (id des fenêtres Finder ouvertes, une par ligne)
--   close-window <id>          (ferme la fenêtre si elle existe encore)
--   front-window-name          (nom de la fenêtre Finder au premier plan, "" si aucune)
--   close-front-window-if-named <name> (ferme la fenêtre Finder au premier
--     plan SEULEMENT si elle porte ce nom — sinon ignore, ne ferme rien)
--   close-all-windows           (ferme toutes les fenêtres Finder actuelles —
--     à utiliser seulement après un snapshot-windows, pour repartir propre
--     en début de suite ; la restauration se fait via restore-windows)
--   snapshot-windows            (dossier + position + sélection de TOUTES
--     les fenêtres Finder ouvertes, une ligne par fenêtre, champs séparés
--     par tabulation : targetPath, bounds "x1,y1,x2,y2", sélection (chemins
--     séparés par virgule, uniquement pour la fenêtre de devant — la
--     sélection Finder n'est exposée qu'au niveau app, pas par fenêtre)
--   restore-windows <payload>   (ferme toutes les fenêtres Finder actuelles
--     puis recrée exactement celles du payload, dans l'ordre, avec leur
--     position et leur sélection si connue — ne restaure PAS la vue
--     liste/icônes/colonnes ni les onglets multiples dans une même fenêtre)

on run argv
	set theAction to item 1 of argv

	if theAction is "select" then
		tell application "Finder"
			reveal (POSIX file (item 2 of argv) as alias)
			return name of front window
		end tell

	else if theAction is "deselect" then
		-- "set selection to {}" ne vide pas fiablement la sélection Finder.
		-- Ouvrir une fenêtre sur un dossier, sans cliquer dessus, donne une
		-- sélection vide par construction (rien n'est sélectionné dedans).
		-- "make new Finder window" devient TOUJOURS la fenêtre au premier
		-- plan (comme OpenFolderProject.scpt) : on peut donc renvoyer son nom
		-- ici, sans ambiguïté possible avec une fenêtre personnelle déjà
		-- ouverte avant cet appel.
		tell application "Finder"
			make new Finder window to (path to home folder)
			return name of front window
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

	else if theAction is "close-all-windows" then
		tell application "Finder"
			close every window
		end tell
		return "ok"

	else if theAction is "snapshot-windows" then
		set outText to ""
		tell application "Finder"
			set winCount to count of windows
			repeat with i from 1 to winCount
				set w to window i
				set targetPath to ""
				try
					set targetPath to (POSIX path of (target of w as alias))
				end try
				set boundsText to ""
				try
					set b to bounds of w
					set boundsText to ((item 1 of b) as string) & "," & ((item 2 of b) as string) & "," & ((item 3 of b) as string) & "," & ((item 4 of b) as string)
				end try
				set selText to ""
				if i is 1 then
					try
						set selPaths to {}
						repeat with s in (selection as list)
							set end of selPaths to (POSIX path of (s as alias))
						end repeat
						set AppleScript's text item delimiters to ","
						set selText to selPaths as text
						set AppleScript's text item delimiters to ""
					end try
				end if
				set outText to outText & targetPath & tab & boundsText & tab & selText & linefeed
			end repeat
		end tell
		return outText

	else if theAction is "restore-windows" then
		set payload to item 2 of argv
		tell application "Finder"
			close every window
		end tell
		set AppleScript's text item delimiters to linefeed
		set theLines to text items of payload
		set AppleScript's text item delimiters to ""
		repeat with theLine in theLines
			if theLine is not "" then
				set AppleScript's text item delimiters to tab
				set theFields to text items of theLine
				set AppleScript's text item delimiters to ""
				set targetPath to item 1 of theFields
				set boundsText to ""
				if (count of theFields) > 1 then set boundsText to item 2 of theFields
				set selText to ""
				if (count of theFields) > 2 then set selText to item 3 of theFields
				if targetPath is not "" then
					try
						tell application "Finder"
							make new Finder window to (POSIX file targetPath)
							if boundsText is not "" then
								set AppleScript's text item delimiters to ","
								set boundsList to text items of boundsText
								set AppleScript's text item delimiters to ""
								set bounds of front window to {(item 1 of boundsList) as integer, (item 2 of boundsList) as integer, (item 3 of boundsList) as integer, (item 4 of boundsList) as integer}
							end if
							if selText is not "" then
								set AppleScript's text item delimiters to ","
								set selPaths to text items of selText
								set AppleScript's text item delimiters to ""
								set selItems to {}
								repeat with p in selPaths
									set end of selItems to ((POSIX file p) as alias)
								end repeat
								select selItems
							end if
						end tell
					end try
				end if
			end if
		end repeat
		return "ok"

	else
		error "Action Finder inconnue : " & theAction
	end if
end run
