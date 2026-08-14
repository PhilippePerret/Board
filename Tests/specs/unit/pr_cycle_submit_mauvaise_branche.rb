# Test : PR_Github_Cycle.rb (phase 'submit'), branche courante différente de
# celle fournie -> doit être bloqué avant tout accès réseau (aucun push).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'autre-branche', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', 'branche-attendue')

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-bad-branch attendu, obtenu #{data.inspect}" unless data[:error] == ['git-bad-branch', 'branche-attendue']

    distantes = `git -C #{dir} ls-remote --heads origin branche-attendue`.strip
    raise "aucune branche distante ne devrait avoir été créée : #{distantes.inspect}" unless distantes.empty?
  end
end

board_test("PR_Github_Cycle.rb (submit) : mauvaise branche, aucun accès réseau") { run_test }
