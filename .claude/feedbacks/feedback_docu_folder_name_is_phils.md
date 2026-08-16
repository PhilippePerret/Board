---
name: docu-folder-name-is-phils
description: le redesign du select docu_folder_name dans init-documentation (ServiceData.js) est la partie de Phil, ne pas l'implémenter
metadata:
  type: feedback
---

Le redesign de la logique de param du service `init-documentation` dans `frontend/js/ServiceData.js` (remplacer l'ancien default app-wide `docu-folder-name` par un choix `SelectDiag` à chaque run, ex. "Manuel" vs "Documentation", avec `create: true` pour une valeur libre) est une partie que Phil veut écrire lui-même — il m'a arrêté en plein edit avec "passe cette partie, elle est pour moi."

**Why:** pas d'explication donnée au-delà de ça — à traiter comme un signal général : quand un fix touche un bout de logique métier précis pour lequel il a déjà une idée/design, même après en avoir discuté ensemble, il peut vouloir l'écrire lui-même.

**How to apply:** si ça revient (docu_folder_name, ou une formulation similaire "laisse-moi faire cette partie"), ne pas implémenter — s'arrêter et le laisser faire. Le fix général autour ([[appgetdata-default-fallback]] — fallback default de App.getData, suppression du code mort AppData.js) était OK à faire et reste appliqué.
