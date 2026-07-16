---
name: 2026-07-16-etat-fin-de-session
description: PRIORITÉ prochaine session — état daté 2026-07-16, suite de tests e2e à relancer (8 échecs sur log précédent, ajustements faits depuis)
metadata:
  type: project
---

État au 2026-07-16, fin de session.

- `Tests/_tests_a_faire.adoc` nettoyé : les entrées restantes étaient des doublons de specs déjà écrites (`attribution_service.rb`, `execution_double_service.rb`, `attribution_puis_execution_double_service.rb`, `ajout_service_startup.rb`). Fichier vidé.
- `Tests/support/helpers_base.rb` : référence `LOC_ERRORS.js` → `MES_ERRORS.js` corrigée (fichier renommé côté app).
- Log `Tests/resultats/2026-07-16_17h20.log` : 18/26 passent, 8 échecs (panneau réglages, création sans sélection Finder, création sélection fichier, création simple, genre libre, services startup, modification titre, horloge).
- User a fait des ajustements depuis ce log.

## À faire

1. **PRIORITÉ** — relancer la suite de tests (par l'user), repartir des échecs constatés sur le nouveau log.
