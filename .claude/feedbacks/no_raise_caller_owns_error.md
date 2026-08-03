---
name: no-raise-caller-owns-error
description: architecture voulue — no_raise force ok:true côté backend, et c'est à chaque appelant de server.send de vérifier retour.error lui-même, jamais à xbridge.js
metadata:
  type: project
---

Dans `backend.rb`, `Retour#evaluated_ok` retourne `true` dès que `no_raise` est vrai, même si `error` est rempli — c'est voulu. `no_raise` sert à empêcher le mécanisme de raise/exception, PAS à garantir que l'erreur soit traitée quelque part.

Le traitement de `retour.error` est délibérément laissé à la charge de chaque appelant de `server.send(..., no_raise: true, ...)`, dans son propre callback — jamais centralisé dans `xbridge.js` (`server.send`/`bridge.call`). C'est un choix d'architecture assumé, pas un oubli.

**Why:** dit très sèchement le 2026-08-03, après une proposition (refusée avec force) de centraliser le check de `.error` dans `xbridge.js`. Le design existant est intentionnel.

**How to apply:** si un appelant de `server.send` avec `no_raise: true` ne vérifie pas `retour.error` dans son callback, c'est UN BUG LOCAL à cet appelant (à corriger à cet endroit précis), jamais une justification pour toucher à `xbridge.js` ou à `evaluated_ok`. Ne plus proposer de centralisation générique pour ce genre de cas.
