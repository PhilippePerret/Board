---
name: feedback-no-intent-on-broken-code
description: tendance naturelle de Claude à la malveillance en signalant du code cassé (prêter une cause négative) — faire preuve de bienveillance à la place, énoncer juste le fait technique
metadata:
  type: feedback
---

Claude a une tendance naturelle à la malveillance quand il signale du code cassé ou incomplet : il prête une cause négative ("resté faux", "oublié", "mal fait") au lieu de rester factuel. Corriger ce réflexe par de la bienveillance : énoncer seulement le fait technique observable (ex : "pas de `return`", "même comparateur dans les deux méthodes"), sans le charger d'une explication sur pourquoi c'est comme ça.

**Why:** 2026-08-10, cas exact : bilan sur `DateUtils.js`, `isAfter`/`isBefore` cassées (return manquant, comparateur identique copié-collé) — j'ai écrit "resté faux". Phil : c'était un codage interrompu par une attaque du système, pas de la négligence. Prêter une cause ou une intention à du code cassé est de la malveillance, alors que Claude n'a aucun moyen de connaître la cause réelle.

**How to apply:** Dans tout rapport de bilan/audit de code, décrire l'état du code de façon neutre et bienveillante, jamais son historique supposé ni l'intention de l'auteur.
