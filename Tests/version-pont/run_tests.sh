#!/bin/zsh

# Suite de tests d'intégration de Board — moteur "pont" (canal direct vers
# le JS de la WKWebView, Sources/Board/TestBridge.swift, via un socket Unix —
# aucun passage par l'accessibilité/System Events). Seul moteur restant
# (les autres, basés sur l'accessibilité, ont été retirés — benchmarkés
# plus lents).
#
# Particularité : contrairement aux autres moteurs, le binaire Board lui-même
# (pas seulement frontend/backend) doit être recompilé si Sources/Board/*.swift
# a changé, puisque TestBridge.swift est embarqué dedans. Et l'app doit être
# lancée avec la variable BOARD_TEST_BRIDGE_SOCKET dans SON PROPRE
# environnement (pas seulement celui du process ruby) : "open" ne propage pas
# l'environnement du shell appelant à l'app lancée, d'où "open --env ...".
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

# Verrou générique "des tests tournent" — deuxième condition (en plus d'une
# variable ciblée type BOARD_TEST_GIT_REMOTE) avant qu'un script backend
# n'accepte de dévier d'un comportement réel (ex. GitInit.rb) : une variable
# ciblée oubliée dans un shell ne suffit pas seule à détourner un run réel.
export APP_BOARD_TESTS_RUNNING=1

BOARD_DIR="$HOME/Library/Application Support/Board"

# Si Board tournait déjà (lancé à la main par l'utilisateur) avant la suite,
# on le relance en fin de suite pour le remettre tel qu'il était.
BOARD_WAS_RUNNING=0
pgrep -x Board >/dev/null 2>&1 && BOARD_WAS_RUNNING=1

# --no-overlay : saute la fenêtre plein écran "TESTS EN COURS…"
# (utile pour observer/piloter Board pendant qu'une spec tourne).
NO_OVERLAY=0
for a in "$@"; do
  [ "$a" = "--no-overlay" ] && NO_OVERLAY=1
done

# VTEST_DIR = Dossier de la version de test (base, améliorée, etc.)
VTEST_DIR="$(cd "$(dirname "$0")" && pwd)"
# Dossier principal des tests de l'application
MAIN_TESTS_DIR="$(dirname "$VTEST_DIR")"
# Dossier contenant les tests eux-mêmes
SPECS_DIR="$MAIN_TESTS_DIR/specs"
APP_DIR="$(dirname "$MAIN_TESTS_DIR")"

# Sortie double : couleur sur l'écran (inchangée), texte brut (codes ANSI
# retirés) dans un fichier sous tests/resultats/ à la racine du dépôt.
TEST_VERSION="$(basename "$VTEST_DIR" | sed 's/^version-//')"
RESULTS_DIR="$APP_DIR/tests/resultats"
mkdir -p "$RESULTS_DIR"
# Purge des logs de plus de 5 jours
find "$RESULTS_DIR" -maxdepth 1 -name "*.log" -mtime +5 -delete
RESULT_FILE="$RESULTS_DIR/$(date +%Y-%m-%d_%Hh%M).log"
{
  echo "Moteur : $TEST_VERSION"
  echo "Arguments : ${*:-(aucun — specs/e2e/*.rb)}"
  echo "Date : $(date '+%Y-%m-%d %Hh%M')"
  echo ""
} > "$RESULT_FILE"
exec > >(tee >(sed -E $'s/\x1b\\[[0-9;]*m//g' >> "$RESULT_FILE")) 2>&1

# Ids des fenêtres Finder déjà ouvertes AVANT toute action de la suite — on
# n'y touche JAMAIS ; en teardown, on ferme uniquement les fenêtres dont l'id
# n'est pas dans cette liste (celles ouvertes par les tests, y compris celles
# qu'un test en échec aurait laissées traîner).
INITIAL_FINDER_WINDOW_IDS=$(osascript "$MAIN_TESTS_DIR/support/finder.applescript" window-ids 2>/dev/null | tr '\n' ',' | sed 's/,$//' || true)

mkdir -p "$MAIN_TESTS_DIR/.board-backups"

if [ "$NO_OVERLAY" -eq 0 ]; then
  # Fenêtre plein écran, sans titre ni bouton, pendant toute la suite
  # (Tests/support/overlay.swift, compilé une fois) : pilotée par une FIFO,
  # jamais de focus clavier/souris volé.
  OVERLAY_SWIFT_SOURCE="$MAIN_TESTS_DIR/support/overlay.swift"
  OVERLAY_BIN="$MAIN_TESTS_DIR/support/overlay"
  if [ ! -e "$OVERLAY_BIN" ] || [ "$OVERLAY_SWIFT_SOURCE" -nt "$OVERLAY_BIN" ]; then
    swiftc "$OVERLAY_SWIFT_SOURCE" -framework Cocoa -o "$OVERLAY_BIN"
  fi
  OVERLAY_FIFO=$(mktemp -u "$MAIN_TESTS_DIR/.board-backups/overlay-fifo.XXXXXX")
  mkfifo "$OVERLAY_FIFO"
  "$OVERLAY_BIN" < "$OVERLAY_FIFO" &
  OVERLAY_PID=$!
  exec 3>"$OVERLAY_FIFO"
  echo "SET TESTS EN COURS…" >&3
