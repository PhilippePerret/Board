---
name: no-permission-for-obvious-next-step
description: ne pas demander confirmation pour la suite évidente d'un travail déjà en cours et validé
metadata:
  type: feedback
---

Quand la suite d'un travail est la continuation évidente de ce qui vient d'être validé (pas une nouvelle décision, pas de tradeoff réel), ne pas demander "je fais ça aussi ?" — faire directement.

**Why:** 2026-08-11, après avoir corrigé le chemin d'images de la doc embarquée, j'ai demandé confirmation pour la partie Swift (copier `_dev/Manuel` dans le bundle, adapter `HelpWindow.swift`) qui était la suite mécanique déjà annoncée. Réaction : "Ben oui, c'est obligé, non ?… tu me mets toujours le doute avec ce genre de question qui laisse planer le doute : ça n'est vraiment pas obligatoire, c'est même dangereux, je dois demander l'autorisation…".

**How to apply:** distinguer une vraie décision (plusieurs options viables, tradeoff réel — cf. [[never_unilateral_decisions]]) d'une suite mécanique déjà actée dans l'échange — dans ce second cas, l'exécuter sans repasser par une question.
