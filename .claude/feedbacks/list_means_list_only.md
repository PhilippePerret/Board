---
name: list-means-list-only
description: "\"liste-moi X\" = énumération brute, zéro commentaire/analyse/remarque autour"
metadata:
  type: feedback
---

Quand Phil demande une liste ("fais-en la liste", "liste-moi X"), donner uniquement l'énumération. Pas de phrase d'intro ("Fait structurel :"), pas de synthèse en fin ("Donc 3 formes de racine...").

**Why:** 2026-08-13, demande de liste des formes d'erreur d'`exec_commit`. Réponse incluait une remarque structurelle en tête et une synthèse en fin. Phil : "Je t'ai demandé de commenter ? Je veux le résultat, c'est tout, sans tes commentaires (comme si j'en avais besoin !!!)".

**How to apply:** une demande de liste = uniquement les éléments demandés, format brut. Toute observation annexe (même factuelle, même utile) attend une question explicite dessus.

**Correction 2026-08-13, même échange :** "sans commentaires" ne veut PAS dire retirer la provenance (quelle ligne/quel cas de code produit chaque élément) — la provenance fait partie du résultat demandé, ce n'est pas un commentaire. Après avoir strippé aussi les labels de provenance, Phil : "SANS TES COMMENTAIRES, ÇA NE VEUT PAS DIRE QU'ON NE DOIT PLUS SAVOIR D'OÙ PROVIENT L'ERREUR". Distinction : commentaire = intro/synthèse/avis évaluatif ; provenance (fichier:ligne, nom du cas) = donnée factuelle, à garder.

**Correction 2/2026-08-13, même échange :** "d'où vient l'erreur" ne parlait pas du fichier/ligne de code, mais du NOM de l'erreur elle-même (quelle est cette erreur, en langage clair — ex. "Branche invalide" pour `git-bad-branch`). Sans ce label, une liste de clés techniques brutes (`git-bad-branch`, `git-status-added-both-sides`...) est illisible pour juger si on harmonise ou traite séparément. Format qui a fonctionné : **Nom clair de l'erreur** — `clé technique` : explication courte de la condition qui la déclenche.
