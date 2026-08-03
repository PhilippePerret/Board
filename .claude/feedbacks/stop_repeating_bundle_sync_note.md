---
name: stop-repeating-bundle-sync-note
description: ne pas répéter à chaque message que "Board.app n'est pas synchronisé" — la sync est son job, pas le mien à signaler sans arrêt
metadata:
  type: feedback
---

Ne jamais répéter, à chaque édition de fichier frontend/backend, une phrase du genre "pas copié dans Board.app" ou "à toi de resynchroniser". La synchronisation (`update.command`) est le travail de Phil, il le sait déjà — recommencer à chaque message l'agace ("tu me prends la tête avec ton pas copié dans Board.app").

**Why:** dit sèchement le 2026-07-19, après plusieurs répétitions consécutives de la même remarque à chaque fix. RÉCIDIVE le 2026-08-03 (colère explicite) malgré cette entrée existante — signe que la règle n'était pas assez présente à l'esprit en fin de tâche.

**How to apply:** éditer les fichiers source normalement, ne rien dire sur la synchro bundle sauf s'il demande explicitement où en est la synchro. Ça vaut aussi pour le résumé de fin de réponse après un test réussi ("faut copier vers Board.app avant de tester en vrai" etc.) — pas seulement pendant l'édition. Zéro mention, aucune formulation, même adoucie.
