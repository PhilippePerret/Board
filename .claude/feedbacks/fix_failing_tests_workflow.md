---
name: fix-failing-tests-workflow
description: workflow imposé pour corriger une liste de tests en échec — un test à la fois, cycle fixe
metadata:
  type: feedback
---

Pour corriger une liste de tests en échec, un test à la fois, toujours le même cycle :

1. pbcopy la commande de lancement du test (UNE SEULE FOIS) (voir [[clipboard-test-command]] / [[running-tests]]).
2. Phil lance et confirme que le test échoue bien (ne jamais présumer l'échec sans confirmation).
3. Je cherche le problème.
4. Si je ne trouve pas, c'est Phil qui trouve — ne pas boucler indéfiniment seul.
5. Je corrige.
6. On fait repasser le test pour confirmer qu'il passe.
7. Passage au test suivant, même cycle.

**Why:** demandé le 2026-08-06 pour la correction des 15 tests en échec du run du 05/08 — évite de corriger plusieurs tests à l'aveugle sans validation intermédiaire.

**How to apply:** dès qu'il y a une liste de tests en échec à corriger, appliquer ce cycle strictement, un test à la fois, jamais de correction groupée non vérifiée.

**Ne jamais repasser la même commande dans le presse-papier :** une fois la commande d'un test donnée (étape 1) une première fois, ne plus la repbcopier pour ce même test — même après une correction (étape 5→6), juste demander de relancer, la commande est déjà dans le presse-papier et inchangée. Dit le 2026-08-06 (fort agacement).
