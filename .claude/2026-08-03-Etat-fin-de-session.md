---
name: 2026-08-03-etat-fin-de-session
description: Test git-init en cours de mise au point, résultat non connu à la coupure
metadata:
  type: project
---

# À reprendre en premier demain

Service commun 'git-init' (`ServiceData.js` + `backend/scripts/GitInit.rb`) :

- Test : `Tests/specs/e2e/service_commun_git_init.rb`.
- Stub : `Tests/support/git_e2e_stub.rb` (dépôt bare local au lieu de
  github.com — `BOARD_TEST_GIT_REMOTE` + verrou `APP_BOARD_TESTS_RUNNING`
  posé par `run_tests.sh`, propagés dans `helpers_base.rb#launch_app`).
- Dernière action avant la coupure : commande recopiée
  (`./scripts/run-tests service_commun_git_init.rb`), Phil devait la
  relancer — RÉSULTAT INCONNU. Première chose à vérifier demain : lire le
  dernier log dans `Tests/resultats/`.
