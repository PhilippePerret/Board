#!/bin/zsh

# Suite de tests d'intégration de Board.
#
# - sauvegarde ~/Library/Application Support/Board avant la suite
# - restaure ce dossier tel quel (présent ou absent) après la suite,
#   même en cas d'erreur ou d'interruption (Ctrl-C)

set -e

BOARD_DIR="$HOME/Library/Application Support/Board"
BACKUP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/board-test-backup.XXXXXX")
BOARD_EXISTED=0

backup_board() {
  if [ -d "$BOARD_DIR" ]; then
    BOARD_EXISTED=1
    mv "$BOARD_DIR" "$BACKUP_DIR/Board"
  fi
}

restore_board() {
  rm -rf "$BOARD_DIR"
  if [ "$BOARD_EXISTED" -eq 1 ]; then
    mv "$BACKUP_DIR/Board" "$BOARD_DIR"
  fi
  rm -rf "$BACKUP_DIR"
}

CUR_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$CUR_DIR")"

quit_app() {
  pkill -x Board 2>/dev/null || true
}

teardown() {
  quit_app
  restore_board
}

trap teardown EXIT INT TERM

backup_board

quit_app
sleep 0.5
open "$APP_DIR/Board.app"
sleep 1.5

EXIT_CODE=0
for spec in "$CUR_DIR"/specs/e2e/*.rb; do
  [ -e "$spec" ] || continue
  echo "--- $spec ---"
  ruby "$spec" || EXIT_CODE=1
done

# quit + restauration se font automatiquement via le trap (teardown)
exit $EXIT_CODE
