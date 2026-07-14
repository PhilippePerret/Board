---
name: project-test-suite-failures
description: PRIORITÉ prochaine session — 7 échecs identifiés dans la suite e2e (2026-07-13), diagnostics posés, rien corrigé (interdiction de toucher au code ce jour-là)
metadata:
  type: project
---

État au 2026-07-13, fin de session — suite e2e complète lancée par l'utilisateur : 16 succès / 7 échecs / 23 tests. Diagnostics posés en lecture seule (read/grep/osadecompile), **aucun code touché**. À reprendre.

## 1-3. `ajout_service_startup.rb`, `attribution_puis_execution_double_service.rb`, `attribution_service.rb` — même cause

Les trois utilisent `SERVICE_ID = 'open-folder-project'` avec `BoardTest#attach_service_to_project` (glisser-déposer, `Tests/support/helpers_base.rb`). Mais `open-folder-project` est un service **commun** (`ServiceCommon.observe()` n'a qu'un listener `click`, jamais de `dragstart`, contrairement à `ServiceCustom.observe()`) — glisser un service commun ne remplit jamais `dataTransfer`. Au drop : `Project.js` fait `ServiceCustom.get(e.dataTransfer.getData("id"))` → `''` → `undefined` → `preAddService` appelle `.define()` sur `undefined` → exception silencieuse → jamais de dialogue `__service_name__` → timeout 10s.

Le service pensé pour ce parcours (nom → fenêtre Finder → sidebar, 3 dialogues — exactement ce que décrit l'en-tête de `attribution_service.rb`) est `open-finder-window`, dans `CUSTOM_SERVICES_DATA` (`frontend/js/ServiceData.js`). `SERVICE_ID` dans les 3 fichiers pointe sur le mauvais id.

**Piste de correction** : remplacer `SERVICE_ID = 'open-folder-project'` par `SERVICE_ID = 'open-finder-window'` dans les 3 fichiers, revérifier que le déroulé (nom/fenêtre/sidebar) colle toujours au flow réel de ce service.

## 4-5. `execution_double_service.rb`, `execution_services_startup.rb` — 2 causes cumulées

- `Tests/support/helpers_base.rb#fixture_open_folder_service` construit `params: [path, 100, 100, 600, 400, 200, 'list view', true]` (8 valeurs, forme d'un ancien service à 8 args — commentaire du helper : "chemin, x, y, w, h, sidebarWidth, view, showSidebar"). Le service actuel `open-folder-project` n'a que 2 params abstraits (`path` + `window-bounds` type `bounds`), qui s'étendent en 5 valeurs backend. `backend/scripts/OpenFolderProject.scpt` décompilé confirme : `set {chemin, x, y, w, h, view} to items of argv` — 6 items attendus (AppleScript prend juste les 6 premiers d'une liste de 8, sans erreur, mais `view` reçoit alors `200` au lieu d'une vraie valeur de vue).
- Bug indépendant, réel, dans le script lui-même : `set sidebar width to sbarWidth` référence une variable `sbarWidth` **jamais définie nulle part** dans le script (ni dans les 6 items destructurés, ni ailleurs) — erreur AppleScript garantie à cette ligne, quel que soit le fixture utilisé.

**Piste de correction** : 1) corriger `fixture_open_folder_service` pour générer 6 valeurs (path,x,y,w,h,view) au lieu de 8 ; 2) dans `OpenFolderProject.scpt`, remplacer `sbarWidth` par une valeur réelle (soit retirer la ligne `set sidebar width`, soit ajouter un 7e argv dédié si la fonctionnalité est voulue).

## 6. `ouverture_terminal_projet.rb`

Pas une régression — l'en-tête du fichier le dit explicitement : "DOIT échouer tant que ce n'est pas fait". Voir aussi `project_open_terminal_service_wip.md` (déjà en mémoire projet, toujours d'actualité) : service `open-terminal` pas encore implémenté côté backend (`backend/scripts/OpenTerminal.rb` inexistant, confirmé).

## 7. `service_commun_horloge_seuils.rb` (écrit par moi le 2026-07-13, cf. aussi ce fichier de test)

"pont ne répond pas après 15s" en évaluant `document.getElementById("clock-dial")`. Le test fait exprès passer Finder au premier plan (`activate_finder`) puis attend ~60s en temps réel avant le seuil rouge de l'horloge — hypothèse : throttling WKWebView pendant que Board n'est pas au premier plan, qui rend le bridge indisponible le temps de l'attente. Défaut de conception du test (pas un bug applicatif Clock.js) — à revoir : soit raccourcir l'attente réelle, soit trouver un moyen de garder le bridge joignable pendant que Board est en arrière-plan, soit restructurer le test pour ne pas dépendre d'un si long aller-retour en arrière-plan.

## Contexte additionnel (pas des bugs, pour mémoire)

- Beaucoup de commits sont passés entre les tours de cette session (grouping des services par `group`, refonte `Project.js` avec `PROPERTIES`/`adata`, largeur `--editor-width` 300→380px) — faits par l'utilisateur ou une autre session, pas par moi. Vérifié via `git diff`/`git log` avant d'écrire quoi que ce soit ici : aucun de ces fichiers de service (`Service.js`, `ServiceCustom.js`, `ServicesTools.js`) n'a été touché par moi cette session.
