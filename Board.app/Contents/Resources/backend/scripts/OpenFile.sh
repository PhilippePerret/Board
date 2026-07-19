path="$1"
logiciel="$2"

if [ "$logiciel" = "none" ]; then
  /usr/bin/open "$path"
else
  /usr/bin/open -a "$logiciel" "$path"
fi
