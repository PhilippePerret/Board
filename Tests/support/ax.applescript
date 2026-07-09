-- Pilotage de Board.app via System Events, ciblage des éléments par
-- AXDOMIdentifier (= attribut `id` du DOM dans la WKWebView).
--
-- Un seul panneau modal (ConfirmDialog/TextFieldDialog/SelectDialog) est
-- visible à la fois dans l'app ; les éléments cachés (display:none) ne sont
-- pas exposés dans l'arbre d'accessibilité, donc une recherche par id
-- retourne toujours l'élément visible courant, sans ambiguïté.
--
-- Usage : osascript Tests/support/ax.applescript <action> <args...>
--   click        <domId>
--   click-prefix <domIdPrefix>
--   set-value        <domId>       <value>
--   set-value-prefix <domIdPrefix> <value>
--   get-value        <domId>
--   get-value-prefix <domIdPrefix>
--   wait-for        <domId>       [timeoutSeconds]
--   wait-for-prefix <domIdPrefix> [timeoutSeconds]
--   get-text        <domId>        (texte de tous les AXStaticText descendants, concaténés)
--   get-text-prefix <domIdPrefix>
--   exists          <domId>        ("true"/"false", recherche immédiate, pas d'attente)
--   click-parent        <domId>        (clique le parent AX de l'élément trouvé)
--   click-parent-prefix <domIdPrefix>

use AppleScript version "2.4"
use scripting additions

property appName : "Board"
property defaultTimeout : 5

-- Le vocabulaire System Events ("attribute", "UI elements", ...) doit être
-- résolu à la compilation dans un bloc `tell application "System Events"`
-- lexical : la portée dynamique d'un `tell` appelant ne suffit pas.
on axDomId(elem)
	tell application "System Events"
		return value of attribute "AXDOMIdentifier" of elem
	end tell
end axDomId

on axChildren(elem)
	tell application "System Events"
		try
			return UI elements of elem
		on error
			return {}
		end try
	end tell
end axChildren

on axRole(elem)
	tell application "System Events"
		return role of elem
	end tell
end axRole

on axValue(elem)
	tell application "System Events"
		return value of elem
	end tell
end axValue

-- Certains éléments structurels (ex. la div d'une carte projet) sont
-- "aplatis" par WebKit et n'apparaissent jamais comme nœud AX distinct,
-- même avec un id DOM. On les atteint en remontant depuis un enfant qui,
-- lui, est bien exposé (ex. son titre).
on axParent(elem)
	tell application "System Events"
		return (value of attribute "AXParent" of elem)
	end tell
end axParent

-- Concatène le texte de tous les AXStaticText descendants (le contenu
-- textuel d'un élément non-formulaire, ex. #message, n'est pas exposé
-- directement sur lui mais sur ses enfants AXStaticText).
on collectText(elem)
	if (my axRole(elem)) is "AXStaticText" then
		set v to my axValue(elem)
		if v is missing value then return ""
		return (v as text)
	end if
	-- "result" est un mot-clé implicite d'AppleScript (résultat de la
	-- dernière instruction) : ne jamais l'utiliser comme nom de variable.
	set txt to ""
	repeat with kid in (my axChildren(elem))
		set txt to txt & (my collectText(kid))
	end repeat
	return txt
end collectText

-- Recherche récursive par égalité stricte de AXDOMIdentifier
on findByDomId(elem, domId)
	try
		if (my axDomId(elem)) is domId then return elem
	end try
	try
		set kids to my axChildren(elem)
	on error
		return missing value
	end try
	repeat with kid in kids
		set found to my findByDomId(kid, domId)
		if found is not missing value then return found
	end repeat
	return missing value
end findByDomId

-- Recherche récursive par préfixe de AXDOMIdentifier (ids générés
-- dynamiquement, ex. "__panel-3__")
on findByDomIdPrefix(elem, prefixStr)
	try
		set theId to (my axDomId(elem))
		if theId starts with prefixStr then return elem
	end try
	try
		set kids to my axChildren(elem)
	on error
		return missing value
	end try
	repeat with kid in kids
		set found to my findByDomIdPrefix(kid, prefixStr)
		if found is not missing value then return found
	end repeat
	return missing value
end findByDomIdPrefix

on rootWindow()
	tell application "System Events"
		tell application process appName
			return window 1
		end tell
	end tell
end rootWindow

on waitForMatch(matcher, needle, timeoutSeconds)
	set startTime to (current date)
	repeat
		set found to missing value
		try
			set root to my rootWindow()
			if matcher is "prefix" then
				set found to my findByDomIdPrefix(root, needle)
			else
				set found to my findByDomId(root, needle)
			end if
		end try
		if found is not missing value then return found
		if ((current date) - startTime) > timeoutSeconds then
			error "Timeout : élément introuvable (" & matcher & "=" & needle & ") après " & timeoutSeconds & "s"
		end if
		delay 0.2
	end repeat
end waitForMatch

on run argv
	if (count of argv) < 2 then error "Usage: ax.applescript <action> <domId> [value|timeout]"
	set theAction to item 1 of argv
	set needle to item 2 of argv

	if theAction is "click" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		tell application "System Events" to perform action "AXPress" of el

	else if theAction is "click-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		tell application "System Events" to perform action "AXPress" of el

	else if theAction is "set-value" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		tell application "System Events" to set value of el to (item 3 of argv)

	else if theAction is "set-value-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		tell application "System Events" to set value of el to (item 3 of argv)

	else if theAction is "get-value" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		tell application "System Events" to return value of el

	else if theAction is "get-value-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		tell application "System Events" to return value of el

	else if theAction is "wait-for" then
		set t to defaultTimeout
		if (count of argv) > 2 then set t to (item 3 of argv) as number
		my waitForMatch("exact", needle, t)
		return "ok"

	else if theAction is "wait-for-prefix" then
		set t to defaultTimeout
		if (count of argv) > 2 then set t to (item 3 of argv) as number
		my waitForMatch("prefix", needle, t)
		return "ok"

	else if theAction is "get-text" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		return my collectText(el)

	else if theAction is "get-text-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		return my collectText(el)

	else if theAction is "exists" then
		set found to missing value
		try
			set found to my findByDomId(my rootWindow(), needle)
		end try
		if found is missing value then
			return "false"
		else
			return "true"
		end if

	else if theAction is "click-parent" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		set parentEl to my axParent(el)
		tell application "System Events" to perform action "AXPress" of parentEl

	else if theAction is "click-parent-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		set parentEl to my axParent(el)
		tell application "System Events" to perform action "AXPress" of parentEl

	else
		error "Action AppleScript inconnue : " & theAction
	end if
end run
