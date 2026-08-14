# Test : PR_Github_Cycle.rb (phase 'commit'), utilisateur sur une branche
# différente de celle attendue -> doit être bloqué avant tout accès au statut
# git ou tentative de commit.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'autre-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'script.rb'), "puts 'ok'\n")

    data = run_pr_cycle(dir, 'commit', 'branche-attendue', 'message')

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-bad-branch attendu, obtenu #{data.inspect}" unless data[:error] == ['git-bad-branch', 'branche-attendue']

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu, log=#{log.inspect}" if log == 'message'
  end
end

board_test("PR_Github_Cycle.rb (commit) : mauvaise branche, aucun commit ne doit avoir lieu") { run_test }