fi

BACKUPS_ROOT="$MAIN_TESTS_DIR/.board-backups"
mkdir -p "$BACKUPS_ROOT"
BACKUP_DIR=$(mktemp -d "$BACKUPS_ROOT/board-test-backup.XXXXXX")
BOARD_EXISTED=0

# Copie CONSERVÉE (pas déplacée, pas transitoire) de la config perso avant
# toute manipulation — garde-fou indépendant de restore_board/du trap, qui
# ne protège pas contre une interruption brutale (kill -9, terminal fermé de
# force) : ÇA, rien ne peut l'intercepter côté script, donc il faut une copie
# qui survit même dans ce cas. Garde les 20 dernières.
PERSO_BACKUPS_DIR="$BACKUPS_ROOT/persos"
mkdir -p "$PERSO_BACKUPS_DIR"

# Détecte une pollution par des données de test (id contenant "fixture")
# dans ce qu'on croit être la config perso — signe qu'un run précédent a
# déjà mal restauré. Sauvegarder ÇA comme "config perso" écraserait la
# dernière copie propre encore disponible dans l'historique des 20 gardées.
board_dir_has_fixture_pollution() {
  [ -d "$BOARD_DIR" ] || return 1
  grep -rl "fixture" "$BOARD_DIR" >/dev/null 2>&1
}

preserve_personal_config() {
  if [ ! -d "$BOARD_DIR" ]; then return; fi
  if board_dir_has_fixture_pollution; then
    echo "ERREUR : \"$BOARD_DIR\" contient des traces de données de test (id \"fixture\") — ce n'est probablement pas ta vraie config, mais un reste d'un run précédent mal restauré." >&2
    echo "Sauvegarde ANNULÉE pour ne pas écraser la dernière copie propre. Vérifie \"$BOARD_DIR\" et \"$PERSO_BACKUPS_DIR\" à la main avant de relancer les tests." >&2
    exit 1
  fi
  local stamp
  stamp=$(date +%Y%m%d-%H%M%S)
  cp -R "$BOARD_DIR" "$PERSO_BACKUPS_DIR/perso-$stamp"
  # Garde seulement les 20 copies les plus récentes.
  ls -1dt "$PERSO_BACKUPS_DIR"/perso-* 2>/dev/null | tail -n +21 | while IFS= read -r old; do
    rm -rf "$old"
  done
}

