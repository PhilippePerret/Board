---
name: ok-true-false-convention
description: ok:false = erreur générique xbridge.js, ok:true+error = géré par la fonction appelante elle-même, pas un bug
metadata:
  type: feedback
---

`ok:false` → erreur générale traitée automatiquement par `xbridge.js`. `ok:true` + `error:` renseigné → erreur spéciale que la fonction appelante traite elle-même, mécanisme pouvant ne pas encore être branché.

**Why:** review de `PR_Github_Cycle.rb#exec_commit`, `retour[:ok] = true` sur erreur signalé à tort comme bug. Phil : deux mécanismes voulus, codage progressif autorisé.

**How to apply:** ne pas signaler `ok:true`+`error` comme incohérence, ni un branchement frontend absent comme manquant. Conséquence côté frontend : `ServiceExecuter.afterRunService` ne teste que `retour.error` (jamais `retour.ok`) — c'est volontaire, un `ok:false` est intercepté plus haut par `xbridge.js` et n'atteint jamais ce callback, donc tester `ok` ici serait redondant.
