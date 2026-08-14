# Test : PR_Github_Cycle.rb (phase 'submit'), les checks CI ne terminent pas
# sous 45s (fichier marqueur SLEEP_CI_SECONDS, cf. workflow du dépôt jetable)
# -> Git#wait_for_pr_checks doit couper au timeout interne et remonter
# 'git-pr-checks-timeout'.
#
# TRÈS coûteux : le test dure ~45s+ par construction (Timeout.timeout(45)).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-timeout-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'SLEEP_CI_SECONDS'), "90\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'commit qui fait traîner la CI', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-pr-checks-timeout attendu, obtenu #{data.inspect}" unless data[:error] == 'git-pr-checks-timeout'
  end
ensure
  close_remote_pr(branch) if branch
  delete_remote_branch(branch) if branch
end

board_test("PR_Github_Cycle.rb (submit) : timeout des checks CI (~45s, réseau réel)") { run_test }
