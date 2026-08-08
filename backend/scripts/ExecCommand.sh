cmd="$*"

# --- Charger le vrai PATH de l'utilisateur ---
#
# Ce script est lancé par Board.app -> ruby -> zsh, un process GUI qui
# n'hérite PAS du PATH d'un shell de login (pas de .zshrc/.zprofile
# sourcé). Sans ça, des commandes installées via Homebrew (ex. gh) sont
# introuvables même si elles marchent très bien dans un Terminal.
#
# On récupère le PATH réel en interrogeant le shell de login de
# l'utilisateur ($SHELL -ilc), mais ça coûte cher (source tous les
# fichiers rc, ~100-300ms) : on met donc le résultat en cache, invalidé
# automatiquement si un fichier rc a été modifié depuis (comparaison de
# mtime, quasi gratuite). Sur cache valide, le coût retombe à quelques
# stat + un cat.
cache_dir="$HOME/Library/Application Support/Board"
cache_file="$cache_dir/user_path.cache"
rc_files=(
  "$HOME/.zshenv"
  "$HOME/.zprofile"
  "$HOME/.zshrc"
  "$HOME/.bash_profile"
  "$HOME/.bashrc"
)

mkdir -p "$cache_dir" 2>/dev/null

need_refresh=1
if [ -f "$cache_file" ]; then
  need_refresh=0
  cache_mtime=$(stat -f %m "$cache_file" 2>/dev/null || echo 0)
  for rc in "${rc_files[@]}"; do
    if [ -f "$rc" ]; then
      rc_mtime=$(stat -f %m "$rc" 2>/dev/null || echo 0)
      if [ "$rc_mtime" -gt "$cache_mtime" ]; then
        need_refresh=1
        break
      fi
    fi
  done
fi

if [ "$need_refresh" -eq 1 ]; then
  user_path="$($SHELL -ilc 'echo -n $PATH' 2>/dev/null)"
  if [ -n "$user_path" ]; then
    printf '%s' "$user_path" > "$cache_file"
  fi
else
  user_path="$(cat "$cache_file")"
fi

if [ -n "$user_path" ]; then
  export PATH="$user_path"
fi

# Échappe une chaîne pour l'insérer telle quelle dans une valeur JSON
# (le script exécuté peut sortir n'importe quoi — une URL, du texte
# libre — jamais du JSON, donc on l'encapsule nous-mêmes ci-dessous
# plutôt que de le renvoyer brut : exec_script.rb fait un JSON.parse
# sur notre stdout).
json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\r'/\\r}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# --- Jouer la commande ---
err_file="$(mktemp)"
pwd_file="$(mktemp)"
trap 'rm -f "$err_file" "$pwd_file"' EXIT

# pwd écrit APRÈS la commande, dans le même sous-shell (celui de la
# substitution $(...)) : reflète le dossier réel une fois le "cd" fait,
# que la commande elle-même réussisse ou non. "exit $ec" propage le vrai
# code de sortie de $cmd vers l'extérieur (sinon "code" recevrait celui
# de "pwd", toujours 0).
out="$(eval "$cmd" 2> "$err_file"; ec=$?; pwd > "$pwd_file"; exit $ec)"
code=$?

if [ $code -eq 0 ]; then
  printf '{"ok": true, "message": "%s"}' "$(json_escape "$out")"
  exit 0
fi

err="$(cat "$err_file")"

# On cherche si l'échec vient d'une commande introuvable (format zsh :
# "(eval):1: command not found: xxx"), peu importe où elle est dans la
# chaîne (ex. après un `&&`). Avec le vrai PATH déjà chargé ci-dessus,
# ce cas signifie que la commande n'est vraiment pas installée.
missing="$(printf '%s\n' "$err" | sed -nE 's/^.*command not found: ([^ ]+).*/\1/p' | tail -1)"

if [ -n "$missing" ]; then
  printf '{"ok": false, "error": ["backend-command-not-found", "%s"]}' "$(json_escape "$missing")"
  exit 0
fi

# gh (et git, via gh) échoue avec ce message précis quand le dossier
# courant n'est pas/plus un dépôt git — cas fréquent des services
# create-git-issue/gh-issue-create/git-issue-list (ServiceData.js).
if printf '%s\n' "$err" | grep -q 'not a git repository'; then
  printf '{"ok": false, "error": ["backend-not-a-git-repo", "%s"]}' "$(json_escape "$(cat "$pwd_file")")"
  exit 0
fi

# Échec pour une autre raison : on relaie l'erreur telle quelle.
printf '{"ok": false, "error": "%s"}' "$(json_escape "$err")"
exit 0
