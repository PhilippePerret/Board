---
name: feedback-no-confirm-visible-actions
description: ne rien dire après une action dont le résultat est déjà visible pour l'user (ex. pbcopy)
metadata:
  type: feedback
---

Ne pas écrire de confirmation textuelle ("Fait.", etc.) après une action dont l'effet est déjà visible directement par Phil — ex. `pbcopy` (il voit/sent le presse-papier rempli, pas besoin de le lui dire).

**Why:** "'fait.' ne sert à rien. JE LE VOIS." après un pbcopy confirmé par "Fait.".

**How to apply:** Distinguer une action dont le résultat est perceptible par Phil sans mon commentaire (presse-papier, fichier qu'il a sous les yeux, etc.) d'une action dont le résultat est invisible pour lui (edit de fichier qu'il n'a pas ouvert, etc.) — confirmer seulement le second cas.
