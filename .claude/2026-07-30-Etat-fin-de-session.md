---
name: etat-fin-session-2026-07-30
description: Investigation des 2 échecs de tests reportés le 2026-07-29 (révélation panneau services démarrage, création simple nouveau projet) — 1 test corrigé, 1 cause identifiée mais pas résolue
metadata:
  type: project
---

## Fait aujourd'hui

- Point "Todoist mismatch" (`Project.js`/`Todoist.js`) du 2026-07-29 : vérifié résolu (`Project.js:743` appelle `Todoist.update_tasks`, qui existe).
- Point "Reminder au close/modify" : vérifié — approche = destruction/reconstruction complète des reminders (`Project.js:765`, `Reminder.destroy('task')`), pas de suppression ciblée via `remindedTasks` (conservé pour usage futur).
- **Échec "révélation du panneau des services au démarrage"** : diagnostiqué. Le test attendait un survol (`hover`) affichant un message d'astuce dans le footer — comportement voulu supprimé (design décidé aujourd'hui : plus d'effet au survol, uniquement cmd+clic sur GO pour révéler le panneau, déjà implémenté `Project.js:452-460`). Test corrigé : `Tests/specs/e2e/revelation_services_startup.rb` — bloc hover/message retiré, var `startup_container` inutilisée retirée, libellé mis à jour.
- **Échec "création simple d'un nouveau projet"** : cause identifiée, pas corrigée. Clic sur "OK" (sélection Finder) envoie l'action bridge `getInfoFinderSelection` → backend exécute `backend/scripts/getInfoFinderSelection.scpt` → réponse jamais reçue à temps → fenêtre titre (`__panel-`) jamais ouverte → timeout test (4s). Pas encore déterminé pourquoi ce script AppleScript traîne/échoue — diagnostic par lecture de code seulement, pas de run réel.

## Non résolu — à reprendre

1. Diagnostiquer pourquoi `backend/scripts/getInfoFinderSelection.scpt` répond trop lentement (ou pas) lors du test "création simple d'un nouveau projet". Nécessite instrumentation + run réel (cf. consigne [[two_failures_then_log]]).
2. Lancer réellement la suite de tests (`./scripts/run-tests`) pour valider la correction du test 1 et confirmer/infirmer le diagnostic du test 2 — jamais lancé par moi, à faire par Phil.
