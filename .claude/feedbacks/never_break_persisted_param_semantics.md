---
name: feedback-never-break-persisted-param-semantics
description: params = persisté, dynParams = jamais persisté — ne jamais déplacer un param entre les deux sans demande explicite
metadata:
  type: feedback
---

Ne jamais déplacer un paramètre de `params` (persisté par projet) vers `dynParams` (redemandé à chaque exécution, jamais persisté) dans `frontend/js/ServiceData.js`, ou inversement — ni ajouter un mécanisme parallèle (`transient`, etc.) — sans demande explicite de Phil.

**Why:** Commit `c0b68647` (14 août, "Poursuite mise en place du Github PR Cycle", aucune trace d'échange dessus) a déplacé le param `code` de `open-iterm-at-folder` et `open-terminal-at-folder` de `params` vers `dynParams`, sans lien avec l'objet du commit. Résultat : la valeur "claude" (code à jouer à l'ouverture d'iTerm), pourtant bien enregistrée dans les fichiers projet, était redemandée à chaque clic sur le service — perte silencieuse de fonctionnalité découverte des semaines après, sur deux projets. Corrigé en remettant `code` dans `params`. [[feedback-never-unilateral-decisions]] [[feedback-no-app-code-without-request]]

**How to apply:** La règle de l'app est simple et fixe : `params` = valeur fixe définie une fois, réutilisée à chaque run, persistée dans le fichier projet. `dynParams` = valeur redemandée à chaque run, jamais persistée. Ne jamais reclassifier un paramètre existant de l'un vers l'autre en cours de route, même pour "améliorer" ou faire passer des tests — c'est un changement de comportement pour l'utilisateur final, pas un détail d'implémentation.
