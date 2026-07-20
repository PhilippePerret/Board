-- Liste des applications ouvertes (visibles, donc dans le Dock) — pour le
-- panneau "Outils" (Tools.js), afin de choisir celle dont on veut la taille
-- de la fenêtre de premier plan.

tell application "System Events"
	set appNames to name of every application process whose visible is true
end tell

set jsonList to "["
repeat with i from 1 to count of appNames
	set n to item i of appNames
	set jsonList to jsonList & "\"" & n & "\""
	if i < (count of appNames) then set jsonList to jsonList & ","
end repeat
set jsonList to jsonList & "]"

return "{\"ok\":true,\"apps\":" & jsonList & "}"
