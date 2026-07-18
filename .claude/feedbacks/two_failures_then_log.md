---
name: feedback-two-failures-then-log
description: après 2 échecs sur le même problème, poser des logs aux points clés du VRAI chemin d'exécution et retrouver la cause soi-même, pas relancer un 3e essai à l'aveugle
metadata:
  type: feedback
---

Après 2 tentatives de correction infructueuses sur le même problème, ne pas proposer un 3e correctif ni une reproduction manuelle à côté (un script ad-hoc, hors du vrai chemin testé) : instrumenter le VRAI chemin d'exécution (celui que le test réel emprunte) avec des logs aux points clés, obtenir la donnée manquante en un seul run ciblé, puis en déduire la cause — sans faire perdre de temps à l'user avec des cycles essai/erreur.

**Why:** Simplement pour travailler intelligemment, si je peux.

**How to apply:** dès le 2e échec constaté sur le même point, arrêter d'itérer des correctifs candidats. Ajouter des logs (`Debug.log` côté Ruby, `do shell script "echo ... >> ..."` côté AppleScript, etc.) directement dans le code réellement exercé par le test qui échoue — pas une simulation à côté. Cf. [[close_debug_windows]] pour la discipline de nettoyage associée à toute manipulation manuelle de fenêtres pendant ce diagnostic.
