---
name: check-tdd-before-citing-failure
description: Vérifier si un test qui échoue est un TDD normal (fonctionnalité pas codée) avant de le citer comme preuve d'un bug
metadata:
  type: feedback
---

Avant de citer un test en échec comme preuve d'un bug, vérifier s'il s'agit
d'un test TDD écrit AVANT la fonctionnalité (rouge normal, pas une
régression). Indices : commentaire "Source : Tests/_tests_a_faire.adoc" en
tête du fichier spec, ou fonctionnalité testée absente du code actuel.

**Why:** le 2026-08-03, j'ai fait rejouer à Phil
`definition_genre_projet_valeur_libre.rb` comme preuve de la course
appdata/debounce — ce test échoue parce que le genre en valeur libre n'est
juste pas encore codé (seul `select` existe), aucun rapport avec le bug
qu'on traquait. Phil : "tu voudrais un succès à quelque chose qui doit
échouer".

**How to apply:** avant d'invoquer un `✗` comme preuve d'un bug précis,
lire l'en-tête du fichier spec + vérifier que le comportement attendu est
bien implémenté dans le code actuel. Ne pas supposer qu'un échec = bug
juste parce qu'il est survenu après l'action suspectée.
