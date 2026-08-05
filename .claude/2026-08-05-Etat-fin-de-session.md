---
name: 2026-08-05-etat-fin-de-session
description: Validator.repeat/Validator.dateAfter abandonnés en cours de route, à reprendre — pas urgent, pas fait aujourd'hui
metadata:
  type: project
---

# À reprendre

- **`frontend/js/Validator-fr.js`** : `Validator.repeat` et `Validator.dateAfter`
  (validation des champs "répétition"/"deadline" d'une tâche Todoist,
  `TasksDialog#_validateByKey`) ont été abandonnés en cours de route par
  Phil (parti sur autre chose) :
  - `Validator.dateAfter` (ligne ~116-120) : `var err` déclaré mais jamais
    assigné → la fonction ne fait rien, toujours "valide" quelle que soit
    la comparaison. Son seul appelant (`_validateByKey`, cas `deadline`)
    lui passe en plus un commentaire littéral (`'/* on doit avoir la date
    start */'`) au lieu de la vraie date `due` — à corriger aussi une fois
    la fonction elle-même terminée.
  - `Validator.repeat` (ligne ~108) : référence `valInit`, jamais déclarée
    → `ReferenceError` si le format "repeat" saisi est invalide (plante au
    lieu d'afficher l'erreur).
  Confirmé par Phil (2026-08-05) : pas un souci de test, du code abandonné.
  Pas corrigé aujourd'hui (trop de travail pour le faire maintenant selon
  Phil) — à reprendre quand il aura le temps.

# Contexte (pas à refaire)

- Plan de tests des fonctionnalités sans couverture e2e terminé :
  `Tests/_plan_tests_fonctionnalites.adoc`, 25 points, tous traités
  (22 tests écrits, 2 bugs préexistants trouvés et corrigés en cours de
  route — `Notifier.teinte()` sans `return`, `FileVersioning.rb`/
  `ServiceData.js` désynchronisés sur les ARGV — et id ajoutés aux poignées
  `SidePanel` pour permettre un test de glissé réel).
- Aucun des 21 nouveaux fichiers de test n'a été lancé par Claude (règle
  du projet) — à faire tourner par Phil.
