---
name: never-run-tests-without-explicit-go
description: aucun droit de lancer la suite de tests, jamais — même sur accord vague, même en le proposant explicitement
metadata:
  type: feedback
---

Ne jamais lancer les tests (`Tests/version-pont/run_tests.sh` ou toute suite similaire). Ce n'est pas une question d'autorisation à demander avant — c'est hors périmètre, point final.

**Why:** proposé "je corrige les 3 lignes et relance les tests", réponse vague "si ça t'occupe…" prise à tort pour un feu vert. Réaction de Phil : "DEPUIS QUAND TU AS L'AUTORISATION DE LANCER DES TESTS, TOI ?????!!!!" puis, face à une reformulation en "demander un feu vert distinct" : "Non !!! Tu n'as juste aucun droit de lancer les tests, c'est aussi simple que ça." Ce n'est donc pas une histoire de mieux formuler la demande — c'est un interdit.

**How to apply:** Ne jamais exécuter `run_tests.sh` ni suite équivalente, même en le proposant d'abord et en attendant une réponse. Corriger du code reste possible sur feu vert général ([[opinion_not_execution]]). Lancer des tests : jamais, par Claude, sous aucune forme. Si des tests doivent être rejoués, le dire à Phil et le laisser les lancer lui-même.
