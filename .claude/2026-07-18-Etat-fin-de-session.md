---
name: 2026-07-18-etat-fin-de-session
description: état daté 2026-07-18 — bug structurel run_tests.sh (board_test = exit par fichier) corrigé sur service_commun_ouverture_terminal.rb, bug TextareaDialog (returnedIdValues dupliqué) et bug viewType/view dans OpenFolderProject.scpt corrigés, plus les 2 entrées _tests_a_faire.adoc (param :transient, nom de service en cache) testées et corrigées — tous les échecs connus de la journée confirmés passants
metadata:
  type: project
---

État au 2026-07-18, fin de session.

## Partie 2 (param :transient + nom de service en cache)

- Écrit 2 nouvelles specs depuis `Tests/_tests_a_faire.adoc` (entrées retirées du fichier, synchro faite) : `service_commun_param_transient.rb` et `attribution_service_nom_pas_en_cache.rb`.
- Bug réel #1 (`ensureServiceData`, `frontend/js/Service.js`) : un paramètre marqué `transient:true` (ex. `code` de `open-terminal-at-folder`) était bien remplacé par le sentinel `':transient:'` au moment de la sauvegarde disque, mais `onReturnFromDefineProjetParams` restaurait ensuite la VRAIE valeur en mémoire (`projet.common_services_data`) pour pouvoir exécuter tout de suite — cette restauration n'était jamais reprise, donc plus aucun clic suivant (même session) ne retrouvait le sentinel → jamais redemandé après le 1er clic.
- Fix en 2 temps :
  1. `ServiceData.js` (déjà fait par l'user avant que je reprenne la main) : `defineSomeVolatileProps` calcule `s.transient = true` sur l'entrée si au moins un de ses `params` a `transient:true` (bug de nommage `defineVolatileProps`/`defineSomeVolatileProps` au passage, corrigé).
  2. `Service.js` : `duplicateService()` ne force plus `transient:true` (laisse passer la valeur schéma via le spread de `this.data`) ; `ensureServiceData()` réécrite pour lire `this.transient` directement au lieu de scanner les valeurs stockées.
  3. Bug de boucle découvert en testant : `onReturnFromDefineProjetParams` rappelait `execCommonServiceOn` (qui repasse par `ensureServiceData`, qui revoit `transient==true` et redemande ENCORE au lieu d'exécuter) — remplacé par un appel direct à `new ServiceExecuter(this).execOnProject(projet)`.
- Bug réel #2 (nom de service en cache d'un projet à l'autre) : les boutons du panneau (`ServicePanel.js`) sont des instances `Service` uniques construites une fois par session, dont `.data` POINTE directement vers l'entrée `ServiceData.js` (pas une copie). Le glisser-déposer (`Project.js#preAddService`) appelait `.define()` DIRECTEMENT sur ce singleton (`Service.get(id)` renvoie l'instance du panneau) — `ServiceDefiner#onDefined` écrit `service.data.name` dessus, donc mute l'entrée PARTAGÉE. Next glissé du même bouton sur un autre projet : nom précédent proposé par défaut au lieu du nom d'origine.
- Fix : `preAddService` duplique désormais le service (`service.duplicateService()`) avant `.define()` — même pattern que `duplicAndExecCommonServiceOn` (déjà utilisé pour le clic direct panneau), maintenant réutilisé aussi pour le glisser-déposer. Doublon d'uuid retiré au passage (`addService()` ne fait plus `service.uuid = uniqId()`, déjà fait par `duplicateService()`).
- Les 2 nouveaux tests passent (confirmé par l'user). Suite complète pas rejouée après ces derniers fix (changements touchant tout le flux service commun/personnalisé, communs+glisser-déposer) — à vérifier.

- `service_commun_ouverture_terminal.rb` avait 3 `board_test` dans le même fichier : le runner (`Tests/version-pont/run_tests.sh:257`) lance `ruby $spec` une fois PAR FICHIER, et `board_test` (`Tests/support/helpers_base.rb:59-72`) fait `exit()` en fin de CHAQUE appel — seul le 1er scénario ("pwd") s'exécutait, les 2 autres ne tournaient jamais, silencieusement. Splitté en 3 fichiers (`service_commun_ouverture_terminal.rb`, `_guillemets.rb`, `_sans_code.rb`, un `board_test` chacun, même convention que tous les autres specs e2e). Les 3 passent (confirmé par l'user).
- Point d'entrée réel de la suite de tests : `scripts/run-tests` (pas `Tests/version-pont/run_tests.sh` directement) — accepte `-v <logiciel>` pour changer de moteur, défaut `pont`.
- `frontend/js/Dialogs.js:47`, `TextareaDialog` : ligne `this.returnedIdValues = [...(this.returnedIdValues ?? []), this.id]` dupliquait la valeur du textarea en tableau `[valeur, valeur]` au lieu d'une string (confirmé via `~/Library/Application Support/Board-debug.log`, qui log les requêtes backend même hors run de tests). Même ligne buggée déjà retirée de `TextFieldDialog` (commit `c7418e8`) et `ColorDialog` (commit `bd1c5d9`), jamais retirée de `TextareaDialog`. Supprimée. Cause du test `service_commun_horloge.rb` en échec (CHANGELOG.md jamais créé, `changelog_text.strip` plantait côté backend sur un Array).
- `backend/scripts/OpenFolderProject.scpt` : variable destructurée renommée `viewType` mais toujours appelée `view` (non définie) dans 4 des 5 branches `else if` du choix de vue Finder — AppleScript error `-2753`. Décompilé (`osadecompile`), corrigé, recompilé (`osacompile`). Cause du test `execution_services_startup.rb` en échec.
- Les deux tests précédemment en échec (`execution_services_startup.rb`, `service_commun_horloge.rb`) confirmés passants par l'user après ces deux fixes.
- `~/Library/Application Support/Board-debug.log` (hors dossier sauvegardé/restauré par `run_tests.sh`) : utile pour lire les erreurs backend complètes quand l'UI les tronque (footer `#message`, effacé après 10s ou coupé visuellement).

## Partie 3 (EN COURS — panneau extra-data pas synchronisé au changement de projet)

Bug source : `_dev/Manuel/adocs/_TODO_.adoc`, section BUGS — le panneau "Données supplémentaires du projet" (`ProjectExtraDataPanel`, `frontend/js/ProjectExtraData.js`) ne se mettait pas à jour quand on changeait de projet pendant qu'il était ouvert.

Fix déjà appliqué (à ne pas refaire si on reprend cette tâche) :
- `ProjectExtraDataPanel` transformé en singleton rebindable (retrait du constructeur prenant `projet`, ajout de `setProject(projet)` qui réaffiche les valeurs si déjà bâti).
- `Project.js` : `defineExtraData()` utilise `ProjectExtraDataPanel.instance.setProject(this)` au lieu d'une instance par projet.
- `Project.js` : ajout de `PROJECT_PANELS` (liste extensible de panneaux liés au projet courant, actuellement `[ProjectExtraDataPanel]`) et `updateOpenedPanel(projet)` — générique : si un panneau de la liste est ouvert, l'adapte au nouveau projet (`setProject`) si `projet` fourni, sinon le ferme.
- `onSelect` réécrit : `same || this.select(projet)` puis un seul appel `this.updateOpenedPanel(same ? undefined : projet)` — zéro variable/flag pour mémoriser l'état.
- Testé en manuel par l'user (via `update.command`) : "fonctionne comme un charme".

Reste à faire : écrire les specs e2e couvrant les 10 cas validés par l'user (liste ci-dessous), PAS ENCORE COMMENCÉ au moment de cette note (aucun fichier de spec créé pour cette partie).

BLOQUANT — décision à prendre AVANT d'écrire les specs des cas 3, 7, 8, 9 (tous ceux qui vérifient "le panneau est ouvert/fermé") :
`.closed` (`frontend/css/services.css:15`) décale juste le panneau hors écran (`right: calc(-1 * (var(--editor-width) + 100px))`), ne le retire PAS de l'arbre AX — `exists?`/`wait_for` (basés sur AX, `Tests/support/ax.applescript`) ne peuvent donc PAS distinguer ouvert/fermé pour ce type de panneau (élément toujours "exists", juste ailleurs).
Question posée à l'user, réponse : "Ça n'est pas à moi de prendre ce genre de décision" — donc TOUJOURS À TRANCHER à la reprise. 3 options envisagées, aucune choisie :
  A) Nouveau helper générique multi-moteurs (ex. `panel_open?(dom_id)`) — lit la position AX pour les moteurs AX-based, équivalent JS (`classList.contains('closed')`) pour le moteur "pont". Plus de travail, réutilisable pour tout futur panneau, marche sur tous les moteurs.
  B) JS direct via le moteur "pont" uniquement (`bridge_eval`, déjà dispo dans `Tests/version-pont/support/helpers.rb`, lit `classList.contains('closed')`). Rapide, casse la portabilité multi-moteurs (seul "pont" utilisé aujourd'hui de toute façon, cf. tous les logs de la journée : "Moteur : pont").
  C) Ne pas tester ouvert/fermé du tout — se limiter à vérifier le CONTENU affiché (quelles données), laisser tomber les cas 3, 7, 8, 9.
