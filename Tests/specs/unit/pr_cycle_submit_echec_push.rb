# Test : PR_Github_Cycle.rb (phase 'submit'), le push échoue (remote
# inaccessible) -> doit remonter une erreur claire, sans tenter la suite
# (pas de création de PR).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-push-ko-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, "fichier-#{branch}.txt"), "contenu\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'commit de test', out: File::NULL, err: File::NULL)

    # Remote cassé exprès : dépôt inexistant sous le même compte.
    system('git', '-C', dir, 'remote', 'set-url', 'origin', 'git@github.com:PhilippePerret/depot-inexistant-xyz.git',
           out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-push-error attendu, obtenu #{data.inspect}" \
      unless data[:error].is_a?(Array) && data[:error][0] == 'git-push-error'
  end
end

board_test("PR_Github_Cycle.rb (submit) : échec du push, erreur remontée") { run_test }
