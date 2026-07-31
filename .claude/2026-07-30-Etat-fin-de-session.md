---
name: etat-fin-session-2026-07-30
description: Session du 2026-07-30 — nombreux fixes (crash JSON, Reminder, DateUtils, ConfigDialog) + gros refactor Dialog.js (id des boutons préfixés) ayant fait passer la suite à 31 failures, À REGARDER EN PRIORITÉ à la reprise
metadata:
  type: project
---

## ORDRE DE PHIL — 2026-07-31

« MOI, CLAUDE, JE DOIS FAIRE QUE TOUS LES TESTS PASSENT AUJOURD'HUI, SANS TRICHER. »

Continuer d'un échec au suivant sans attendre une relance à chaque fois. Ne pas lancer les tests moi-même (toujours Phil) — mais diagnostiquer/corriger le code en continu entre deux runs.

JAMAIS demander à Phil de relancer TOUTE la suite (`./scripts/run-tests` sans argument). Toujours préparer dans le presse-papier une commande ciblée sur 1 ou 2 fichiers de specs seulement.

## À REGARDER EN PRIORITÉ À LA REPRISE

Dernier run connu (après le refactor `Dialog.js` sur les id de boutons) : **31 failures**, contre 9 en début de session. Pas encore diagnostiqué — probablement en bonne partie des conséquences de la conversion en masse `btn-oui`/`btn-non`/`btn-mid` -> `_suffix` sur ~33 fichiers de specs (cf. plus bas), possiblement incomplète ou avec des cas particuliers ratés.

## Fait aujourd'hui

