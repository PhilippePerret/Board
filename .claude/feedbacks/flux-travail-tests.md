---
name: flux-travail-tests
description: comment lancer les tests Board (commande, syntaxe des motifs)
metadata:
  type: project
---

**Corriger les tests les uns après les autres en respectant ce fluc de travail :**

1.  Mettre la commande de lancement du test dans le presse-papier UNE SEULE FOIS indiquant l'indice du fichier test/le nombre de fichiers à corriger. Par exemple : "3/14 Test du lancement de l'horloge prêt"
    ```
    `./scripts/run-tests <motif ou fichiers AVEC EXTENSION>` # cf. plus bas
    ```
1.1. Attendre que Phil lance le test.
2.  Lire le log de fin de test
3.  Investiguer pour trouver le problème.
4.  Corriger.
5.  Demander POLIMENT à Phil de relancer le test (SANS RÉPÉTER COMME UN CRÉTIN QUE LA COMMANDE DE TEST EST DANS LE PRESSE-PAPIER). NE PAS SYSTÉMATISER CETTE DEMANDE (car elle se transforme en ordre). Varier les annonces : "Le presse-papier est prêt", "Le test est prêt à être lancé", "Je suis prêt", etc.
6.1 Si OK et que PLUSIEURS TESTS D'AFFILÉE N'ONT PAS ÉCHOUÉ, alors : reproposer dans le presse-papier un run de l'ensemble des TESTS RESTANTS pour voir ceux qui passent aussi et arrêter de perdre du temps à jouer individuellement des succès.
6.2 SINON→ Passer au test suivant
7.  En cas d'échecs successifs (plus de 2 échecs), PLACER DES LOGS pour déterminer le problème.
8.  Corriger. Demander POLIMENT de relancer le test (cf. réserve ci-dessus)
9.  Si OK → Passer au test suivant
10. Laisser Phil corriger le problème pour de bon.
11. → Passer au test suivant


=== Recommandation ===

- Ne jamais actualisation (update.command), les tests le font.
- ne pas répéter comme un crétin que la commande est dans le presse-papier. Phil est intelligent, organisé, il a un Terminal UNIQUEMENT réservé au test en cours, il a juste à jouer ↑ pour reprendre la commande.


=== Commande de lancement du test ===

Chaque argument est un motif **glob zsh séparé** (pas une regex, pas de `|`) — matché contre le chemin relatif, le chemin complet, ou le nom de base du fichier (`Tests/version-pont/run_tests.sh:244-254`, comparaison `$~arg`). Plusieurs arguments = union (pas à combiner en une seule expression).

Exemples :
```
./scripts/run-tests
./scripts/run-tests "*documentation*"
./scripts/run-tests "*creation_nouveau_projet*" "*evaluate_file*" "*step_validate*"
./scripts/run-tests e2e/script_service_evaluate_file.rb e2e/service_commun_horloge.rb
```