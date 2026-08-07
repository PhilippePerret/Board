---
name: 2026-08-06-etat-fin-de-session
description: PRIORITÉ demain — référence circulaire ParamDefiner à corriger (crash évité côté Swift mais pas éliminé côté JS), objectif demain = faire passer tous les tests pour mise en production
metadata:
  type: project
---

# À reprendre EN PREMIER demain

- **Référence circulaire dans `ParamDefiner.js#promptSpec()`** (ligne ~197) :
  `definers: this.paramLister.definers` inclut les instances `ParamDefiner`
  complètes, chacune ayant `this.paramLister` qui pointe vers l'objet qui
  contient CE tableau — cycle direct. A causé un crash natif réel (stack
  overflow, `Bridge.swift`, rapport système
  `~/Library/Logs/DiagnosticReports/Board-2026-08-06-172912.ips`) lors d'un
  test du nouveau paramètre `repeat` sur le service `git-commit`.
  - Le crash lui-même est neutralisé (`Bridge.swift:22-24` ne fait plus
    `print("...\(body)")` sur un objet qui a échoué `isValidJSONObject` —
    remplacé par un log des clés seulement).
  - MAIS le cycle existe toujours côté JS — pas éliminé, juste rendu
    inoffensif pour CE point de crash précis. Fix proposé (pas fait) :
    remplacer par `this.paramLister.definers.map(d => d.value)` — le seul
    usage existant de `spec.definers` (`Prompter.js:65-66`,
    `useLastAsDefault`) ne lit que `.value`, donc le tableau de valeurs
    suffit, casse le cycle.
  - Pas trouvé avec certitude le point exact où cette structure part vers
    `postMessage`/le bridge — seulement confirmé qu'elle existe et qu'un
    des chemins qui la porte (`Prompter.promptSelect`, via
    `Object.assign({}, spec, ...)`) copie le spec entier avec `.definers`
    inclus dans les données du `SelectDialog`.

- **`backend/lib/git.rb` / `backend/scripts/GitOpes.rb`** : corrigés
  aujourd'hui (boucle de suppression des labels sans `done`, jamais fermée ;
  codes de sortie vérifiés dans `git_init` et `update_labels` au lieu
  d'avaler silencieusement). Pas encore re-testé en conditions réelles
  après le fix (le crash a interrompu le test avant).

- **Réglage `remember-last-project`** : reparti sur sa valeur par défaut
  (`false`) suite à la perte de config du jour — Phil veut que ce défaut
  passe à `true`. Pas fait.

- **Build Swift en attente** : le fix de `Bridge.swift` nécessite
  `build.sh` (recompilation), pas juste `update.command`.

# Objectif demain

Faire passer tous les tests restants pour amener l'app en production. On
arrive au bout du gros du travail — la suite, ce sont des petites
corrections au fil de l'eau plutôt que des refontes.

Restait en échec en fin de session (dernier état connu, pas forcément à
jour vu le crash) :
- `creation_simple_nouveau_projet.rb` (dé-préfixé de `_isolated_`
  aujourd'hui, jamais re-testé après)
- `tools_panel.rb` (pas investigué)
- `todoist_flux_tasksdialog_reel.rb` (connu, pas lié aux sessions récentes)

# Contexte (pas à refaire)

- Bug de fond trouvé et corrigé sur plusieurs tests aujourd'hui : course
  entre "sélectionner un fichier dans Finder" et "lire la sélection" côté
  test — `with_finder_selection` fermait la fenêtre Finder avant que la
  lecture asynchrone (côté app) ait fini. Corrigé au cas par cas
  (`service_custom_run_script.rb`, `service_dynparams_file_versioning.rb`,
  `service_commun_update_documentation_erreur.rb`,
  `creation_nouveau_projet_selection_fichier.rb`) en déplaçant l'attente à
  l'intérieur du bloc `with_finder_selection`. Pas généralisé dans le
  helper lui-même (proposé par Phil, pas implémenté).
- Bug de fond corrigé dans l'app : `afterDefinedParams` (`open-folder-project`,
  `open-a-file`, `ServiceData.js`) mutait en place les tableaux persistés au
  lieu de copier — fuite de transformation dans le stocké.
- Bug corrigé : `Dialogs.js` — comparaison `'function' == data.ouiBtn.onclick`
  (toujours fausse) au lieu de `typeof ... == 'function'` — cassait le
  bouton "Corriger" d'ErrorsDialog.
- Incident sérieux : perte de la config perso réelle (appdata + tous les
  projets) suite à une interruption de tests non catchée par le trap du
  script. Corrigé structurellement : `Tests/version-pont/run_tests.sh`
  garde maintenant une copie CONSERVÉE (pas déplacée) de la config avant
  chaque run, dans `Tests/.board-backups/persos/` (20 dernières gardées),
  avec détection de pollution par des données de test avant toute
  sauvegarde.
