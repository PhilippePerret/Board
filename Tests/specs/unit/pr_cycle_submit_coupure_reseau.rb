# Test : PR_Github_Cycle.rb (phase 'submit'), coupure réseau à n'importe
# quelle étape (push/PR/checks/merge/pull) -> en attente : pas de moyen
# fiable et local de simuler une coupure réseau réelle à un point précis du
# déroulé sans couper la propre connexion de la machine de test.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

board_test("IMPOSSIBLE À TESTER — PR_Github_Cycle.rb (submit) : coupure réseau en cours de cycle") do
  pending "pas de moyen fiable de simuler une coupure réseau ciblée sans affecter toute la machine de test"
end
