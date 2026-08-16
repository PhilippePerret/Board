---
name: etat-fin-de-session-2026-08-16
description: Tests du Github PR Cycle et suite complète des tests à jouer
metadata:
  type: project
---

## Tests du Github PR Cycle — à traiter en priorité

- Tests unitaires phase 'init' à lancer (`Tests/specs/unit/pr_cycle_init_*.rb`, 6 fichiers). Points relevés en lecture de `backend/scripts/PR_Github_Cycle.rb`, à vérifier à l'exécution : deux branches `elsif` vides dans `_project_is_clean_for_init_pr_cycle?`, résultat de `git checkout -b` à vérifier.
- Test unitaire `Tests/specs/unit/pr_cycle_commit_rien_a_commiter.rb` à lancer : comportement de `git add` sans fichier à vérifier (ajoute tout le dossier au lieu de rien).
- Tests du Github PR Cycle (init/commit/submit, 39 fichiers entre `Tests/specs/unit/pr_cycle_*.rb` et `Tests/specs/e2e/github_pr_cycle_*.rb`) à jouer.

## Suite complète (144 tests) à jouer
