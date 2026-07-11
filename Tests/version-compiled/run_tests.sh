#!/bin/zsh

# Suite de tests d'intégration de Board — moteur "compiled" (même
# ax.applescript que le moteur base, mais précompilé une fois via osacompile
# en support/ax.scpt : élimine le coût de parsing/compilation AppleScript à
# chaque appel osascript, sans changer le nombre d'appels ni leur contenu).
#
# - sauvegarde ~/Library/Application Support/Board avant la suite
# - restaure ce dossier tel quel (présent ou absent) après la suite,
#   même en cas d'erreur ou d'interruption (Ctrl-C)
#
# La sauvegarde va dans Tests/.board-backups/ (dans le dépôt, visible par
# "git status"), PAS dans un dossier temporaire système ($TMPDIR) : ce
# dernier peut être nettoyé par macOS avant restauration — ce qui a déjà
# causé une perte réelle de données.

set -e

BOARD_DIR="$HOME/Library/Application Support/Board"

# VTEST_DIR = Dossier de la version de test (base, améliorée, etc.)
VTEST_DIR="$(cd "$(dirname "$0")" && pwd)"
# Dossier principal des tests de l'application
MAIN_TESTS_DIR="$(dirname "$VTEST_DIR")"
# Dossier contenant les tests eux-mêmes
SPECS_DIR="$MAIN_TESTS_DIR/specs"
APP_DIR="$(dirname "$MAIN_TESTS_DIR")"

# Snapshot de toutes les fenêtres Finder ouvertes AVANT toute action de la
# suite (dossier, position, sélection) : restauré à l'identique en teardown,
# quel que soit ce que les tests ont ouvert/fermé entre-temps.
FINDER_SNAPSHOT=$(osascript "$MAIN_TESTS_DIR/support/finder.applescript" snapshot-windows 2>/dev/null || true)
osascript "$MAIN_TESTS_DIR/support/finder.applescript" close-all-windows >/dev/null 2>&1 || true

# Fenêtre plein écran, sans titre ni bouton, pendant toute la suite
# (Tests/support/overlay.swift, compilé une fois) : pilotée par une FIFO,
# jamais de focus clavier/souris volé (les clics AX des tests ne passent pas
# par de vrais événements souris, donc rien à perturber).
OVERLAY_SWIFT_SOURCE="$MAIN_TESTS_DIR/support/overlay.swift"
OVERLAY_BIN="$MAIN_TESTS_DIR/support/overlay"
if [ ! -e "$OVERLAY_BIN" ] || [ "$OVERLAY_SWIFT_SOURCE" -nt "$OVERLAY_BIN" ]; then
  swiftc "$OVERLAY_SWIFT_SOURCE" -framework Cocoa -o "$OVERLAY_BIN"
fi
mkdir -p "$MAIN_TESTS_DIR/.board-backups"
OVERLAY_FIFO=$(mktemp -u "$MAIN_TESTS_DIR/.board-backups/overlay-fifo.XXXXXX")
mkfifo "$OVERLAY_FIFO"
"$OVERLAY_BIN" < "$OVERLAY_FIFO" &
OVERLAY_PID=$!
exec 3>"$OVERLAY_FIFO"
echo "SET TESTS BOARD EN COURS. NE RIEN TOUCHER." >&3

BACKUPS_ROOT="$MAIN_TESTS_DIR/.board-backups"
mkdir -p "$BACKUPS_ROOT"
BACKUP_DIR=$(mktemp -d "$BACKUPS_ROOT/board-test-backup.XXXXXX")
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
  # rmdir (pas rm -rf) : ne supprime que si vide, donc seulement si le mv
  # ci-dessus a réussi. Avant, la sauvegarde était effacée même en cas
  # d'échec du mv.
  rmdir "$BACKUP_DIR" 2>/dev/null || true
}

# Recompile uniquement si absent ou si la source a changé depuis.
AX_SOURCE="$MAIN_TESTS_DIR/support/ax.applescript"
AX_COMPILED="$VTEST_DIR/support/ax.scpt"
if [ ! -e "$AX_COMPILED" ] || [ "$AX_SOURCE" -nt "$AX_COMPILED" ]; then
  osacompile -o "$AX_COMPILED" "$AX_SOURCE"
fi
export BOARD_TEST_AX_SCRIPT="$AX_COMPILED"

quit_app() {
  pkill -x Board 2>/dev/null || true
}

teardown() {
  quit_app
  restore_board
  osascript "$MAIN_TESTS_DIR/support/finder.applescript" restore-windows "$FINDER_SNAPSHOT" >/dev/null 2>&1 || true
  echo "SET MERCI." >&3 2>/dev/null || true
  sleep 2
  echo "QUIT" >&3 2>/dev/null || true
  exec 3>&- 2>/dev/null || true
  kill "$OVERLAY_PID" 2>/dev/null || true
  rm -f "$OVERLAY_FIFO" 2>/dev/null || true
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

osascript "$AX_COMPILED" wait-for btn-add-project 10 >/dev/null

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
  for f in "$SPECS_DIR"/e2e/*.rb; do
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
TOTAL_DUR=0

for spec in "${SPECS[@]}"; do
  [ -e "$spec" ] || continue
  rel_spec="${spec#$VTEST_DIR/}"
  echo "${GRAY}--- $rel_spec ---${RESET}"
  t_start=$(date +%s.%N)
  if output=$(ruby "$spec" 2>&1); then code=0; else code=$?; fi
  t_end=$(date +%s.%N)
  spec_dur=$(awk -v a="$t_start" -v b="$t_end" 'BEGIN{printf "%.3f", b-a}')
  TOTAL_DUR=$(awk -v t="$TOTAL_DUR" -v d="$spec_dur" 'BEGIN{printf "%.3f", t+d}')
  echo "$output"
  echo "${GRAY}  (durée totale de la spec : ${spec_dur}s)${RESET}"
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
  i=0
  for f in "${FAILURES[@]}"; do
    i=$((i + 1))
    echo "$f" | sed "s/✗/${i}./"
  done
fi

echo ""
echo "${WHITE}-------------------${RESET}"
echo "${MAIN_COLOR}Success: ${NB_PASS}  Failures: ${NB_FAIL}  ${PENDING_COLOR}Pendings: ${NB_PENDING}${MAIN_COLOR}  Test count: ${TOTAL}${RESET}"
echo "${WHITE}Durée totale (moteur : compiled) : ${TOTAL_DUR}s${RESET}"

# quit + restauration se font automatiquement via le trap (teardown)
[ "$NB_FAIL" -eq 0 ]
