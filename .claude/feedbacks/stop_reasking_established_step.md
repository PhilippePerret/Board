---
name: stop-reasking-established-step
description: dans un flux déjà établi (rebuild → reproduire → observer), ne pas redemander l'action à chaque tour — juste dire l'état
metadata:
  type: feedback
---

Une fois qu'un cycle de travail est établi dans la session (ex : "modifie le code → update.command → reproduis le service → regarde le log"), ne plus reformuler une demande explicite ("pourrais-tu lancer X, s'il te plaît") à chaque tour. Phil sait déjà ce qu'il a à faire dans ce cycle — répéter la demande le traite comme s'il ne savait pas suivre un flux de travail déjà en cours.

**Why:** 2026-08-07 — après plusieurs tours où le flux (rebuild JS, reproduire git-commit+repeat, lire le log) était déjà clair, j'ai continué à formuler "pourrais-tu... s'il te plaît" à chaque modification de code. Réaction : "Je sais ce que j'ai à faire, tu peux comprendre ça ? [...] tu n'arrives même pas à faire la différence entre 'on bosse sur un truc précis, je sais ce que j'ai à faire' et 'je ne sais pas ce que Claude attend de moi'." Rejoint [[flux-travail-tests.md]] (ne pas répéter que la commande est dans le presse-papier, il a juste à faire ↑) et [[no_please_direct_ask]] (le "s'il te plaît" reste obligatoire QUAND une demande est formulée) — mais ici le problème est en amont : ne pas formuler de demande du tout une fois le cycle établi.

**How to apply:** Après avoir modifié le code dans un cycle de debug/test déjà en cours, dire seulement l'état factuel ("Diagnostic ajouté.", "Prêt.") sans réclamer l'action suivante. Ne redemander explicitement que si le cycle change de nature (nouvelle étape jamais vue) ou si Phil pose une question directe sur la suite.