### Bugs corrigés (code app)
- `backend/lib/exec_script.rb` : branche échec faisait `JSON.parse(res)` sur du texte d'erreur brut (pas du JSON) -> masquait l'erreur réelle derrière un message de parsing JSON confus. Remplacé par `RETOUR.error = res`, puis ajout d'une détection du motif `-25211`/"accès d'aide" pour donner un message clair (permission Accessibilité manquante).
- `backend/lib/project_files.rb` + `backend/backend.rb` : action `update-project-notes` utilisait `request` (variable locale de `backend.rb`) directement dans un fichier chargé par `require_relative` -> `NameError: undefined local variable 'request'` (les fichiers `require_relative`d ne partagent pas les variables locales de l'appelant, contrairement aux constantes). Transformé en méthode `update_project_notes(request)` appelée explicitement.
- `backend/scripts/GetAppWindowBounds.scpt` : `front window` pouvait lever une erreur AppleScript non catchée (fenêtre présente mais pas "front" accessible). Ajout d'un `try/on error` autour de `position`/`size`.
- `backend/scripts/OpenOrUpdateInBrowser.scpt` : `URL of tab` peut être `missing value` (onglet Safari vide/nouvel onglet) -> `extractChemin` plantait sur `text item 1 of missing value`. Onglets sans URL désormais ignorés dans la boucle.
- `frontend/js/Reminder.js` (fix Phil) : `destroy(type)` ne vidait jamais `remindedTasks`, laissant les vieilles entrées après une destruction.
- `frontend/js/Project.js` (fix Phil) : `reactiveIfTask(this.tasks)` était appelé deux fois de suite dans `updateTasksAfterMarkAndCreate` -> double Reminder pour une même tâche.
- `frontend/js/ScriptService.js` : `other_params_are_valid()` avait un `return true` mal placé DANS la boucle (sortait dès la 1ère itération) — corrigé par Phil (sorti de la boucle). Pas de vérification de type sur les params (ex. `values` d'un `select`) : volontaire selon Phil, non implémenté.
- `frontend/js/DateUtils.js` (fix Phil, formule donnée par moi) : `REG_ISO_8601` ne gérait que le suffixe `Z`, pas les offsets numériques explicites (`+02:00` etc.) — ignorés silencieusement, heure calculée en heure locale naïve au lieu d'appliquer le décalage réel.
- `frontend/js/Dialogs.js` (fix Phil) : `ConfigDialog#buildConfig()` avait un typo `this.dprop.id` (au lieu de `dprop.id`) qui faisait planter la construction de chaque ligne.
- `frontend/js/App.js` (fix Phil) : `editConfigData` ne passait pas de `id:` à `ConfigDialog` — ajouté (`id: 'app-config'`).

### Refactor important
- `frontend/js/Dialog.js` : les boutons génériques `btn-oui`/`btn-non`/`btn-mid` sont désormais préfixés par `${this.id}-` (ex. `app-config-btn-oui`). Nécessaire car `ConfigDialog` reste ouvert pendant qu'on édite une ligne (ouvre un 2e Dialog imbriqué) — les deux dialogues avaient sinon le même id de bouton en même temps. Décidé et demandé explicitement par Phil, en acceptant l'impact sur toute la suite de tests.

### Suite de tests, conséquences du refactor Dialog.js
- `Tests/version-pont/support/helpers.rb` : ajout de 7 helpers `_suffix` (`click_suffix`, `wait_for_suffix`, `exists_suffix?`, `get_text_suffix`, `get_value_suffix`, `set_value_suffix`, `has_class_suffix?`) — matchent un id se terminant par le suffixe donné.
- Conversion en masse (sed/perl) des appels bruts `click('btn-oui')`/`wait_for('btn-non')`/etc. vers leurs équivalents `_suffix`, dans ~33 fichiers de `Tests/specs/e2e/*.rb` + `Tests/support/helpers_base.rb`.
- `Tests/specs/e2e/app_data_panel.rb` : entièrement réécrit — testait l'ancien `AppDataPanel` (SidePanel, supprimé par Phil), teste maintenant le nouveau `ConfigDialog` (ids exacts connus : `app-config`, `app-config-<prop>-value`, `<prop>-btn-oui`, pas besoin de `_suffix` là où l'id est déterministe).
- `Tests/specs/e2e/validator_date_et_duration.rb` : cas "dans 4 mois à 6 hrs 30" recorrigé par Phil de `valid: false` à `valid: true` (mon 1er diagnostic proposait de changer la regex plutôt que le test — refusé, à raison : ce format est une date valide).
- `Tests/specs/e2e/script_service_step_validate.rb` : cas `values: 42` recorrigé pour attendre `[]` (pas d'erreur) au lieu de `scserv-param-bad-type`, en cohérence avec l'absence volontaire de vérification de type.
- Ménage : fichiers `.!NNNN!nom.rb` (copies de sécurité générées par un éditeur externe pendant la conversion en masse) supprimés — non trackés par git.

## Non résolu — à reprendre

1. **Diagnostiquer les 31 failures actuelles** (cf. section prioritaire en tête). Suspecter en premier lieu des id `btn-oui`/`btn-non`/`btn-mid` mal convertis ou des dialogues imbriqués où le suffixe seul reste ambigu (deux dialogues se terminant par le même suffixe générique en même temps).
2. ~~`Sources/Board/Bridge.swift:21`~~ — corrigé (session du 2026-07-31) : guard `JSONSerialization.isValidJSONObject(body)` ajouté avant `data(withJSONObject:)`.
3. Échecs du run de 12h16 non repris individuellement au-delà de ceux listés ci-dessus : `creation_nouveau_projet_selection_fichier`, `service_commun_edit_documentation`, `service_commun_init_documentation`. `creation_simple_nouveau_projet` et `creation_nouveau_projet_sans_selection_finder` corrigés (session du 2026-07-31) : course entre l'ouverture du socket `TestBridge` et la fin de chargement de `index.html` — `TestBridge.shared.attach(webView:)` déplacé dans `ViewController.webView(_:didFinish:)` (`WKNavigationDelegate`) au lieu d'être appelé juste après la création du `WKWebView`.

   - `service_commun_ouverture_dossier` : cause réelle trouvée via `Board-debug.log` (aucun appel `exec-service`/`OpenFolderProject.scpt` enregistré alors que le clic réussissait) — le clic sur "OK" du dialogue bounds lance un aller-retour ASYNCHRONE (bridge -> backend -> `getInfoFinderWindow.scpt`, qui a besoin d'une fenêtre Finder au premier plan) ; `with_finder_selection` refermait cette fenêtre dès le retour de `click_suffix`, AVANT la fin de cet aller-retour -> AppleScript échoue (pas de front window) -> `retour.data` undefined côté `ParamDefiner.getInfoFinderWindow` -> exception JS silencieuse (avalée par le listener de clic, jamais remontée) -> `exec-service` jamais appelé. Corrigé dans `Tests/specs/e2e/service_commun_ouverture_dossier.rb` : la fenêtre Finder reste ouverte jusqu'à l'apparition du dialogue suivant (`__sidebar__`), preuve que l'aller-retour est terminé, avant d'être refermée. Ajouté aussi un `try/catch` dans `ServiceDefiner.onDefined` (frontend/js/ServiceDefiner.js) pour que ce genre d'erreur s'affiche désormais dans `#message` au lieu de disparaître sans trace. Non revérifié par un run (en attente).

   - `service_commun_update_documentation` : cause différente, NON corrigée — `backend/scripts/UpdateDocumentation.rb` n'appelle plus `open .` du tout (confirmé via `Board-debug.log` : la commande réellement exécutée est juste `cd ... && asciidoctor ...`), alors que le commentaire en tête de la spec et le test lui-même attendent que le dossier s'ouvre dans le Finder après le service. Décision à prendre par Phil : rajouter `open .` au script, ou corriger le test/commentaire (comportement volontairement changé ?) — PAS tranché ici.
4. Lancer réellement la suite (`./scripts/run-tests`) après les corrections ci-dessus — jamais lancé par moi, à faire par Phil.
