# Test : PR_Github_Cycle.rb (phase 'submit'), échec du `git checkout main`
# (backend/lib/git.rb#back_to_main_branch) -> en attente : avec l'ordre de
# garde actuel (status_clean? vérifié AVANT le push, rien ne modifie l'arbre
# de travail entre ce moment et back_to_main_branch), ce checkout ne peut
# pas échouer pour cause de fichiers non commités dans le déroulé normal du
# script — scénario non atteignable sans modifier le script lui-même pour
# forcer artificiellement l'échec.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

board_test("IMPOSSIBLE À TESTER — PR_Github_Cycle.rb (submit) : échec du retour sur main") do
  pending "non atteignable avec l'ordre de garde actuel du script (status_clean? vérifié avant le push, " \
    "rien ne salit l'arbre de travail avant back_to_main_branch)"
end
