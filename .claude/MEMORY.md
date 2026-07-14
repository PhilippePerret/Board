# MEMORY

- [macOS icon padding](feedbacks/macos_icons.md) — squircle doit avoir marge transparente, ne pas remplir tout le canvas
- [Pas d'écrasement des variantes](feedbacks/no_overwrite.md) — variante = nouveau fichier (-v2, -v3…), jamais écraser l'original
- [Diagonal isométrique 8h→2h](feedbacks/isometric_diagonal.md) — décalage X+Y simultané sur chaque pile, pas seulement X
- [Pas de règles prescriptives](feedbacks/no_prescriptive_rules.md) — énoncer les faits, jamais "doit/ne doit jamais" pour le futur
- [Jamais de décision unilatérale](feedbacks/never_unilateral_decisions.md) — poser une question ouverte avant de choisir, pas présenter un plan tout fait
- [Avis ≠ exécution](feedbacks/opinion_not_execution.md) — donner un avis demandé n'autorise pas à agir dessus, attendre un feu vert distinct
- [Pas de code app sans demande](feedbacks/no_app_code_without_request.md) — frontend/backend hors périmètre sauf demande explicite précise
- [Expliquer puis demander avant diagnostic](feedbacks/explain_then_ask_before_diagnostics.md) — même en lecture seule/sandboxé, expliquer en clair et demander avant de lancer
- [Sauvegarde jamais dans un tmp volatile](feedbacks/backup_volatile_tmp.md) — perte de données réelle, backup doit être dans le repo, jamais $TMPDIR
- [Sécurité fermeture fenêtres Finder](feedbacks/finder_window_closing_safety.md) — vérifier le nom juste avant de fermer, jamais de balayage
- [Pas d'explications techniques](feedbacks/no_code_explanations.md) — user ne lit pas le code, format "<Ça> : normalement, corrigé."
- [Décision vs détail d'implémentation](feedbacks/decision_vs_implementation_detail.md) — réponse de décision = uniquement ce qui pèse sur le choix, jamais mêlé aux détails mécaniques (ordre scripts, imports…)
- [Aplatissement AX WebKit](project_webkit_ax_flattening.md) — un div wrapper sans texte direct peut disparaître de l'arbre AX, `role="group"` corrige
- [État des moteurs de test](project_test_engines_status.md) — base/batch/compiled/pers retirés (benchmarkés, plus lents), swift+pont gardés, pont défaut
- [Bug clic double service ouvert](project_double_click_service_bug.md) — AXPress ne reproduit pas le bug réel, investigation à reprendre côté console dev live
- [PRIORITÉ — 7 échecs suite e2e (2026-07-13)](project_test_suite_failures.md) — diagnostics posés (SERVICE_ID drag faux, fixture 8 vs 6 params, sbarWidth non défini, test horloge seuils à revoir), rien corrigé
