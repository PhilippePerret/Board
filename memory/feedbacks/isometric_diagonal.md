---
name: feedback-isometric-diagonal-8-to-2
description: Diagonal 8h→2h en isométrique nécessite décalage X ET Y sur chaque pile, pas seulement X
metadata:
  type: feedback
---

Pour créer un axe diagonal "8h→2h" sur des piles isométriques déjà centrées, il faut décaler chaque pile EN X ET EN Y simultanément — pas uniquement en X.

**Why:** Décaler seulement en X déplace horizontalement mais ne crée pas la profondeur diagonale attendue. L'utilisateur a montré la solution : transform(+30,+40) sur la pile arrière, (-11,0) sur la pile milieu, (-51,-40) sur la pile avant.

**How to apply:** Pour un axe diagonal isométrique : pile avant → gauche+haut, pile arrière → droite+bas. Les deux composantes (x et y) ensemble créent le "angle" diagonal voulu visuellement.
