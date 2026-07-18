---
name: feedback-close-debug-windows
description: toujours refermer immédiatement toute fenêtre (Terminal, Script Editor, etc.) ouverte pour une vérification manuelle
metadata:
  type: feedback
---

Chaque commande de debug manuel (`osascript ...scpt`, `open -a ...`) qui ouvre une fenêtre visible doit être suivie, dans le même geste, de sa fermeture — pas seulement en fin de tâche, à chaque ouverture.

**Why:** plusieurs fenêtres Terminal laissées ouvertes lors d'investigations successives (vérif `foldPath`, reproduction manuelle du param 'code'...) ont fini par s'accumuler sans être refermées ; l'user a dû les fermer lui-même. Signalé deux fois dans la même session (2026-07-17).

**How to apply:** dès qu'une commande de vérification manuelle (hors suite de tests, qui gère déjà son propre nettoyage) ouvre une fenêtre d'app, ajouter la commande de fermeture (par id si possible, cf. [[project_terminal_window_by_id]]) tout de suite après avoir lu ce qu'il fallait lire — ne pas laisser traîner "pour plus tard".
