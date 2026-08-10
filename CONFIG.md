# Configuration requise pour faire tourner Super Board

Audit du code (Swift, Ruby, AppleScript) pour établir ce qui est indispensable pour que Board fonctionne sur une autre machine, et ce qui est seulement nécessaire pour tel ou tel service optionnel.

## 1. Obligatoire (sans ça, l'app ne démarre/ne fonctionne pas du tout)

- **Xcode Command Line Tools** — fournit `swiftc` (compilation, `build.sh`) et `git`.
- **macOS 12.0 minimum** (`Info.plist`), fonctionnalités complètes (inspecteur WebKit) à partir de 13.3.
- **rbenv + Ruby exactement en version 3.4.7**, installé à `~/.rbenv/versions/3.4.7/bin/ruby`. Le chemin est en dur dans `Sources/Board/Backend.swift:13` (basé sur `$HOME` de l'utilisateur, donc pas un chemin personnel figé, mais la VERSION 3.4.7 l'est) : si ce Ruby précis n'existe pas à cet endroit exact, **chaque action de l'app échoue** (un process Ruby est relancé à chaque échange frontend/backend). Pas de Ruby système, pas de rvm/asdf, pas de Homebrew ruby — rbenv uniquement, cette version précise.
- Pas de `bundle install` nécessaire : tous les `require` du backend sont des libs standard Ruby (json, yaml, fileutils, timeout...).
- **3 autorisations macOS**, à accorder manuellement (aucun moyen de les accorder par le code) :
  1. **Accessibilité** (Réglages Système → Confidentialité et sécurité → Accessibilité → cocher Board) — nécessaire pour l'outil "Position et taille de fenêtre".
  2. **Automatisation**, par appli ciblée (Finder, Terminal, Safari, iTerm, Board lui-même) — une popup système la première fois que chaque script AppleScript contrôle chacune de ces applis.
  3. **Notifications** — popup au premier lancement, pour les alertes du minuteur.
- Les dossiers/fichiers de données (`~/Library/Application Support/Board/...`) sont **créés automatiquement** au premier lancement — rien à préparer à la main.

## 2. Optionnel (seulement si l'utilisateur attache/utilise le service correspondant)

| Dépendance | Nécessaire pour | Remarque |
|---|---|---|
| `gh` (GitHub CLI) + `gh auth login` | services "issue Git" (créer/lister/labelliser des issues) | auth à faire manuellement hors app |
| Clé SSH GitHub + dépôt distant déjà créé | outil "Initialiser Git" (Tools.js) | le script ne crée pas le dépôt distant lui-même |
| VS Code + commande `code` installée | service "Ouvrir dans VS Code" | ⚠️ voir bug ci-dessous |
| iTerm2 | service "Ouvrir iTerm au dossier" | app tierce, pas incluse dans macOS |
| AsciiDoctor | service "Actualiser la documentation" | ⚠️ voir bug ci-dessous |
| Compte + jeton API Todoist | projets liés à Todoist | app 100% utilisable sans, jeton demandé à la volée si besoin |
| Python 3 | seulement si un script perso `.py` est configuré | |

## 3. Bugs de portabilité trouvés (corrigés)

Deux scripts appelaient un outil par un **chemin Homebrew Apple Silicon codé en dur**, qui cassait sur Intel (chemin Homebrew différent) ou toute install hors Homebrew — corrigé en utilisant le nom de commande seul (le PATH correct est déjà mis en cache et propagé à ces process, cf. `usefull.rb#load_real_user_path!`) :

- `backend/scripts/OpenInVscode.sh:3` — `/opt/homebrew/bin/code` → `code`
- `backend/scripts/UpdateDocumentation.rb:9` — `/opt/homebrew/bin/asciidoctor` → `asciidoctor`

Deux traces mineures, sans impact :
- `backend/scripts/OpenItermAtFolder.scpt` : une ligne commentée avec un chemin perso (`/Users/philippeperret/Programmes`), jamais exécutée.
- `update.command` (script de dev perso, pas utilisé par `build.sh`) cible un menu Safari nommé d'après la machine de Phil ("Mac mini de Philippe") — sans effet sur l'installation, juste inopérant tel quel sur une autre machine.
