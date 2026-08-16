# Test : PR_Github_Cycle.rb (phase 'init'), nom de branche déjà pris.
# `git checkout -b` échoue (la branche existe déjà) mais exec_init ne
# vérifie jamais $?.success? sur cette commande — faux succès silencieux.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'branch', '-q', 'deja-la', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'init', 'deja-la')

    raise "un échec (ok:false) était attendu (branche déjà existante), obtenu #{data.inspect}" if data[:ok]
  end
end

board_test("PR_Github_Cycle.rb (init) : nom de branche déjà pris, doit échouer proprement") { run_test }
