#!/bin/zsh

# Lance un test donné sur chaque moteur (swift, pont), dans l'ordre, et
# affiche un tableau récapitulatif des durées totales + résultats à la fin.
#
# base/batch/compiled/pers retirés (2026-07-11) : benchmarkés, nettement plus
# lents, gardés seulement le temps de la comparaison.
#
# Usage :
#   ./benchmark.sh e2e/modification_titre_projet.rb   → ce test, sur les 2 moteurs
#   ./benchmark.sh --all                               → suite complète, sur les 2 moteurs
#   ./benchmark.sh --all "e2e/dep*"                    → motif de specs, sur les 2 moteurs

set -e

CUR_DIR="$(cd "$(dirname "$0")" && pwd)"
ENGINES=(swift pont)

GREEN=$'\e[32m'
RED=$'\e[91m'
WHITE=$'\e[37m'
RESET=$'\e[0m'

ALL=0
ARGS=()
for a in "$@"; do
  if [ "$a" = "--all" ]; then
    ALL=1
  else
    ARGS+=("$a")
  fi
done

if [ "$ALL" -eq 0 ] && [ "${#ARGS[@]}" -eq 0 ]; then
  echo "Précise un test à comparer (ex: ./benchmark.sh e2e/modification_titre_projet.rb)," >&2
  echo "ou --all pour lancer la suite complète sur chaque moteur." >&2
  exit 1
fi

RESULTS=()

for engine in "${ENGINES[@]}"; do
  echo ""
  echo "${WHITE}=== Moteur : ${engine} ===${RESET}"
  if output=$("$CUR_DIR/run-tests" -v "$engine" "${ARGS[@]}" 2>&1); then code=0; else code=$?; fi
  echo "$output"
  summary_line=$(echo "$output" | grep "Success:" | tail -1)
  duration_line=$(echo "$output" | grep "Durée totale" | tail -1)
  # Les codes couleur ANSI restent dans les lignes captées (via GREEN/RED
  # $'...' du run_tests.sh) : on les enlève pour le tableau final, plus lisible.
  clean_summary=$(echo "$summary_line" | sed 's/\x1b\[[0-9;]*m//g')
  clean_duration=$(echo "$duration_line" | sed 's/\x1b\[[0-9;]*m//g')
  RESULTS+=("${engine}|${clean_duration}|${clean_summary}")
done

echo ""
echo "${WHITE}=========== Récapitulatif ===========${RESET}"
for r in "${RESULTS[@]}"; do
  engine="${r%%|*}"
  rest="${r#*|}"
  duration="${rest%%|*}"
  summary="${rest#*|}"
  echo "${WHITE}${engine}${RESET} — ${duration} — ${summary}"
done
