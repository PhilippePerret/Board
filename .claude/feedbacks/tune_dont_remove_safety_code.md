---
name: tune-dont-remove-safety-code
description: quand l'user râle contre le SYMPTÔME d'un garde-fou (ex. un timeout trop court), ne pas supprimer le garde-fou — proposer/faire un réglage
metadata:
  type: feedback
---

Quand Phil se plaint d'un comportement produit par un mécanisme de protection (ex. "TIMEOUT SCRIPT (> 8s)" qui coupe des scripts légitimes trop lents), il ne demande pas forcément de supprimer la protection elle-même — il peut juste vouloir un réglage plus raisonnable (ex. augmenter la durée).

**Why:** 2026-07-19, `backend/lib/usefull.rb` — `SCRIPT_TIMEOUT` (garde-fou empêchant un script bloqué de geler toute l'app, le pont Swift/Ruby étant synchrone) supprimé sur demande explicite ("TU ME VIRES CETTE MERDE"), corrigé juste après : il fallait l'augmenter (8s → 30s, en gardant une constante en haut de fichier), pas le retirer. La protection elle-même n'a jamais été remise en cause.

**How to apply:** face à une plainte sur un effet de bord d'un garde-fou, même formulée sèchement/en ordre direct de suppression, il reste possible que la bonne réponse soit d'ajuster la valeur plutôt que d'éliminer le mécanisme — regarder si un réglage existe avant de tout retirer. Si l'ordre de suppression est sans ambiguïté, l'exécuter (ce n'est pas une raison de désobéir), mais rester prêt à revenir dessus si la vraie demande était un réglage.
