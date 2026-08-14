# Test : PR_Github_Cycle.rb (phase 'submit'), `gh pr checks` retourne un code
# de sortie ni 0 ni 1 (backend/lib/git.rb#wait_for_pr_checks, branche 'else')
# -> en attente : pas de moyen déterministe de forcer un tel code depuis un
# `gh` réel et bien formé, sans remettre en cause le choix "dépôt réel,
# pas de fake gh".

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

board_test("IMPOSSIBLE À TESTER — PR_Github_Cycle.rb (submit) : gh pr checks renvoie un code de sortie inattendu") do
  pending "aucun moyen déterministe de forcer un exit code hors {0,1} depuis un `gh` réel bien formé " \
    "(choix retenu : dépôt jetable réel, pas de fake `gh` sur le PATH)"
end
