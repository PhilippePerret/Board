# Test : PR_Github_Cycle.rb (phase 'commit'), très grand nombre de fichiers à
# commiter (limite de la commande shell générée par commit_files) -> en
# attente : test de charge, pas adapté à la suite rapide (1 process ruby
# lancé par fichier via SyntaxChecker, coût prohibitif pour un run courant).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

board_test("PR_Github_Cycle.rb (commit) : très grand nombre de fichiers à commiter") do
  pending "test de charge (des centaines/milliers de fichiers) — coûteux (1 process de vérification " \
    "syntaxique par fichier) et pas représentatif d'un usage réel de l'app, à traiter séparément si besoin"
end
