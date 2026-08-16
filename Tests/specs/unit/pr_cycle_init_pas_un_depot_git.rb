# Test : PR_Github_Cycle.rb (phase 'init'), dossier sans dépôt git.
# GIT.installed? doit bloquer avant toute tentative de checkout.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  Dir.mktmpdir('board-pr-cycle-init-') do |dir|
    data = run_pr_cycle(dir, 'init', 'ma-branche')

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error backend-not-a-git-repo attendu, obtenu #{data.inspect}" unless data[:error] == ['backend-not-a-git-repo', dir]
  end
end

board_test("PR_Github_Cycle.rb (init) : dossier sans dépôt git, bloqué avant tout checkout") { run_test }
