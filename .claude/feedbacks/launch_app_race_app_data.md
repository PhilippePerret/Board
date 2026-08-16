---
name: launch-app-race-app-data
description: pattern récurrent — un test qui clique juste après ouverture de Board.app peut planter une callback JS silencieusement, avant que App.data soit chargé
metadata:
  type: project
---

`btn-add-project` (et tout bouton statique avec `onclick=` inline dans `index.html`) est présent dans le DOM dès le parse — bien avant que `App.data` existe (rempli seulement dans `App.init(retour)`, à la réponse async de l'action `load-all`). `launch_app` (Tests/support/helpers_base.rb) attend maintenant explicitement `App.data != null` en plus de la présence du bouton, avant de rendre la main.

**Symptôme type** si un test clique trop tôt : timeout `wait_for_suffix`/`wait_for_prefix` sans autre message utile. La vraie cause est une exception JS dans le handler cliqué (ex. `App.getData('projects-out').length` sur `App.data` encore `undefined`) — invisible en temps normal car un `onclick=` inline fait rapporter à `window.onerror` un "Script error." générique, sans fichier ni ligne, par WebKit.

**Comment le diagnostiquer si ça revient** (pour un autre bouton/callback) : installer `window.onerror` en tout début de spec (`window.__errs=[];window.onerror=function(m,s,l,c,e){window.__errs.push(m)};''` — bien terminer par une valeur sérialisable, `evaluateJavaScript` refuse une fonction en retour), puis dumper `window.__errs` si le `wait_for_*` qui suit time out.

**Trouvé le 2026-08-16** sur `_isolated_creation_nouveau_projet_selection_fichier.rb` (1er spec du run entier — le seul assez tôt pour taper dans la fenêtre de course). Fix appliqué dans `launch_app` uniquement — n'importe quel autre spec qui l'appelle en bénéficie automatiquement.