backup_board() {
  preserve_personal_config
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

# Recompile le binaire Board (pas juste frontend/backend) si Sources/Board a
# changé depuis le dernier build — TestBridge.swift est embarqué dedans.
NEEDS_REBUILD=0
BOARD_BIN="$APP_DIR/Board.app/Contents/MacOS/Board"
if [ ! -e "$BOARD_BIN" ]; then
  NEEDS_REBUILD=1
else
  for f in "$APP_DIR"/Sources/Board/*.swift; do
    if [ "$f" -nt "$BOARD_BIN" ]; then NEEDS_REBUILD=1; fi
  done
fi
if [ "$NEEDS_REBUILD" -eq 1 ]; then
  echo "Recompilation de Board (Sources/Board a changé)…"
  swiftc "$APP_DIR"/Sources/Board/*.swift -framework Cocoa -framework WebKit -framework Network -o "$APP_DIR/Board"
  cp "$APP_DIR/Board" "$BOARD_BIN"
fi

BOARD_TEST_BRIDGE_SOCKET="$BACKUPS_ROOT/bridge-$$.sock"

# Dossier de données dédié aux tests (cf. backend/lib/usefull.rb#DATA_SUPPORT_FOLDER) :
# en plus du backup/restore de $BOARD_DIR ci-dessus, garantit qu'aucune
# écriture ne touche JAMAIS le vrai dossier, y compris si le process est tué
# par kill -9 (non couvert par le trap teardown, cf. commentaire plus haut).
BOARD_TEST_DATA_DIR="$BACKUPS_ROOT/data-$$"
mkdir -p "$BOARD_TEST_DATA_DIR"

quit_app() {
  pkill -x Board 2>/dev/null || true
}

teardown() {
  quit_app
  restore_board
  rm -rf "$BOARD_TEST_DATA_DIR" 2>/dev/null || true
  finder_cleanup=$(osascript "$MAIN_TESTS_DIR/support/finder.applescript" close-windows-except "$INITIAL_FINDER_WINDOW_IDS" 2>&1) || true
  if [ -n "$finder_cleanup" ] && [ "$finder_cleanup" != "ok" ]; then
    echo "Nettoyage fenêtres Finder : $finder_cleanup"
  fi
  if [ "$BOARD_WAS_RUNNING" -eq 1 ]; then
    open "$APP_DIR/Board.app"
  fi
  if [ "$NO_OVERLAY" -eq 0 ]; then
    echo "SET MERCI." >&3 2>/dev/null || true
    sleep 2
    echo "QUIT" >&3 2>/dev/null || true
    exec 3>&- 2>/dev/null || true
    kill "$OVERLAY_PID" 2>/dev/null || true
    rm -f "$OVERLAY_FIFO" 2>/dev/null || true
  fi
  rm -f "$BOARD_TEST_BRIDGE_SOCKET" 2>/dev/null || true
}

# HUP/QUIT en plus d'EXIT/INT/TERM : couvre fermeture de terminal et Ctrl-\.
# Limite réelle, pas contournable par un script : un "kill -9" (SIGKILL) ne
# peut être intercepté par AUCUN process, quoi qu'on fasse ici — c'est
# justement pour ce cas que preserve_personal_config() existe (copie
# conservée AVANT tout déplacement, indépendante de ce trap).
trap teardown EXIT INT TERM HUP QUIT

backup_board

cp -R "$APP_DIR/frontend/"* "$APP_DIR/Board.app/Contents/Resources/frontend/"
cp -R "$APP_DIR/backend/"* "$APP_DIR/Board.app/Contents/Resources/backend/"

quit_app
until ! pgrep -x Board >/dev/null 2>&1; do sleep 0.1; done

# "open" échoue parfois juste après un pkill (LaunchServices pas encore à
# jour : _LSOpenURLsWithCompletionHandler error -600) — quelques essais.
# "--env" : "open" ne transmet PAS l'environnement du shell appelant à l'app
# lancée (contrairement à un exec direct) — sans ce flag, TestBridge.swift ne
# verrait jamais BOARD_TEST_BRIDGE_SOCKET et resterait inactif.
opened=0
for i in 1 2 3; do
  if open --env BOARD_TEST_BRIDGE_SOCKET="$BOARD_TEST_BRIDGE_SOCKET" --env BOARD_TEST_DATA_DIR="$BOARD_TEST_DATA_DIR" "$APP_DIR/Board.app"; then opened=1; break; fi
  sleep 0.5
done
[ "$opened" -eq 1 ] || { echo "open Board.app a échoué après 3 essais" >&2; exit 1; }

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
#   # @long  → exclue par défaut (spec lente, ex. attente réelle > quelques
#             secondes) ; incluse si l'option --long est passée, ou si la
#             spec porte aussi @only.
#
# --long (n'importe où parmi les arguments) : inclut aussi les specs @long.

# Motif shell (ex. "e2e/supp*") : à quoter en argument sinon le shell
# tentera de l'expandre lui-même depuis le dossier courant.

LONG_MODE=0
ARGS=()
for a in "$@"; do
  if [ "$a" = "--long" ]; then
    LONG_MODE=1
  elif [ "$a" = "--no-overlay" ]; then
    :
  else
    ARGS+=("$a")
  fi
done
set -- "${ARGS[@]}"

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
    grep -q '@skip' "$f" && continue
    [ "$LONG_MODE" -eq 0 ] && grep -q '@long' "$f" && continue
    SPECS+=("$f")
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
  # Nettoyage AVANT (pas APRÈS) : vidé et recréé pour chaque test, plutôt
  # que de compter sur le remove_fixture_project de chaque spec — un test
  # ne doit jamais pouvoir hériter d'un résidu d'un test précédent.
  rm -rf "$BOARD_TEST_DATA_DIR"
  mkdir -p "$BOARD_TEST_DATA_DIR"
  # create_fixture_project (helpers_base.rb) lit/réécrit appdata.yaml AVANT
  # tout launch_app — certaines specs l'appellent avant de relancer Board :
  # le fichier doit donc déjà exister, pas seulement après le 1er lancement.
  printf 'projects-in: []\nprojects-out: []\n' > "$BOARD_TEST_DATA_DIR/appdata.yaml"
  t_start=$(date +%s.%N)
  if output=$(BOARD_TEST_ENGINE=pont BOARD_TEST_BRIDGE_SOCKET="$BOARD_TEST_BRIDGE_SOCKET" BOARD_TEST_DATA_DIR="$BOARD_TEST_DATA_DIR" ruby "$spec" 2>&1); then code=0; else code=$?; fi
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
echo "${WHITE}Durée totale (moteur : pont) : ${TOTAL_DUR}s${RESET}"

# quit + restauration se font automatiquement via le trap (teardown)
[ "$NB_FAIL" -eq 0 ]
