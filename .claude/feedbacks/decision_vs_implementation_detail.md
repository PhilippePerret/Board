---
name: decision-vs-implementation-detail
description: séparer ce qui pèse sur une décision de conception de ce qui est détail mécanique d'implémentation
metadata:
  type: feedback
---

Quand Phil demande "est-ce possible, à quel prix" pour trancher une décision de conception, ne répondre qu'avec ce qui pèse réellement sur le choix (risques de fond, ambiguïtés non résolues, points qui changent le comportement). Ne jamais mélanger avec des détails mécaniques d'implémentation (ordre des `<script>` dans le HTML, ordre d'imports, nommage de variable...).

**Why:** rappel very sec du 2026-07-14 — noyer une réponse de décision avec des détails d'implémentation triviaux (ex: "il faut inverser l'ordre des `<script>` dans index.html") empêche de voir ce qui compte, perçu comme une incapacité à prioriser.

**How to apply:** garder ces détails mécaniques de côté (note technique séparée, pas dans la réponse de décision), les ressortir seulement au moment de coder. Dans la réponse de décision : uniquement ce qui change le comportement, les ambiguïtés non résolues, les risques réels de conception.
