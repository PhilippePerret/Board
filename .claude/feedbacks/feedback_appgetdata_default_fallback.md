---
name: appgetdata-default-fallback
description: App.getData() doit retomber sur le default localisé déclaré dans AppData.js si la clé est absente d'appdata.yaml
metadata:
  type: feedback
---

`App.getData(key)` (frontend/js/app.js) doit retomber sur `TBL_APP_DATA[key]?.default` (déclaré dans frontend/js/AppData.js) quand la clé est absente d'appdata.yaml persisté — jamais renvoyer `undefined` brut.

**Why:** appdata.yaml ne contient que les clés que l'utilisateur a effectivement enregistrées via le dialogue de config. Un réglage jamais touché (ex. `docu-folder-name`, `docu-main-edit-file`, `docu-main-disp-file` avant ce fix) résolvait silencieusement en `undefined`, sérialisé en `null`→`''` à travers le pont JS→Ruby — cassant des scripts backend de façon qui semblait sans rapport avec la cause réelle (ex. `init-documentation` échouait systématiquement avec "Le dossier existe déjà", quel que soit le dossier choisi, parce que le nom de dossier vide faisait vérifier au script l'existence du conteneur lui-même au lieu d'un sous-dossier). Phil avait déjà demandé ce fix dans une session précédente ; une tentative bancale et jamais branchée (`AppData.get`, référençant une variable `prop` non déclarée) traînait dans AppData.js — supprimée comme code mort, le fallback vit maintenant directement dans `App.getData`.

**How to apply:** en ajoutant un nouveau réglage app-level dans `AppData.js` avec un `default`, faire confiance à `App.getData(id)` pour renvoyer ce default automatiquement si non défini — pas besoin que l'appelant fasse `App.getData(id) ?? xxx` lui-même.
