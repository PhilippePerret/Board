# Test : PR_Github_Cycle.rb (phase 'submit'), une PR existe déjà pour cette
# branche -> `gh pr create --fill` doit échouer, l'erreur doit être remontée.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-pr-existe-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, "fichier-#{branch}.txt"), "contenu\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'commit de test', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'push', '-q', '-u', 'origin', branch, out: File::NULL, err: File::NULL)
    system('gh', 'pr', 'create', '-R', REMOTE_REPO_SLUG, '--fill', '--head', branch, out: File::NULL, err: File::NULL) \
      or raise "préparation du test : création manuelle de la 1re PR a échoué"

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-pr-create-error attendu, obtenu #{data.inspect}" \
      unless data[:error].is_a?(Array) && data[:error][0] == 'git-pr-create-error'
  end
ensure
  close_remote_pr(branch) if branch
  delete_remote_branch(branch) if branch
end

board_test("PR_Github_Cycle.rb (submit) : une PR existe déjà, erreur remontée") { run_test }
