---
name: never-sync-bundle-myself
description: jamais copier frontend/backend vers Board.app/Contents/Resources moi-même — c'est le job de Phil via update.command
metadata:
  type: feedback
---

Ne jamais copier de fichiers modifiés vers `Board.app/Contents/Resources/` (le bundle app). Même après un edit validé côté source, laisser le bundle intact.

**Why:** 2026-08-12, copie autonome de `Service.js`/`ERRORS.js` dans le bundle avant même que Phil ait pu vérifier et pousser lui-même — réaction très vive ("AVANT MÊME QUE JE PUISSE LES VÉRIFIER ET LES POUSSER MOI-MÊME"). `update.command`/rebuild du bundle est un geste de déploiement qui lui appartient, pas une simple synchro mécanique.

**How to apply:** Modifier uniquement les sources (`frontend/`, `backend/`). Ne jamais toucher à `Board.app/Contents/Resources/`, ni proposer/rappeler de le faire (cf. [[stop_repeating_bundle_sync_note]]).
