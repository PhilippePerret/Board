path="$1"
logiciel="$2"

if [ ! -e "$path" ]; then
  echo "{\"ok\": false, \"error\": \"Le fichier $path est introuvable. Merci d'éditer le service.\"}"
  exit 0
fi

if [ "$logiciel" = "none" ]; then
  /usr/bin/open "$path"
else
  /usr/bin/open -a "$logiciel" "$path"
fi
