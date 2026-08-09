---
name: flux-travail-tests
description: comment lancer les tests Board (commande, syntaxe des motifs)
metadata:
  type: project
---

**OBLIGATION FORMELLE** DE RELIRE CE FICHIER APRÈS CHAQUE CORRECTION EFFECTUÉE

**Corriger les tests les uns après les autres en respectant ce fluc de travail :**

1.1 Indiquer pour commencer : Indice fichier test / nombre fichiers à corriger. Par exemple : "3/14 Test du lancement de l'horloge prêt"
1.2  Lorsque Phil le demande, ET SEULEMENT LORSQUE PHIL LE DEMANDE, mettre la commande de lancement du test dans le presse-papier. NE JAMAIS LA REMETTRE, JAMAIS.
    ```
    `./scripts/run-tests <motif ou fichiers AVEC EXTENSION>` # cf. plus bas
    ```
2.1 Pendant que Phil lance le test, écrire en console un aperçu du test, sous la forme décrite ci-dessous à "APERÇU DU TEST"
3.  Dès que Phil a signalé la fin du test par un "ok" ou autre formule, LIRE LE LOG de fin de test
4.  Investiguer pour trouver le problème.
5.  Proposition des corrections et les appliquer si autorisations.
6.  Dire "Fini." Rien d'autre — pas "prêt", pas de "tu peux relancer le test", rien, juste "fini"
7.  SI PLUSIEURS TESTS D'AFFILÉE N'ONT PAS ÉCHOUÉ, alors Phil va certainement demander la commande pour rejouer ensemble les tests restants, pour garder seulement ceux qui échouent encore, plutôt que de perdre du temps à les repasser un par un.
8.  SINON → Passer normalement au test suivant
9. En cas d'échecs successifs sur le même test (plus de 2 échecs), PLACER DES LOGS pour déterminer le problème.
10. Corriger. 
11. Dire "Fini", pas autre chose.
12. Si OK → Passer au test suivant
13. Si PAS OK → Laisser Phil corriger le problème pour de bon.
14. → Passer au test suivant


=== Recommandation ===

- Ne jamais actualiser (update.command) et encore moins demander à Phil de le faire (Phil n'est pas ton esclave, c'est toi qui est le sien). Et de touts façons, les tests le font automatiquement.
- ne pas dire comme un crétin que la commande est dans le presse-papier. Phil le voit.

=== Commande de lancement du test ===

Chaque argument est un motif **glob zsh séparé** (pas une regex, pas de `|`) — matché contre le chemin relatif, le chemin complet, ou le nom de base du fichier (`Tests/version-pont/run_tests.sh:244-254`, comparaison `$~arg`). Plusieurs arguments = union (pas à combiner en une seule expression).

Exemples :
```
./scripts/run-tests
./scripts/run-tests "*documentation*"
./scripts/run-tests "*creation_nouveau_projet*" "*evaluate_file*" "*step_validate*"
./scripts/run-tests e2e/script_service_evaluate_file.rb e2e/service_commun_horloge.rb
```


APERÇU DU TEST

```
«««««««««««««««««««««««««««««««««
<ce que le test est censé testé, en 20 mots max>
<liste des actions successives avec : 
<numéro> <action (10 mots)> <ok ou problème>>
<conclusion synthétique>
>
»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
```

Par exemple : 

```
Test vérifiant la persistance de la redéfinition des durées pour l'horloge

1. Crée projet fixture avec service horloge (session=90 mns, travail=30 mns) — ok
2. Lance l'appli — ok
3. Sélectionne le projet — ok
4. Meta-clic sur le service pour le redéfinir — ok
5. Fenêtre nom → clique "Oui" — ok
6. Fenêtre durée session : attendu 90, reçu 90 — ok
7. Tape 100 → clique "Oui" — ok
8. Fenêtre durée travail : attendu 100 (reprise), reçu 100 — ok
9. Clique "Oui" — ok
10. Carte projet : attendu [100, 100], reçu [90, 30] — ERREUR

Conclusion : on peut redéfinir les duréees, mais elles ne sont pas persistées dans le fichier du projet.
```

