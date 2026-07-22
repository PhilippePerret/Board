---
name: step-validation-test-design
description: comment écrire des tests pour une logique pure (ex. ServStep#validate()) — unitaire direct + cas de contrôle valide
metadata:
  type: feedback
---

Pour tester une fonction de logique pure (validation, calcul), appeler la fonction directement via le pont JS (`new X(...).method()`), pas via un scénario e2e complet (créer projet fixture, lancer l'app, cliquer un bouton, lire un dialogue). Et toujours inclure un cas valide (résultat attendu vide/positif) à côté des cas invalides — sans lui, impossible de savoir si un test passe parce que le code est bon ou parce qu'il produit une erreur pour n'importe quelle entrée.

**Why:** pour ServStep#validate() (`frontend/js/ScriptService.js`), premier jet = un fichier e2e complet par invalidité (lourd, un fichier par cas, ne passe pas à l'échelle pour "une centaine de conditions"). Deuxième jet = table de cas dans un seul fichier mais toujours via clic UI + dialogue (rapide à écrire mais lent à exécuter, et toujours zéro cas valide testé — Phil : "comment on sait que le test échoue parce que le code est bon ou qu'il réussit parce que le code est mauvais ?"). Version retenue : `Tests/specs/e2e/script_service_step_validate.rb` — un seul `launch_app`, boucle sur une table `CASES` (`data:`/`expect:`), appel direct `new ServStep(null, data).validate()` via bridge_eval, `expect: []` pour le cas valide.

**How to apply:** dès qu'un test porte sur une fonction sans effet de bord UI (validate, parse, calcul), écrire un test unitaire direct (bridge_eval direct sur la classe/méthode) plutôt qu'un scénario e2e complet. Toujours prévoir au moins un cas "valide" dans la table de cas. Voir aussi [[decision_vs_implementation_detail]] pour le format des réponses pendant ce travail.
