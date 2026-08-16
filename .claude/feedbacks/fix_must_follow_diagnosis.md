---
name: feedback-fix-must-follow-diagnosis
description: une fois la cause racine identifiée correctement, la correction proposée doit en découler directement — pas une improvisation à côté
metadata:
  type: feedback
---

Quand le diagnostic (cause racine) est correct, la correction proposée doit s'appuyer dessus directement — pas partir sur une idée à côté qui contourne le symptôme sans traiter la cause identifiée.

**Why:** Sur le bug `Prompter.js#promptProject` (saves concurrents non ordonnés qui s'écrasent), diagnostic correct posé, mais première proposition = juste supprimer l'appel `save()` en pariant qu'une autre sauvegarde plus tard s'en chargerait — sans lien réel avec la cause (l'absence de séquencement), et qui aurait perdu la donnée dans les cas où aucune autre sauvegarde ne suit. Phil : "de quoi tu parles ?" + "tu as en tout cas une faculté naturelle à ne pas régler les problèmes proprement [...] tu le dis toi-même : save est appelée sans callback, alors qu'elle est censée recevoir un callback justement pour pallier ce genre de problème" — la solution était déjà DANS le diagnostic (le callback existant, jamais utilisé), pas ailleurs. Confirmé après coup : "Mais rappelle-toi qu'à nouveau [...] bon diagnostic et, au lieu de t'appuyer dessus, tu proposes n'importe quoi."

**How to apply:** Après avoir posé un diagnostic, avant de proposer un fix, se demander explicitement : "qu'est-ce que CE diagnostic précis implique comme correction, mécaniquement ?" — si le diagnostic identifie un mécanisme absent (ex. un callback jamais utilisé, une garde jamais posée), la correction est d'ajouter CE mécanisme précis, pas une solution de contournement qui laisse la cause intacte.
