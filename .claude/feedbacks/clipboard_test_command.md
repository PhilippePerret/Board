---
name: clipboard-test-command
description: à chaque commande de test à jouer donnée à l'user, la coller aussi dans le presse-papier (pbcopy)
metadata:
  type: feedback
---

Chaque fois qu'une commande shell (test à lancer, etc.) est donnée à l'user pour qu'il l'exécute lui-même, la copier aussi dans le presse-papier via `pbcopy`.

**Why:** demandé explicitement par l'user (2026-07-15) ; oublié une fois juste après l'avoir dit, ce qui a énervé — l'user ne veut pas avoir à sélectionner/copier le texte à la main. Re-oublié le 2026-07-26 (colère forte) : à traiter comme un réflexe systématique, pas une option à évaluer au cas par cas — toute commande destinée au terminal de l'user = pbcopy immédiat, sans exception.

**How to apply:** dès qu'un message contient une commande destinée à être collée dans un terminal par l'user (ex. `scripts/run-tests ...`), faire systématiquement `printf '%s' "<commande>" | pbcopy` avant/avec la réponse, sans qu'il ait à le redemander.
