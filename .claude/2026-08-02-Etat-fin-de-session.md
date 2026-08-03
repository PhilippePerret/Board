---
name: 2026-08-02-etat-fin-de-session
description: Bug 68 échecs tests (cascade "carte projet introuvable") — cause trouvée, fix décidé, à coder demain 2026-08-03
metadata:
  type: project
---

# Finis les tests d'amateurs, finis l'amateurisme, les approximations de débutant qui cassent tout

Session du 2026-08-02. Phil a arrêté la session à bout de nerfs sur ce bug
cherché depuis plus d'une semaine (68 échecs sur 89 tests, log
`Tests/resultats/2026-08-02_16h58.log`). Ce fichier est la suite obligatoire
de demain — PAS un résumé optionnel. Ne pas redemander "qu'est-ce qu'on fait
aujourd'hui".

## Ne pas refaire

- Ne PAS relancer un tour de diagnostic/preuve. La cause est identifiée avec
  certitude (voir plus bas), Phil l'a dit explicitement : il se fiche des
  preuves supplémentaires, il veut le fix codé.
- Ne PAS remplacer un `sleep` court par un autre `sleep` court deviné "à la
  louche". Le fix doit ATTENDRE une confirmation réelle que l'opération
  d'enregistrement est terminée, jamais supposer un délai.
- Ne pas replonger dans des tool calls (lecture de fichiers, tests) sans
  d'abord répondre en clair à ce que Phil vient de dire. Reproché 3 fois ce
  soir.

## Cause du bug (certaine, établie par lecture de code + 2 reproductions ciblées)

**Le déclencheur — course entre l'app et le nettoyage des tests fixtures :**

- `frontend/js/App.js:124` — `App.saveData` est débouncée à 1000ms
  (`debounce(execSaveData, 1000)`). Tout `setData(key, value, true)`
  (ex. clic sur "Save" d'un ConfigDialog, dernier clic de la plupart des
  specs avant leur `ensure`) réarme cette sauvegarde différée.
- `Tests/support/helpers_base.rb:653-663` (`remove_fixture_project`) écrit
  DIRECTEMENT sur disque (supprime le fichier YAML de la carte + retire
  l'id de `appdata.yaml`) pendant que Board tourne encore, pour nettoyer la
  fixture du test qui vient de finir.
- Si le `saveData()` différé de Board (réarmé par le dernier clic "Save" de
  la spec) part APRÈS ce nettoyage, il réécrit `appdata.yaml` en entier
  avec l'état JS encore en mémoire (l'id du projet supprimé y est encore) —
  l'id revient dans `projects-in`, mais son fichier de carte n'existe plus.
- Cet id fantôme (dans `projects-in`, fichier absent) casse
  `backend/lib/app.rb:4-17` (`App.load_all`) à CHAQUE lancement suivant : le
  `.map` sur `projects-in` fait un `IO.read` qui lève `Errno::ENOENT` pour
  CET id, le `rescue Exception => e` global attrape tout le chargement (pas
  seulement le projet fautif), `RETOUR.data` reste vide.
- Côté frontend, `xbridge.js:15` affiche l'erreur en footer via
  `error(response.error)`, et — surtout — `response.ok == false` fait que
  `App.init` (callback de `load-all`) n'est JAMAIS rappelé : aucun projet ne
  se charge, pour AUCUN projet, pas seulement celui qui manque. D'où la
  cascade : dès que l'id fantôme existe, tous les specs suivants qui
  attendent une carte échouent, jusqu'à la fin du run (l'id fantôme n'est
  jamais nettoyé puisque plus aucun test ne peut le voir/le traiter).

**Pourquoi le fix déjà en place (commentaire ligne 640-652 du même fichier)
ne suffit pas :** la boucle actuelle fait `write_app_data` puis
`sleep 0.3` puis revérifie UNE fois — 300ms, plus court que le debounce de
1000ms de `App.js`. Un save tardif qui part entre 300ms et 1000ms après
l'écriture du test n'est jamais rattrapé. C'est pour ça que la reproduction
ciblée (3 specs : `attribution_service.rb`,
`creation_nouveau_projet_sans_selection_finder.rb`,
`definition_genre_projet_valeur_libre.rb`) a donné DEUX résultats
différents sur deux lancements consécutifs — course, pas déterminisme.

## Fix décidé pour demain (Phil a validé le principe, pas encore codé)

Principe validé par Phil : **quand une opération d'enregistrement est en
cours, les tests attendent une confirmation réelle qu'elle est terminée
avant de continuer — jamais un délai deviné.** Utiliser
`~/Library/Application Support/Board-debug.log` (`backend/lib/debug.rb`,
déjà écrit par `backend.rb:78` à chaque `save-app-data` reçu, horodaté à la
milliseconde, jamais déplacé par les runs de test) comme signal d'attente,
pas comme preuve à présenter.

Deux volets, à faire tous les deux :

1. **Test (`Tests/support/helpers_base.rb`, `remove_fixture_project`)** :
   remplacer la boucle `write → sleep 0.3 → revérifie` par : écrire l'appdata
   nettoyée, puis attendre (poll sur `Board-debug.log`, PAS sleep fixe) soit
   une nouvelle ligne `save-app-data reçu` postérieure à l'écriture (→ Board
   a réécrit par-dessus, réécrire l'appdata nettoyée et rattendre), soit
   l'écoulement du délai de debounce + marge sans nouvelle ligne (→ stable,
   confirmé, on peut sortir). Boucle bornée (éviter tout risque de tourner
   indéfiniment si un autre mécanisme sauvegarde périodiquement — à
   vérifier : le poll des reminders (`Reminder.js:70-85`, tick 60s) ne
   devrait pas interférer vu l'intervalle, mais à confirmer en codant).

2. **App (`backend/lib/app.rb`, `load_all`)** : ne plus laisser UN fichier de
   carte manquant faire échouer le chargement de TOUS les projets. Sauter
   le projet fautif (avec un log), charger le reste normalement. Ça règle
   aussi le cas réel non lié aux tests que Phil a soulevé cette session :
   un user qui supprime à la main le fichier d'un projet sans le retirer de
   `projects-in` ne doit pas se retrouver avec un Board qui ne charge plus
   aucun projet.

Rien de tout ça n'est encore codé — c'est la première chose à faire demain,
sans redemander le programme du jour.
