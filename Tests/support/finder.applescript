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
--   open-window  <posixPath>    (ouvre une vraie fenêtre CIBLÉE sur ce dossier
--     précis — contrairement à "select"/reveal, qui ouvre une fenêtre sur le
--     dossier PARENT avec l'élément juste sélectionné dedans)
--   deselect                    (ouvre une fenêtre sur un dossier neutre, sans rien sélectionner dedans)
--   window-ids                 (id des fenêtres Finder ouvertes, une par ligne)
--   close-window <id>          (ferme la fenêtre si elle existe encore)
--   front-window-name          (nom de la fenêtre Finder au premier plan, "" si aucune)
--   close-front-window-if-named <name> (ferme la fenêtre Finder au premier
--     plan SEULEMENT si elle porte ce nom — sinon ignore, ne ferme rien)
--   close-all-windows           (ferme toutes les fenêtres Finder actuelles —
--     à utiliser seulement après un snapshot-windows, pour repartir propre
--     en début de suite ; la restauration se fait via restore-windows)
--   snapshot-windows            (dossier + position de TOUTES les fenêtres
--     Finder ouvertes, une ligne par fenêtre, champs séparés par tabulation :
--     targetPath, bounds "x1,y1,x2,y2", sélection (chemins séparés par
--     virgule). Sélection capturée SEULEMENT pour la fenêtre de devant —
--     "selection" ne suit pas "index" (vérifié empiriquement : la même
--     sélection remonte pour toutes les fenêtres si on essaie de les amener
--     au premier plan une par une), pas de moyen fiable trouvé pour lire la
--     sélection propre à une fenêtre en arrière-plan.
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

	else if theAction is "open-window" then
		tell application "Finder"
			make new Finder window to (POSIX file (item 2 of argv) as alias)
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
		-- Essai précédent (2026-07-11) : "set index of w to 1" seul ne change
		-- pas ce que "selection" renvoie (vérifié : même sélection remontée
		-- pour toutes les fenêtres). Nouvel essai : "activate" Finder en plus
		-- de l'index, avec un court délai, avant de lire la sélection.
		set outText to ""
		set widList to {}
		tell application "Finder"
			set widList to id of every window
			activate
		end tell
		repeat with wid in widList
			set targetPath to ""
			set boundsText to ""
			set selText to ""
			tell application "Finder"
				set w to (first window whose id is wid)
				try
					set targetPath to (POSIX path of (target of w as alias))
				end try
				try
					set b to bounds of w
					set boundsText to ((item 1 of b) as string) & "," & ((item 2 of b) as string) & "," & ((item 3 of b) as string) & "," & ((item 4 of b) as string)
				end try
				try
					set index of w to 1
				end try
			end tell
			delay 0.3
			tell application "Finder"
				try
					set selPaths to {}
					repeat with s in (selection as list)
						set end of selPaths to (POSIX path of (s as alias))
					end repeat
					set AppleScript's text item delimiters to ","
					set selText to selPaths as text
					set AppleScript's text item delimiters to ""
				end try
			end tell
			set outText to outText & targetPath & tab & boundsText & tab & selText & linefeed
		end repeat
		return outText

	else if theAction is "restore-windows" then
		-- Chaque étape a son propre try (au lieu d'un seul englobant tout) :
		-- une erreur de sélection, par exemple, ne doit pas rester invisible
		-- juste parce que la création de fenêtre a réussi.
		set payload to item 2 of argv
		set diag to ""
		tell application "Finder"
			close every window
		end tell
		set AppleScript's text item delimiters to linefeed
		set theLines to text items of payload
		set AppleScript's text item delimiters to ""
		-- Capturé devant → derrière ; "make new Finder window" passe toujours
		-- devant les autres, donc il faut recréer dans l'ordre inverse
		-- (derrière d'abord) pour retrouver le même ordre au premier plan.
		set theLines to (reverse of theLines)
		set lineIndex to 0
		repeat with theLine in theLines
			set lineIndex to lineIndex + 1
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
						tell application "Finder" to make new Finder window to (POSIX file targetPath)
					on error errMsg
						set diag to diag & "fenêtre " & lineIndex & " (création) : " & errMsg & linefeed
					end try
					if boundsText is not "" then
						try
							set AppleScript's text item delimiters to ","
							set boundsList to text items of boundsText
							set AppleScript's text item delimiters to ""
							tell application "Finder" to set bounds of front window to {(item 1 of boundsList) as integer, (item 2 of boundsList) as integer, (item 3 of boundsList) as integer, (item 4 of boundsList) as integer}
						on error errMsg
							set diag to diag & "fenêtre " & lineIndex & " (position) : " & errMsg & linefeed
						end try
					end if
					if selText is not "" then
						try
							set AppleScript's text item delimiters to ","
							set selPaths to text items of selText
							set AppleScript's text item delimiters to ""
							set selItems to {}
							repeat with p in selPaths
								set end of selItems to ((POSIX file p) as alias)
							end repeat
							delay 0.3
							tell application "Finder" to select selItems
						on error errMsg
							set diag to diag & "fenêtre " & lineIndex & " (sélection) : " & errMsg & linefeed
						end try
					end if
				end if
			end if
		end repeat
		if diag is "" then
			return "ok"
		else
			return "ok (avec erreurs)" & linefeed & diag
		end if

	else
		error "Action Finder inconnue : " & theAction
	end if
end run
