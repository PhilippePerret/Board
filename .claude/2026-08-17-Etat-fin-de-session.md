---
name: etat-fin-de-session-2026-08-17
description: Suite Board — bugs de tests diagnostiqués non corrigés, PR Cycle toujours en échec
metadata:
  type: project
---

## Tests diagnostiqués, PAS ENCORE corrigés dans le code

- `Tests/specs/unit/date_utils_extract_hour_from.rb` : attend "9:05", le code retourne correctement "9:5" (pas de zéro de padding dans le test) — corriger le test.
- `Tests/specs/unit/exec_command_gh_sans_depot_git.rb` : `data['error']` est `["backend-not-a-git-repo", pwd]` (tableau), le test fait `=~` dessus comme une string — corriger le test.
- `Tests/specs/unit/todoist_close_tasks_partial_failure.rb` : `errors.first` est `["backend-task-error", ["b", "..."]]`, `.include?('b')` ne descend pas dans le tableau imbriqué — corriger le test.
- `backend/lib/syntax_checker.rb:52` : `rel` utilisé dans `check_files` mais seulement défini dans `check_file` — `NameError` réel, à corriger dans le code.

## Fonctionnalité manquante

- `Todoist.close_and_create_tasks` n'existe pas (3 tests unitaires l'attendent) — seuls `close_tasks`/`create_tasks` séparés existent.

## Pas trouvé du tout

- "unexpected character: 'Saving' at line 1 column 1" — pollue `Tests/specs/unit/git_commit_sans_depot_git.rb` + 18 échecs `pr_cycle_init_*`/`pr_cycle_commit_*.rb`. Texte "Saving session…/…saving history…truncating history files…" injecté dans la sortie capturée du process ruby testé, origine non identifiée en lecture statique.
- `Tests/specs/e2e/spinner_cycle_start_continue_stop.rb` : texte reste "Application prête." au lieu de "trois" — course suspectée avec le cycle Spinner de démarrage de l'app, pas confirmée.
- 10 `pr_cycle_submit_*.rb` (réseau réel) : `pr_cycle_submit_echec_merge.rb` bloqué par une limite de plan GitHub (protection de branche impossible sur dépôt privé en plan gratuit) — pas un bug de code, à vérifier si le dépôt de test doit être public. Les 9 autres pas encore réexaminés un par un.

## Objectif priorité initial pas atteint

- Suite complète (144 tests e2e) : le seul échec (lockSave) est corrigé et vérifié.
- Tests unitaires (nouvellement inclus dans le run par défaut) + PR Cycle (39 fichiers) : toujours des échecs listés ci-dessus, jamais tous passés ensemble.
