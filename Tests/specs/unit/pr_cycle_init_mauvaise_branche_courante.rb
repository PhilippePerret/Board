# Test : PR_Github_Cycle.rb (phase 'init'), pas sur la branche main.
# Même trou que 'status_pas_clean' : `elsif !GIT.on_branch?('main')` est
# vide dans _project_is_clean_for_init_pr_cycle? — faux succès silencieux.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'autre-branche', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'init', 'ma-branche')

    raise "un échec (ok:false) était attendu (pas sur main), obtenu #{data.inspect}" if data[:ok]

    current = `git -C #{dir} branch --show-current`.strip
    raise "aucune nouvelle branche ne devrait avoir été créée, obtenu #{current.inspect}" if current == 'ma-branche'
  end
end

board_test("PR_Github_Cycle.rb (init) : pas sur main, aucune branche ne doit être créée") { run_test }
