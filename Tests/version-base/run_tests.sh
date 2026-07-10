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

# VTEST_DIR = Dossier de la version de test (base, améliorée, etc.)
VTEST_DIR="$(cd "$(dirname "$0")" && pwd)"
# Dossier principal des tests de l'application
MAIN_TESTS_DIR="$(dirname "$VTEST_DIR")"
# Dossier contenant les tests eux-mêmes
SPECS_DIR="$MAIN_TESTS_DIR/specs"
APP_DIR="$(dirname "$MAIN_TESTS_DIR")"

quit_app() {
  pkill -x Board 2>/dev/null || true
}

teardown() {
  quit_app
  restore_board
}

trap teardown EXIT INT TERM

backup_board

cp -R "$APP_DIR/frontend/"* "$APP_DIR/Board.app/Contents/Resources/frontend/"
cp -R "$APP_DIR/backend/"* "$APP_DIR/Board.app/Contents/Resources/backend/"

quit_app
until ! pgrep -x Board >/dev/null 2>&1; do sleep 0.1; done

# "open" échoue parfois juste après un pkill (LaunchServices pas encore à
# jour : _LSOpenURLsWithCompletionHandler error -600) — quelques essais.
opened=0
for i in 1 2 3; do
  if open "$APP_DIR/Board.app"; then opened=1; break; fi
  sleep 0.5
done
[ "$opened" -eq 1 ] || { echo "open Board.app a échoué après 3 essais" >&2; exit 1; }

osascript "$MAIN_TESTS_DIR/support/ax.applescript" wait-for btn-add-project 10 >/dev/null

GREEN=$'\e[32m'
RED=$'\e[91m'
YELLOW=$'\e[33m'
WHITE=$'\e[37m'
GRAY=$'\e[90m'
RESET=$'\e[0m'

# === Sélection des specs à jouer ===
#
# Sans argument : specs/e2e/*.rb.
# Avec arguments : un ou plusieurs fichiers .rb et/ou dossiers (résolus tels
# quels, ou relatifs à Tests/ s'ils n'existent pas depuis le dossier courant),
# parcourus récursivement pour les dossiers.
#
# Marqueurs en tête de fichier (n'importe où dans le fichier) :
#   # @only  → si au moins une spec sélectionnée porte ce marqueur, SEULES
#             les specs @only tournent (les autres, même passées en argument,
#             sont ignorées).
#   # @skip  → la spec est toujours exclue, sauf si elle porte aussi @only.

# Motif shell (ex. "e2e/supp*") : à quoter en argument sinon le shell
# tentera de l'expandre lui-même depuis le dossier courant.

resolve_path() {
  if [ -e "$1" ]; then
    echo "$1"
  elif [ -e "$MAIN_TESTS_DIR/$1" ]; then
    echo "$MAIN_TESTS_DIR/$1"
  elif [ -e "$SPECS_DIR/$1" ]; then
    echo "$SPECS_DIR/$1"
  fi
}

ALL_SPECS=()
if [ "$#" -eq 0 ]; then
  for f in "$SPECS_DIR/e2e/*.rb"; do
    [ -e "$f" ] && ALL_SPECS+=("$f")
  done
else
  for arg in "$@"; do
    resolved="$(resolve_path "$arg")"
    if [ -n "$resolved" ]; then
      if [ -f "$resolved" ]; then
        ALL_SPECS+=("$resolved")
      elif [ -d "$resolved" ]; then
        while IFS= read -r f; do ALL_SPECS+=("$f"); done < <(find "$resolved" -name '*.rb' | sort)
      fi
      continue
    fi
    # pas un chemin littéral : traité comme motif, relatif à Tests/specs/
    matched=0
    while IFS= read -r f; do
      relf="${f#$SPECS_DIR/}"
      base="${f##*/}"
      if [[ "$relf" == $~arg || "$f" == $~arg || "$base" == $~arg ]]; then
        ALL_SPECS+=("$f")
        matched=1
      fi
    done < <(find "$SPECS_DIR" -name '*.rb' | sort)
    [ "$matched" -eq 0 ] && echo "${RED}Aucun test ne correspond à : $arg${RESET}" >&2
  done
fi

ONLY_SPECS=()
SPECS=()
for f in "${ALL_SPECS[@]}"; do
  if grep -q '@only' "$f"; then ONLY_SPECS+=("$f"); fi
done
if [ "${#ONLY_SPECS[@]}" -gt 0 ]; then
  SPECS=("${ONLY_SPECS[@]}")
else
  for f in "${ALL_SPECS[@]}"; do
    grep -q '@skip' "$f" || SPECS+=("$f")
  done
fi

TOTAL=0
NB_PASS=0
NB_FAIL=0
NB_PENDING=0
FAILURES=()

for spec in "${SPECS[@]}"; do
  [ -e "$spec" ] || continue
  rel_spec="${spec#$VTEST_DIR/}"
  echo "${GRAY}--- $rel_spec ---${RESET}"
  if output=$(ruby "$spec" 2>&1); then code=0; else code=$?; fi
  echo "$output"
  TOTAL=$((TOTAL + 1))
  case $code in
    0) NB_PASS=$((NB_PASS + 1)) ;;
    2) NB_PENDING=$((NB_PENDING + 1)) ;;
    *) NB_FAIL=$((NB_FAIL + 1)); FAILURES+=("$output") ;;
  esac
done

if [ "$NB_FAIL" -gt 0 ]; then MAIN_COLOR=$RED; else MAIN_COLOR=$GREEN; fi
if [ "$NB_PENDING" -gt 0 ]; then PENDING_COLOR=$YELLOW; else PENDING_COLOR=$MAIN_COLOR; fi

if [ "$NB_FAIL" -gt 0 ]; then
  echo ""
  echo "${RED}Échecs :${RESET}"
  for f in "${FAILURES[@]}"; do
    echo "$f"
  done
fi

echo ""
echo "${WHITE}-------------------${RESET}"
echo "${MAIN_COLOR}Success: ${NB_PASS}  Failures: ${NB_FAIL}  ${PENDING_COLOR}Pendings: ${NB_PENDING}${MAIN_COLOR}  Test count: ${TOTAL}${RESET}"

# quit + restauration se font automatiquement via le trap (teardown)
[ "$NB_FAIL" -eq 0 ]
