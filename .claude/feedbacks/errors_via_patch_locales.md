---
name: errors-via-patch-locales
description: nouvelle clé ERRORS/MESSAGES passe par PATCH_LOCALES.js, jamais édition directe d'un fichier locales/<lang>/
metadata:
  type: feedback
---

Toute nouvelle entrée ERRORS ou MESSAGES s'ajoute dans `frontend/locales/PATCH_LOCALES.js` (bloc `Object.assign(ERRORS,...)` ou `Object.assign(MESSAGES,...)`), jamais directement dans `frontend/locales/<lang>/ERRORS.js` ou `MESSAGES.js`.

**Why:** 2026-08-12, édition directe de `fr/ERRORS.js` pour une nouvelle clé a désynchronisé cette langue des autres locales (en/es/de/it/zh/ko/hi) qui passent toutes par le même point d'entrée `PATCH_LOCALES.js`. Réaction très vive de Phil.

**How to apply:** Avant d'ajouter une clé ERRORS/MESSAGES, ouvrir `frontend/locales/PATCH_LOCALES.js`, l'ajouter dans le bloc correspondant. Ne jamais toucher aux fichiers sous `frontend/locales/<lang>/` directement.
