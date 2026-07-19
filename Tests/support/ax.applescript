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
--   order-of <domIds>  (domIds : plusieurs ids exacts séparés par des
--     tabulations. Un seul parcours récursif de l'arbre AX depuis la racine ;
--     renvoie, en lignes séparées par des retours à la ligne, ceux de ces ids
--     effectivement trouvés, dans l'ordre où le parcours les rencontre —
--     donc l'ordre réel d'affichage/DOM. Les ids absents de l'arbre sont
--     simplement omis du résultat.)
--   panel-open <domId>  ("true"/"false", pas d'attente. Un panneau
--     SidePanel (frontend/css/services.css .closed) n'est jamais retiré de
--     l'arbre AX quand il est fermé, juste décalé hors écran via `right` —
--     absent de l'arbre : "false" (jamais construit). Présent : "false" si
--     son bord droit dépasse le bord droit de la fenêtre (poussé hors
--     champ), "true" sinon.)
--   batch <payload>  (moteur "version-batch" — exécute plusieurs actions sans
--     valeur de retour en un seul process osascript. <payload> : lignes
--     séparées par des retours à la ligne, chaque ligne = action, needle et
--     éventuel 3e argument séparés par des tabulations. Actions supportées :
--     click, click-prefix, set-value, set-value-prefix. Échoue au premier
--     item en erreur, message préfixé par son rang dans le batch.)

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

on axPosition(elem)
	tell application "System Events"
		return position of elem
	end tell
end axPosition

on axSize(elem)
	tell application "System Events"
		return size of elem
	end tell
end axSize

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

-- Parcours récursif unique, collecte (dans foundList) l'AXDOMIdentifier de
-- chaque nœud rencontré dont l'id figure dans targetIds — dans l'ordre de
-- rencontre du parcours (= ordre DOM pour des éléments frères).
on collectInOrder(elem, targetIds, foundList)
	try
		set theId to (my axDomId(elem))
		if targetIds contains theId then
			set end of foundList to theId
		end if
	end try
	try
		set kids to my axChildren(elem)
	on error
		return foundList
	end try
	repeat with kid in kids
		set foundList to my collectInOrder(kid, targetIds, foundList)
	end repeat
	return foundList
end collectInOrder

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

-- Actions sans valeur de retour, factorisées pour être appelables une par
-- une (on run) ou en séquence (action "batch", cf. plus bas). extraArg n'est
-- utilisé que par set-value(-prefix) ; passer "" pour les autres.
on performOne(theAction, needle, extraArg)
	if theAction is "click" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		tell application "System Events" to perform action "AXPress" of el

	else if theAction is "click-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		tell application "System Events" to perform action "AXPress" of el

	else if theAction is "set-value" then
		set el to my waitForMatch("exact", needle, defaultTimeout)
		tell application "System Events" to set value of el to extraArg

	else if theAction is "set-value-prefix" then
		set el to my waitForMatch("prefix", needle, defaultTimeout)
		tell application "System Events" to set value of el to extraArg

	else
		error "Action batch inconnue : " & theAction
	end if
end performOne

on run argv
	if (count of argv) < 2 then error "Usage: ax.applescript <action> <domId> [value|timeout]"
	set theAction to item 1 of argv
	set needle to item 2 of argv

	if theAction is "click" then
		my performOne("click", needle, "")

	else if theAction is "click-prefix" then
		my performOne("click-prefix", needle, "")

	else if theAction is "set-value" then
		my performOne("set-value", needle, (item 3 of argv))

	else if theAction is "set-value-prefix" then
		my performOne("set-value-prefix", needle, (item 3 of argv))

	else if theAction is "batch" then
		set batchText to needle
		set AppleScript's text item delimiters to linefeed
		set theLines to text items of batchText
		set AppleScript's text item delimiters to ""
		repeat with i from 1 to (count of theLines)
			set theLine to item i of theLines
			if theLine is not "" then
				set AppleScript's text item delimiters to tab
				set theFields to text items of theLine
				set AppleScript's text item delimiters to ""
				set subAction to item 1 of theFields
				set subNeedle to item 2 of theFields
				set subExtra to ""
				if (count of theFields) > 2 then set subExtra to item 3 of theFields
				try
					my performOne(subAction, subNeedle, subExtra)
				on error errMsg
					error "batch item " & i & " (" & subAction & " " & subNeedle & ") a échoué : " & errMsg
				end try
			end if
		end repeat
		return "ok"

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

	else if theAction is "panel-open" then
		set found to missing value
		try
			set found to my findByDomId(my rootWindow(), needle)
		end try
		if found is missing value then return "false"
		set panelPos to my axPosition(found)
		set panelSize to my axSize(found)
		set winPos to my axPosition(my rootWindow())
		set winSize to my axSize(my rootWindow())
		set panelRight to (item 1 of panelPos) + (item 1 of panelSize)
		set winRight to (item 1 of winPos) + (item 1 of winSize)
		-- tolérance de 5px : le panneau ouvert est collé au bord droit
		-- (right:0), le fermé décalé d'au moins 100px de plus (services.css)
		if panelRight > (winRight + 5) then
			return "false"
		else
			return "true"
		end if

	else if theAction is "order-of" then
		set AppleScript's text item delimiters to tab
		set targetIds to text items of needle
		set AppleScript's text item delimiters to ""
		set foundList to my collectInOrder(my rootWindow(), targetIds, {})
		set AppleScript's text item delimiters to linefeed
		set outText to foundList as text
		set AppleScript's text item delimiters to ""
		return outText

	else
		error "Action AppleScript inconnue : " & theAction
	end if
end run
