---
name: 2026-07-22-etat-fin-de-session
description: état daté 2026-07-22 — validate() avancé, 2 bugs backend evaluate_file.rb non corrigés, tests pas tous rejoués
metadata:
  type: project
---

- `ServStep#validate()` (`frontend/js/ScriptService.js`) retravaillé. Dernier run vert connu : `tests/resultats/2026-07-22_09h44.log`. Des cas ajoutés dans `Tests/specs/e2e/script_service_step_validate.rb` après ce run (multi-type `select`/`values`) — pas rejoués depuis.
- `backend/lib/evaluate_file.rb:6` — `def slef.evaluate path` (typo, `slef`/`self`) : `evaluate-file` échoue toujours, tous formats. Non corrigé.
- `backend/lib/evaluate_file.rb:19,24` — `RETOUR.error(...)` au lieu de `RETOUR.error = ...` (attr_accessor). Non atteint tant que le bug au-dessus n'est pas corrigé.
- `Tests/specs/e2e/script_service_evaluate_file.rb` : nouveau, jamais lancé.
- `Tests/version-pont/run_tests.sh` : option `--no-overlay` ajoutée, fonctionnelle.
- Ouverts, non traités (reporté du 21/07) : mini-langage de dates, politique erreur décisive/non-décisive, `where: :end/:beginning`.
