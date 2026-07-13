set -Ee
trap 'echo "Erreur à la ligne $LINENO (code=$?)"' ERR


eval "$*"