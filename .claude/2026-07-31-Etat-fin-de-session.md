---
name: etat-fin-session-2026-07-31
description: Session du 2026-07-31 — nombreux fixes (crash JSON, course socket/DOM, Project.PROPERTIES, Clock instance, SidePanel hidden, standby perdus au déplacement) + hourglass.js (Spinner) ; run complet à 18h08 : 15 échecs, 4 pendings, cause principale identifiée mais PAS ENCORE appliquée (SidePanel#build intercepte le drag natif des services)
metadata:
  type: project
---

## À REPRENDRE EN PRIORITÉ

Repartir de `tests/resultats/2026-07-31_18h08.log` (dernier run complet : Success 57, Failures 15, Pendings 4). Détail des 15 échecs dans ce log, section "Échecs :".

### Fix identifié mais PAS appliqué (rejeté par Phil en fin de session, à refaire)

7 des 15 échecs (`ajout_service_startup`, `attribution_puis_execution_double_service`, `attribution_service_nom_pas_en_cache`, `attribution_service_ouvrir_fichier_choix_liste`, `attribution_service_ouvrir_fichier_nom_explicite`, `attribution_service_ouvrir_fichier_par_defaut`, `attribution_service.rb`) échouent tous sur `élément introuvable : __service-name__` — le glisser-déposer HTML5 d'un service vers une carte projet ne déclenche plus rien.

Cause : `SidePanel#build()` (`frontend/js/SidePanel.js`) appelle `this.listenMove(panel)` — le glissé du panneau (Draggable) écoute `mousedown` sur TOUT le panneau, y compris les services listés dedans. `Draggable#onMoveHandleDown` fait `stopEvent(ev)` (preventDefault), ce qui empêche le navigateur de démarrer le drag HTML5 natif d'un enfant `draggable=true`.

Fix à appliquer : ne faire écouter le glissé du panneau que sur une poignée dédiée (`legend`, le titre), pas sur tout le panneau — `this.listenMove(legend, panel)` au lieu de `this.listenMove(panel)` (même signature 2 arguments que pour `Clock` — `handle`, `panelÀDéplacer`). Nécessite de construire `fieldset`/`legend` AVANT l'appel à `listenMove` dans `build()` (actuellement après).

### Autres échecs du run, pas encore diagnostiqués

- `panneau extra-data : icône choisie affichée tout de suite` — `WKJavaScriptException: introuvable: project-fixture-...-panel-data-btn-oui` (le bouton Save du ConfigDialog n'existe pas au moment du clic).
- `redéfinition d'un service 'open-finder-window'` + `service commun 'ouvrir dossier du projet'` — `élément introuvable (suffix) : btn-oui` (aucun dialogue avec ce bouton n'apparaît).
- `Reminder : rappel 'immediat'` + `Reminder : rappel déjà échu` — `countAfter attendu 0, obtenu 1` (le rappel n'est plus retiré après exécution). Pas encore comparé à un run antérieur pour savoir si c'est une régression du jour ou déjà présent avant.
- `service commun 'éditer la documentation'` — fenêtre CotEditor = "Application Support" au lieu du dossier attendu (dossier réel de Phil ouvert ailleurs, probablement pas un bug de code — cf. section suivante).
- `service commun 'initier documentation'` — `docu.adoc existe ? false` — régression, passait plus tôt dans la session après le fix `Project.PROPERTIES`/`ParamDefiner.js`.
- `ServStep#validate() : select-or-string` — connu, volontaire (pas de vérification de type, décision de Phil), pas un bug.

### Fait aujourd'hui (résumé, détails dans l'historique de conversation)

- `Sources/Board/Bridge.swift` : guard `isValidJSONObject` avant crash NaN/Infinity.
- `Sources/Board/ViewController.swift` : `TestBridge.shared.attach` déplacé dans `didFinish navigation` (course socket/DOM au lancement).
- `frontend/js/ParamDefiner.js` : `Project.PROPERTIES` (jamais défini) remplacé par `PROJECT_DATA.some(d => d.id === prop)` (moi) + `Project.js#save`/`onSaveEditedData` corrigés par Phil.
- `frontend/js/Project.js#getProjectsOrder` : scanne maintenant aussi `standbyContainer` (les projets en standby disparaissaient de `projects-in` au moindre déplacement d'un projet actif — perte réelle constatée en live, corrigée).
- `frontend/js/Clock.js` : passé de static à instance (`Clock.instance`), bug `_panel` partagé avec `Draggable` corrigé par Phil (signature `listenMove(handle, panel)`).
- `frontend/js/SidePanel.js` : `.closed`/`right` remplacé par `.hidden` générique ; `toggleOpposites` copie la position (left/top) vers le panneau opposé.
- `frontend/js/hourglass.js` (nouveau) : classe `Spinner`, `start()`/`stop()`, sablier schématique en CSS pur (`clip-path` fixe + `transform: scaleY()` animé, compositeur — pas de `clip-path` animé, ça se bloque si le thread principal est occupé), rotation+fondu sur `stop()`. Chargé dans `index.html`.
- Tests : `service_commun_ouverture_dossier`, `service_commun_update_documentation`, `assert_service_message_ok!`/`exergue_message_text`, `script_service_create_folder` (id manquant), `projet_extradata_panel_suppression_projet_affiche`, 2 tests "genre", 3 tests extradata passés en `pending` (panneau modal remplace le SidePanel persistant, prémisse obsolète), nouveau test `deplacement_projet_conserve_standby.rb` (+ fix nécessaire : `launch_app` avant `ensure`, sinon le `saveData` debounced casse les tests suivants du même run).
- Bug transverse corrigé : 3 specs faisaient `finder_close_all_windows` (fermait TOUTES les fenêtres Finder, y compris celles de Phil) — remplacé par fermeture ciblée par chemin (nouvelle action `close-windows-targeting` dans `finder.applescript`).

### Incident data (résolu)

`appdata.yaml` de Phil réduit à 2 projets en cours de session (perte réelle des projets en standby dans `projects-in`, cause : le bug `getProjectsOrder` ci-dessus, déclenché en live pendant qu'un test tournait). Restauré manuellement avec les 6 vrais ids (cartes projet jamais touchées, toujours intactes sur disque). Fix du bug lui-même appliqué ensuite.
