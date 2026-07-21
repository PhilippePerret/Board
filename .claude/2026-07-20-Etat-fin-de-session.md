---
name: 2026-07-20-etat-fin-de-session
description: état daté 2026-07-20 — horloge (fixes + tests écrits, pas lancés), moteurs de test réduits à 'pont' (pas relancé), panneau "Outils" nouveau (bug toggle en cours de résolution par Phil lui-même, pas confirmé réparé)
metadata:
  type: project
---

- Horloge (Clock.js/clock.css) : tous les points demandés traités dans la session — redimensionnement (poignées dédiées, ancrage bas du panneau sur le footer, limite haute dynamique contre le header), pixelisation corrigée (calc() natif au lieu de transform:scale), pictos CSS pour Start/Pause/Restart/Stop, refonte complète des listeners de clic sur demande explicite (plus aucun `'click'`, tout en `mousedown`/`mouseup` avec comparaison de cible), bug Stop→Annuler corrigé (`pauseStart` jamais posé), bouton service qui toggle ouverture/fermeture. Tests écrits : `Tests/specs/e2e/service_commun_horloge.rb` (étoffé), `service_commun_horloge_redimensionnement.rb`, `service_commun_horloge_glisses.rb` (nouveaux). **Pas encore lancés.**
- `appdata.json` → `appdata.yaml` (backend + `Tests/support/helpers_base.rb`, ce dernier trouvé cassé en cours de route et corrigé).
- Moteurs de test : `Tests/version-swift/` et `Tests/support/ax.applescript` détruits sur demande explicite (confirmé : 'pont' est déjà le moteur réel par défaut via `scripts/run-tests`). `helpers_base.rb`/`helpers.rb`/`version-pont/run_tests.sh` nettoyés en conséquence. **Pas relancé pour vérifier que rien n'est cassé.**
- Panneau "Outils" (nouvelle feature, 1er outil : position+taille de fenêtre d'une appli choisie → presse-papier) : `ToolsPanel.js`/`ToolsData.js`/`Tools.js` + backend (`list-running-apps`, `get-app-window-bounds`, scripts `GetRunningApps.scpt`/`GetAppWindowBounds.scpt`) + lien header `#tools-button` (renommé depuis `tools-link`, note de clarté de Phil). Test écrit : `Tests/specs/e2e/tools_panel.rb`.
  - BUG rencontré : après passage de `#app-name`/`#tools-button` à `.toggle()` (au lieu de `.open()`), plus rien ne s'ouvrait (ni AppData ni Tools) — cause non trouvée par Claude (syntaxe vérifiée propre, logique static/instance `toggle()` testée directement en Node, rien d'incohérent relu). Phil a commencé à corriger lui-même directement dans `App.js` (ajout de `static get appDataPanel()`/`toolsPanel()`, instances cachées, `.toggle()` appelé dessus plutôt que sur la classe) — **pas confirmé réparé, session coupée avant test live**.
  - `Tests/specs/e2e/tools_panel.rb` référence les ids `tools-button`/`tool-app-window-bounds`/`__tools_app_window_bounds__` — à revérifier une fois le fix de Phil stabilisé (pas retouché depuis son edit sur App.js).
- Rien de tout ça n'a été testé en live par Claude (conforme aux règles : c'est Phil qui lance/vérifie).
