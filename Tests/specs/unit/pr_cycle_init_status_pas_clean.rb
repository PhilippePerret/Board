# Test : PR_Github_Cycle.rb (phase 'init'), fichiers modifiés non commités.
# _project_is_clean_for_init_pr_cycle? (backend/scripts/PR_Github_Cycle.rb)
# a une branche `elsif !GIT.status_clean?` VIDE : aucune erreur n'est
# renvoyée, le retour reste {ok:true, error:nil} par défaut alors
# qu'AUCUNE branche n'a été créée — faux succès silencieux.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    File.write(File.join(dir, 'nouveau.rb'), "puts 'non commité'\n")

    data = run_pr_cycle(dir, 'init', 'ma-branche')

    raise "un échec (ok:false) était attendu (status pas clean), obtenu #{data.inspect}" if data[:ok]

    current = `git -C #{dir} branch --show-current`.strip
    raise "aucune branche ne devrait avoir été créée, obtenu #{current.inspect}" if current == 'ma-branche'
  end
end

board_test("PR_Github_Cycle.rb (init) : status pas clean, aucune branche ne doit être créée") { run_test }
