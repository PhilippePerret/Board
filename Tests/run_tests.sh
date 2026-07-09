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

trap restore_board EXIT INT TERM

backup_board

CUR_DIR="$(cd "$(dirname "$0")" && pwd)"

# === TODO : lancement des specs (Tests/specs/e2e, Tests/specs/unit) ===
echo "TODO: lancer les specs depuis $CUR_DIR/specs"

# la restauration se fait automatiquement via le trap
