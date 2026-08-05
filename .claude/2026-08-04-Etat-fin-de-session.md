---
name: 2026-08-04-etat-fin-de-session
description: 17 tests en échec à identifier, test git-init du 2026-08-03 jamais revérifié, 1-2 petits trucs restants côté Phil
metadata:
  type: project
---

# À reprendre en premier

- **17 tests en échec** — liste dans `Tests/resultats/2026-08-04_17h57.log`
  (`grep -c "^✗"` confirme 17) :
  - le nom personnalisé d'un service commun glissé sur un projet ne reste pas en cache pour le glissé suivant
  - service 'Ouvrir le fichier…' : attribution avec un logiciel choisi dans la liste
  - service 'Ouvrir le fichier…' : attribution avec un nom de logiciel tapé explicitement
  - service 'Ouvrir le fichier…' : attribution avec le choix « par défaut »
  - service 'Ouvrir le fichier…' : fichier introuvable -> message d'erreur clair
  - outil 'Programmer une alerte' : date/heure invalide redemande la saisie
  - outil 'Programmer une alerte' : date/heure aujourd'hui, timer armé, persisté quand même
  - panneau extra-data : icône choisie affichée tout de suite sur la carte
  - Reminder détruit quand sa tâche est achevée avant son heure de début
  - Reminder : rappel 'immediat' exécuté et retiré de façon synchrone
  - Reminder recréé quand l'heure de la tâche est modifiée
  - service commun 'éditer la documentation' : définition au premier clic, exécution directe ensuite
  - service commun 'initier documentation' : arborescence, garde-fou 2e clic, enchaînement update/open
  - service commun 'ouvrir la documentation' : définition au premier clic, exécution directe ensuite
  - service commun 'actualiser la documentation' : définition au premier clic, exécution directe ensuite
  - sortie auto du standby à l'heure d'une tâche future
  - panneau 'Outils' : ouverture/fermeture, 1er outil activé

  Plusieurs touchent des flux `SelectDialog`/`ServiceDefiner` modifiés
  aujourd'hui (attribution logiciel, définition-au-premier-clic des services
  documentation) — candidats prioritaires à corréler avec les changements du
  jour plutôt qu'à traiter comme pré-existants sans vérifier.
- **Test git-init, reporté du 2026-08-03, jamais revérifié depuis** :
  `Tests/specs/e2e/service_commun_git_init.rb`. Statut toujours inconnu —
  aurait dû être la toute première chose vérifiée en début de session
  d'aujourd'hui (règle PRIORITÉ de `.claude/CLAUDE.md`), ça n'a pas été fait.
  À traiter avant les 17 échecs ci-dessus, ou en même temps.
- Phil a dit qu'il lui restait "un ou deux petits trucs" à faire lui-même
  avant de continuer — non précisés.

# Résumé du 2026-08-04 (contexte, pas à refaire)

- `SelectDialog` (`Dialogs.js`) entièrement réécrit : liste custom filtrable
  (fuzzy) au lieu d'un `<select>` natif, état tenu en mémoire (`this.items`,
  pas de requête DOM par frappe), multi jamais présélectionné, setter `.value`
  compatible avec les tests e2e existants (`set_value`/`set_value_suffix`).
- `dynParams` : `ServiceExecuter` lit `SDATA.dynParams` directement (plus le
  détour par `persist:false` dans `params`).
- `afterDefinedParams` déplacé de `ServiceDefiner` (attache, params fixes
  seulement) vers `ServiceExecuter` (exécution, après params ET dynParams) —
  corrige `open-a-file` (`file://` qui s'empilait à chaque redéfinition,
  donnée corrompue sur la carte projet de Board réparée à la main).
- `Prompter.js` : `dialogBase()` centralise `title`/`id`/`message`/`width`,
  dédupliqué sur une quinzaine de méthodes `prompt*`.
- Pont Swift synchrone (`Backend.swift`) identifié comme bloquant l'UI
  pendant les scripts longs (ex. `git push`) — contourné côté JS
  (`xbridge.js`, double `requestAnimationFrame` avant `postMessage`), pas de
  refonte async de `Backend.swift`.
- Sécurité shell : `shellEscape()` (JS, `utils.js`) + `Shellwords.escape`
  (Ruby, `git.rb`) appliqués à `create-git-issue`, `gh-issue-create`,
  `Git.commit` (guillemets simples au lieu de guillemets doubles bruts).
- `_dev/localisation.txt` : liste des textes UI en dur non traduits, par
  fichier/ligne (tâche de repérage, pas de correction).
