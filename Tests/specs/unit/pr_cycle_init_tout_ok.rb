# Test : PR_Github_Cycle.rb (phase 'init'), cas nominal.
# Dépôt propre sur main -> la branche demandée doit être créée et
# devenir la branche courante.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    data = run_pr_cycle(dir, 'init', 'ma-nouvelle-branche')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]

    current = `git -C #{dir} branch --show-current`.strip
    raise "la branche courante devrait être 'ma-nouvelle-branche', obtenu #{current.inspect}" unless current == 'ma-nouvelle-branche'
  end
end

board_test("PR_Github_Cycle.rb (init) : cas nominal, la branche demandée est créée") { run_test }
