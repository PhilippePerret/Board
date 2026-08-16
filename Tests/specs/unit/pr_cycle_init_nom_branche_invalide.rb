# Test : PR_Github_Cycle.rb (phase 'init'), nom de branche invalide pour git.
# Même trou que 'branche_deja_existante' : `git checkout -b` échoue mais
# le résultat n'est jamais vérifié.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    data = run_pr_cycle(dir, 'init', 'nom invalide avec espaces')

    raise "un échec (ok:false) était attendu (nom de branche invalide), obtenu #{data.inspect}" if data[:ok]
  end
end

board_test("PR_Github_Cycle.rb (init) : nom de branche invalide, doit échouer proprement") { run_test }
