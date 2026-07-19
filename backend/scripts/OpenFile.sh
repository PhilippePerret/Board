path="$1"
logiciel="$2"

if [ "$logiciel" = "none" ]; then
  open "$path"
else
  open -a "$logiciel" "$path"
fi
