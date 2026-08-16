---
name: etat-fin-de-session-2026-08-15
description: Github PR Cycle (init/commit/submit) à traiter en priorité la prochaine session
metadata:
  type: project
---

## Github PR Cycle — à commencer en priorité la prochaine session

- 6 tests unitaires écrits pour la phase 'init' (`Tests/specs/unit/pr_cycle_init_*.rb`) — jamais encore lancés. Documentent 3 trous trouvés en lecture dans `backend/scripts/PR_Github_Cycle.rb` (`_project_is_clean_for_init_pr_cycle?` : deux branches `elsif` vides — status pas clean / pas sur main → aucune erreur renvoyée ; `git checkout -b` dont le résultat n'est jamais vérifié).
- Phase commit, item "rien à commiter" (`git add` sans fichier ajoute tout le dossier au lieu de rien) — bug confirmé, jamais corrigé (`Tests/specs/unit/pr_cycle_commit_rien_a_commiter.rb`, toujours rouge, jamais rejoué à cette session).
- Reste tout le cycle (init/commit/submit, 39 fichiers au total entre `Tests/specs/unit/pr_cycle_*.rb` et `Tests/specs/e2e/github_pr_cycle_*.rb`) à faire passer.
