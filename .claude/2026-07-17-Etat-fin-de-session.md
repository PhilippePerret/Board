---
name: 2026-07-17-etat-fin-de-session
description: PRIORITÉ prochaine session — état daté 2026-07-17, suite investigation service_commun_ouverture_terminal.rb (historique Terminal vide malgré flux réel), puis 2 autres échecs restants
metadata:
  type: project
---

État au 2026-07-17, fin de session.

- Suite de tests relancée par l'user (log `2026-07-17_12h06.log`) : 21/26 passent, 5 échecs (contre 8 la veille).
- 2 échecs corrigés dans la session : `creation_nouveau_projet_selection_fichier.rb`, `creation_simple_nouveau_projet.rb` (bug retiré côté spec : clic `common-services-panel-toggle` en trop, le panneau s'ouvrait déjà seul).
- Bug app réel trouvé et corrigé par l'user : `backend/scripts/OpenTerminalAtFolder.scpt` référençait une variable `foldPath` jamais déclarée (déclarée `folderPath`) — le script plantait systématiquement. Corrigé.
- `service_commun_ouverture_terminal.rb` : étendu à 3 scénarios (code un mot `ls`, plusieurs mots `ls -la`, aucun code) suite à l'ajout du param `code` dans `ServiceData.js`. Plusieurs itérations sur le ciblage de la fenêtre Terminal (front window → id par nom → tab par contenu → nom+contenu scopé à une fenêtre) — toutes corrigent des bugs réels trouvés en cours de route (course entre mise à jour du titre et exécution du code, coût du polling), mais le test échoue encore : la fenêtre s'ouvre avec le bon titre mais un historique vide, uniquement quand déclenché par le vrai flux UI. Reproduit avec succès en manuel (osascript direct, via la logique de `run_script`, via `backend.rb` directement avec délai réaliste) à chaque tentative — cause exacte non trouvée.
- Nouveaux helpers ajoutés dans `Tests/support/helpers_base.rb` : `terminal_window_id_named`, `terminal_tab_index_matching`, `terminal_tab_history`, `terminal_close_window`, `terminal_debug_dump`.
- Pas retouché : `execution_services_startup.rb` et `service_commun_horloge.rb`, toujours en échec depuis le log du 17 (timeouts, causes non investiguées cette session).

## À faire

1. **PRIORITÉ** — reprendre l'investigation sur `service_commun_ouverture_terminal.rb` : pourquoi le flux UI réel (clic réel dans l'app) produit une fenêtre Terminal au titre correct mais à l'historique vide, alors que toute reproduction manuelle du même appel backend réussit.
2. Une fois ce test réglé (ou mis de côté), traiter `execution_services_startup.rb` (timeout 10s, message vide) et `service_commun_horloge.rb` (timeout 10s, CHANGELOG.md absent).
