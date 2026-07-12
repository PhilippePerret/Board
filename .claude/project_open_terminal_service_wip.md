---
name: project-open-terminal-service-wip
description: PRIORITÉ prochaine session — service "open-terminal" en cours d'implémentation, test écrit et confirmé en échec, backend pas encore fait
metadata:
  type: project
---

État au 2026-07-11, fin de session — à reprendre en priorité :

**Service "open-terminal"** ("Ouvrir un Terminal au dossier du projet", ajouté par l'utilisateur dans `frontend/js/ServiceData.js`) :
- Test écrit : `Tests/specs/e2e/ouverture_terminal_projet.rb` — lancé, échec confirmé par l'utilisateur (attendu, rien n'est implémenté).
- `ServiceData.js` : `scType: '.rb'` ajouté sur l'entrée `open-terminal` (fait).
- **Pas encore fait** : `Project.js#addService` doit injecter `service.params = [this.path]` quand `service.id == 'open-terminal'` (le service n'a aucun param déclaré — `params: []` — donc rien n'arrive au backend sans ça ; pas de mécanisme générique existant pour transmettre le chemin du projet à un service, vérifié dans `ServiceExecuter.js`).
- **Pas encore fait** : créer `backend/scripts/OpenTerminal.rb` (plain Ruby, cohérent avec `scType: '.rb'`) — probablement `system('open', '-a', 'Terminal', path)` + `puts({ok:true}.to_json)`.
- **Pas encore fait** : synchroniser les fichiers modifiés dans `Board.app/Contents/Resources/` (frontend/backend), puis relancer `./run-tests ouverture_terminal_projet.rb` pour confirmer que ça passe.
- Vérification utilisée dans le test : `BoardTest#terminal_front_window_name` (nouveau helper, `Tests/support/helpers_base.rb`) — suppose que le titre par défaut d'une fenêtre Terminal reflète le nom du dossier courant ; jamais vérifié en conditions réelles.

**Note personnelle de l'utilisateur (pas pour moi) :** il doit implémenter lui-même le traitement d'une URL (contexte non précisé — à clarifier avec lui à la reprise).
