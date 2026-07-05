---
name: feedback-no-overwrite-variants
description: Ne jamais écraser l'original quand on fait des variantes — créer un nouveau fichier
metadata:
  type: feedback
---

Quand l'utilisateur demande des déclinaisons ou modifications d'un fichier existant, créer un NOUVEAU fichier (-v2, -v3, -alt, etc.). Ne jamais écraser l'original.

**Why:** L'utilisateur veut garder l'original pour comparer.

**How to apply:** Variante de `foo.svg` → `foo-v2.svg`. Jamais écraser `foo.svg`.
