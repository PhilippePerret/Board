---
name: 2026-07-21-etat-fin-de-session
description: état daté 2026-07-21 — script-service (ScriptService.js/ServStep/ScriptServiceData.js) démarré, un seul type d'étape (create-folder) câblé, test pas confirmé passant
metadata:
  type: project
---

- Nouvelle feature "script-service" (YAML décrivant une suite d'étapes, `run-script-service` dans `ServiceData.js`, `front: ScriptService.run`) : squelette posé — `frontend/js/ScriptService.js` (`ScriptService`/`ServStep`), `frontend/js/ScriptServiceData.js` (`SCRIPT_SERVICES_KNOWN_TYPES`, un seul type défini : `create-folder`), backend `load-yaml-file` + `create-folder` dans `backend/backend.rb`. Un seul test : `Tests/specs/e2e/script_service_create_folder.rb` — **pas confirmé passant**.
- `ServiceExecuter.js`/`Service.js`/`Project.js` : `front` unifié dans `finalyExec()`, plus aucune distinction attaché/panneau, custom/commun — confirmé fonctionnel en live par Phil.
- Beaucoup de points de conception encore ouverts (mini-langage de dates, `values:` pointant vers un fichier yaml avec `key_values`/`title_values`, `where: :end/:beginning`, politique erreur décisive/non-décisive) — pas du tout implémentés, feature tout juste commencée.
