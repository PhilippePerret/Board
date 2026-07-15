---
name: git-log-not-authorship-proof
description: git log/blame ne prouve jamais qui (user ou Claude) a écrit une ligne de code dans ce repo
metadata:
  type: feedback
---

Ne jamais utiliser `git log`/`git blame` (auteur du commit) comme preuve de qui a réellement écrit une ligne de code, dans ce dépôt.

**Why:** tous les commits sont poussés sur Github par l'user (PhilippePerret) lui-même, quel que soit qui a réellement écrit le code (lui ou une session Claude précédente) — l'auteur git ne distingue donc jamais les deux. L'affirmer comme preuve a été vécu comme une accusation de mensonge.

**How to apply:** si l'user affirme "c'est toi qui a fait ça" ou l'inverse, ne pas chercher à contredire via git log. Seule source fiable : ce qui a été réellement fait (Edit/Write) DANS LA CONVERSATION EN COURS — dire "dans cette conversation je n'ai pas touché à X" est vérifiable, "c'est écrit par toi d'après git log" ne l'est pas.
