-- Position + taille de la fenêtre de premier plan de l'application donnée
-- en argument (nom exact, cf. GetRunningApps.scpt) — copiées dans le
-- presse-papier au format "x, y, width, height" (même ordre que les params
-- de type 'finder-window', cf. ServiceData.js). Panneau "Outils" (Tools.js).

on run argv
	set appName to item 1 of argv

	tell application "System Events"
		if not (exists process appName) then
			return "{\"ok\":false,\"error\":\"Application introuvable ou fermée : " & appName & "\"}"
		end if
		tell process appName
			if (count of windows) is 0 then
				return "{\"ok\":false,\"error\":\"Aucune fenêtre ouverte pour " & appName & "\"}"
			end if
			set winPos to position of (front window)
			set winSize to size of (front window)
		end tell
	end tell

	set x to item 1 of winPos
	set y to item 2 of winPos
	set w to item 1 of winSize
	set h to item 2 of winSize
	set the clipboard to ((x as string) & ", " & (y as string) & ", " & (w as string) & ", " & (h as string))

	return "{\"ok\":true,\"x\":" & x & ",\"y\":" & y & ",\"width\":" & w & ",\"height\":" & h & "}"
end run
