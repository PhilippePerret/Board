---
name: feedback-test-explanation-format
description: toute explication liée à un test doit garder le bloc aperçu conventionnel + chaque point numéroté, même pour un diagnostic long
metadata:
  type: feedback
---

Même pour un diagnostic long/technique sur un test, toujours reposer le bloc aperçu conventionnel (`«««...»»»` avec les étapes numérotées ok/problème) avant l'explication, ET numéroter chaque point distinct de l'explication elle-même.

**Why:** Après un diagnostic long en un seul bloc de prose (bug de save non synchronisé dans Prompter.js) : "REMETS L'EXPOSÉ CONVENTIONNEL DU TEST (sinon je ne comprends RIEN)" + "NUMÉROTE CHAQUE DES POINTS" + ressenti de malveillance/manque de soin. Cumule avec [[feedback-no-internal-jargon-labels]] et la règle INTERDICTIONS n°19 (numéroter dès qu'il y a plus d'un point) — déjà connu, pas appliqué ici parce que "diagnostic technique" a été traité comme hors du format habituel des tests.

**How to apply:** Dès qu'une réponse porte sur un test (aperçu, diagnostic, correction), même complexe, garder le format : 1) bloc `«««...»»»` avec les étapes constatées du run (ok/problème), 2) chaque affirmation/cause/proposition distincte numérotée séparément — ne jamais retomber en prose continue sous prétexte que c'est "trop technique pour le format".
