# Test : PR_Github_Cycle.rb (phase 'commit'), timeout de vérification
# syntaxique (SyntaxChecker::CHECK_TIMEOUT = 60s, backend/lib/syntax_checker.rb)
# -> en attente : 60s par fichier rend ce scénario impraticable dans la suite
# rapide telle quelle (CHECK_TIMEOUT n'est pas injectable de l'extérieur).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

board_test("IMPOSSIBLE À TESTER — PR_Github_Cycle.rb (commit) : timeout de vérification syntaxique") do
  pending "CHECK_TIMEOUT (60s, syntax_checker.rb) n'est pas configurable depuis l'extérieur — " \
    "nécessiterait soit un paramètre d'injection, soit d'attendre réellement 60s par run"
end
