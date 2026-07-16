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
- [Dossier .claude = à moi](feedbacks/claude_dir_is_mine.md) — CLAUDE.md et tout .claude/ sous ma responsabilité, tenir à jour sans demander
- [Aplatissement AX WebKit](project_webkit_ax_flattening.md) — un div wrapper sans texte direct peut disparaître de l'arbre AX, `role="group"` corrige
- [Presse-papier pour commandes test](feedbacks/clipboard_test_command.md) — toujours pbcopy la commande de test donnée à l'user
- [git log ≠ preuve d'auteur](feedbacks/git_log_not_authorship_proof.md) — tous les commits partent de l'user sur Github, jamais utiliser git log/blame pour dire qui a écrit quoi
- PRIORITÉ [TODO projets](project_todo_projets.md) — tests remise projet archivé + extra-data projets
