-- Sélectionne un dossier dans le Finder, pour simuler l'étape manuelle
-- "on choisit un dossier dans le Finder" des tests d'intégration.
--
-- Usage : osascript Tests/support/finder_select.applescript <posixPath>

on run argv
	set targetPath to item 1 of argv
	tell application "Finder"
		select (POSIX file targetPath as alias)
	end tell
end run
