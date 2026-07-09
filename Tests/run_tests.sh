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

GREEN=$'\e[32m'
RED=$'\e[31m'
YELLOW=$'\e[33m'
RESET=$'\e[0m'

TOTAL=0
NB_PASS=0
NB_FAIL=0
NB_PENDING=0

for spec in "$CUR_DIR"/specs/e2e/*.rb; do
  [ -e "$spec" ] || continue
  echo "--- $spec ---"
  if ruby "$spec"; then code=0; else code=$?; fi
  TOTAL=$((TOTAL + 1))
  case $code in
    0) NB_PASS=$((NB_PASS + 1)) ;;
    2) NB_PENDING=$((NB_PENDING + 1)) ;;
    *) NB_FAIL=$((NB_FAIL + 1)) ;;
  esac
done

if [ "$NB_FAIL" -gt 0 ]; then MAIN_COLOR=$RED; else MAIN_COLOR=$GREEN; fi
if [ "$NB_PENDING" -gt 0 ]; then PENDING_COLOR=$YELLOW; else PENDING_COLOR=$MAIN_COLOR; fi

echo ""
echo "${MAIN_COLOR}Success: ${NB_PASS}  Failures: ${NB_FAIL}  ${PENDING_COLOR}Pendings: ${NB_PENDING}${MAIN_COLOR}  Test count: ${TOTAL}${RESET}"

# quit + restauration se font automatiquement via le trap (teardown)
[ "$NB_FAIL" -eq 0 ]
