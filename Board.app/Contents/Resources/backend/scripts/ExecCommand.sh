set -Ee
trap 'echo "Erreur à la ligne $LINENO (code=$?)"' ERR

command="$1"

$command