---
name: feedback-remove-obsoleted-code-same-turn
description: retirer le code que mon propre edit rend mort, dans le même tour, sans attendre qu'on le demande
metadata:
  type: feedback
---

Quand un edit remplace un mécanisme (nouvelle action/fonction qui prend la place d'une ancienne), chercher et retirer tout ce que cet edit vient de rendre mort — actions/fonctions/helpers qui n'ont plus aucun appelant — dans le même tour, avant de rapporter le travail comme fini.

**Why:** Après avoir remplacé la comparaison par id par une comparaison par dossier dans `finder.applescript`/`run_tests.sh`, j'ai rapporté le fix comme fini sans vérifier que l'ancien mécanisme (`window-ids`, `close-windows-except` par id, `finder_window_ids`) était devenu mort. Phil : "je te vois ajouter des quantités hallucinantes de code, mais je te vois très peu en retirer [...] tu laisses ta merde s'accumuler". A fallu qu'il le demande pour que je grep les appelants et retire les 3 blocs devenus orphelins.

**How to apply:** Après tout edit qui remplace X par Y (nouvelle fonction, nouvelle action AppleScript, nouveau paramètre), grep les appelants de X avant de considérer la tâche terminée. Si X n'a plus d'appelant, le retirer — dans la même série d'edits, pas dans un tour séparé après relance. Ne pas confondre avec du nettoyage non sollicité au sens large ([[feedback-no-app-code-without-request]]) : ici il ne s'agit pas d'ajouter une tâche, mais de finir correctement celle en cours — laisser du code mort derrière soi est une tâche inachevée, pas une tâche en plus.
