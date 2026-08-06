---
name: running-tests
description: comment lancer les tests Board (commande, syntaxe des motifs) + règles du flux d'exécution (pas de sync manuelle)
metadata:
  type: project
---

Commande pour lancer les tests (depuis la racine du repo, `/Users/philippeperret/Programmes/Board`) :

```
./scripts/run-tests <motifs ou fichiers, un par argument, séparés par des espaces>
```

Sans argument : toute la suite (`Tests/specs/e2e/*.rb`).

Chaque argument est un motif **glob zsh séparé** (pas une regex, pas de `|`) — matché contre le chemin relatif, le chemin complet, ou le nom de base du fichier (`Tests/version-pont/run_tests.sh:244-254`, comparaison `$~arg`). Plusieurs arguments = union (pas à combiner en une seule expression).

Exemples :
```
./scripts/run-tests
./scripts/run-tests "*documentation*"
./scripts/run-tests "*creation_nouveau_projet*" "*evaluate_file*" "*step_validate*"
./scripts/run-tests e2e/script_service_evaluate_file.rb e2e/service_commun_horloge.rb
```

`-v <logiciel>` (n'importe où dans les arguments) change de moteur de test (défaut : `pont`, dossier `Tests/version-pont/`).

**Why:** `./scripts/run-tests` est un wrapper fin autour de `Tests/version-pont/run_tests.sh`. Erreur commise le 2026-07-26 : j'ai d'abord donné la syntaxe interne de `run_tests.sh` au lieu du wrapper, PUIS donné une regex avec `|` en pensant que c'était supporté — ça ne matche que du glob zsh (`*`), et chaque motif doit être un argument séparé, pas concaténé.

**How to apply:** quand Phil demande de lancer les tests (ou un sous-ensemble), toujours utiliser `./scripts/run-tests <motif>`, jamais appeler `Tests/version-pont/run_tests.sh` directement. Pour plusieurs tests : un motif glob (`*mot*`) par argument, jamais une regex avec `|`.
