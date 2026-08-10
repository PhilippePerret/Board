---
name: etat-2026-08-08
description: vérification finale avant présentation publique de Board — tests, localisation, doc, plan de diffusion
metadata:
  type: project
---

Prochaine session, dans l'ordre donné par Phil :

1. Config minimale (`CONFIG.md` fait, 2 bugs de portabilité corrigés — chemins Homebrew en dur dans `OpenInVscode.sh`/`UpdateDocumentation.rb`). Décidé le 2026-08-09 : Board va se distribuer en `.dmg` — embarquer un Ruby portable dans `Board.app` (au lieu du `~/.rbenv/versions/3.4.7/bin/ruby` en dur, `Backend.swift:13`, qui casse si cette version précise n'est pas installée chez l'utilisateur). Pas encore implémenté. Note : partir du document indigeste (Claude) `CONFIG.md` pour en faire une section courte et compréhensible pour le `README.md`.
2. Rédiger une page README par langue supportée (`fr, en, it, de, es, zh, ko, hi`, cf. `frontend/index.html` `SUPPORTED`), pour la présentation GitHub du projet.
3. Élaborer un plan d'action pour faire connaître l'application.
