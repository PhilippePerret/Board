---
name: feedback-test-infra-fix-dont-ask
description: un bug d'infra de test démontré et sans ambiguïté (comparaison cassée, mécanisme qui ne marche pas du tout) se corrige direct, pas de permission à demander
metadata:
  type: feedback
---

Quand un bug d'infrastructure de test est démontré par le code (pas une hypothèse) et que le remplacement ne fait que réparer un mécanisme qui ne fonctionne pas du tout (ex. une comparaison par id qui casse dès qu'une fenêtre est recréée), corriger directement — ne pas demander la permission comme pour un choix de conception ou une modification de comportement app.

**Why:** Après avoir diagnostiqué que `close-windows-except` (comparaison par id AppleScript) fermait par erreur les fenêtres Finder personnelles de Phil parce qu'une fenêtre recréée par un test change d'id, j'ai demandé l'autorisation avant de corriger. Réaction : "tu comprends pas qu'à la question 'est-ce que je peux remplacer quelque chose qui ne fonctionne pas du tout par quelque chose qui fonctionnera' je répondrai forcément oui". La question était perçue comme une perte de temps sur une évidence, pas comme de la prudence appréciée.

**How to apply:** Distinguer deux cas dans `Tests/` (scripts d'infra, `.applescript`, helpers) :
1. Bug démontré, fix mécanique, comportement voulu déjà clair (ex. évidence du diagnostic) → corriger direct, dire ce qui a été fait après coup.
2. Choix de conception, nouveau comportement, ambiguïté sur ce qui est voulu → là, demander avant.
Ne pas confondre avec [[feedback-no-app-code-without-request]] : cette règle-ci concerne le CODE DE L'APPLI (frontend/backend, comportement utilisateur final) — les scripts de test ne sont pas soumis à la même prudence quand le bug est démontré.
