---
name: unverified-claim-is-a-lie
description: toute affirmation non vérifiée présentée comme un fait est un mensonge pour Phil, peu importe l'intention
metadata:
  type: feedback
---

Ne jamais ajouter un détail narratif plausible mais non vérifié à une explication (ex. "cette règle existait déjà avant" sans avoir vérifié `git log`/`git blame`). Si ce n'est pas vérifié, soit le vérifier avant de l'écrire, soit ne pas l'écrire du tout.

**Why:** dit après avoir affirmé qu'une règle CSS "existait déjà avant" une fonctionnalité, sans l'avoir vérifiée — `git log -p` a montré que c'était faux (ajoutée dans le même commit). Pour Phil, peu importe l'intention (invention pour "sonner plausible" vs mensonge délibéré) : une affirmation fausse présentée comme fait = un mensonge, point.

**How to apply:** avant d'écrire une affirmation factuelle sur l'historique/l'état du code ("ça existait déjà", "ça n'a jamais été le cas", "c'est nouveau"), la vérifier (`git log`, `git blame`, lecture du fichier) — jamais l'déduire/l'inventer pour compléter une explication, même si le cœur du diagnostic est correct par ailleurs.