Les cas 1, 2, 4, 5, 6, 10 ne sont PAS bloqués par cette question (ils portent sur le contenu affiché, pas sur l'état ouvert/fermé) — possible de les écrire sans attendre la décision.

1. Sélectionner un projet A, panneau jamais ouvert, redéselectionner → pas de crash.
2. Sélectionner A, ouvrir le panneau → affiche les données de A.
3. Panneau ouvert sur A, redéselectionner A → le panneau se ferme.
4. Panneau ouvert sur A, sélectionner B (sans déselectionner à la main) → panneau reste ouvert, données de B affichées.
5. Depuis le cas 4, modifier une valeur → s'applique à B, pas à A.
6. Depuis B (cas 4/5), resélectionner A → panneau réadapté à A.
7. Fermer le panneau manuellement sur A, puis sélectionner B → panneau reste fermé.
8. Plusieurs changements de projet à la suite, panneau toujours fermé → jamais de tentative d'adaptation, pas de crash.
9. Rechargement de l'app pendant que le panneau était ouvert → après reload, panneau fermé par défaut.
10. Suppression du projet affiché dans le panneau (ouvert dessus) → pas de crash (à confirmer si dans le périmètre).

Fichier(s) à créer : probablement `Tests/specs/e2e/projet_extradata_panel_sync_projet.rb` (ou split en plusieurs fichiers vu le bug du jour sur les `board_test` multiples par fichier — UN SEUL `board_test` par fichier .rb, cf. Partie 1).
