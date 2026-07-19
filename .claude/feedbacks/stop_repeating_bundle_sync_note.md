---
name: stop-repeating-bundle-sync-note
description: ne pas répéter à chaque message que "Board.app n'est pas synchronisé" — la sync est son job, pas le mien à signaler sans arrêt
metadata:
  type: feedback
---

Ne jamais répéter, à chaque édition de fichier frontend/backend, une phrase du genre "pas copié dans Board.app" ou "à toi de resynchroniser". La synchronisation (`update.command`) est le travail de Phil, il le sait déjà — recommencer à chaque message l'agace ("tu me prends la tête avec ton pas copié dans Board.app").

**Why:** dit sèchement le 2026-07-19, après plusieurs répétitions consécutives de la même remarque à chaque fix.

**How to apply:** éditer les fichiers source normalement, ne rien dire sur la synchro bundle sauf s'il demande explicitement où en est la synchro.
