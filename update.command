#!/bin/zsh


# Script à lancer quand on modifie les fichiers de backend et 
# frontend pour que l'application soit aussitôt updatée.

pkill -x Board

CUR_DIR="$(cd "$(dirname "$0")" && pwd)"

cp -R $CUR_DIR/frontend/* "$CUR_DIR/Board.app/Contents/Resources/frontend/"
cp -R $CUR_DIR/backend/* "$CUR_DIR/Board.app/Contents/Resources/backend/"

sleep 1

open "$CUR_DIR/Board.app"

open_safari_devtools() {
  sleep 2
  MenuMacMini=$'Mac mini de Philippe\nmacOS 26.5.1'
  osascript <<APPLESCRIPT
tell application "Safari" to activate
delay 1
tell application "System Events"
  tell process "Safari"
    tell menu bar item "Développement" of menu bar 1
      click
      tell menu "Développement"
        tell menu item "$MenuMacMini"
          click
          tell menu "$MenuMacMini"
            click menu item "Tableau de bord"
          end tell
        end tell
      end tell
    end tell
  end tell
end tell
tell app "Board" to activate
APPLESCRIPT
}

open_safari_devtools


