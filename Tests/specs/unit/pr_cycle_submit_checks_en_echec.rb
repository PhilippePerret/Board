# Test : PR_Github_Cycle.rb (phase 'submit'), les checks CI échouent
# (fichier marqueur FAIL_CI, cf. workflow du dépôt jetable) -> le merge ne
# doit jamais avoir lieu, l'erreur de check doit être remontée.
#
# Coûteux (attend réellement l'exécution du workflow GitHub Actions).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-checks-ko-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'FAIL_CI'), "déclenche l'échec du workflow CI\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'commit qui fait échouer la CI', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-pr-waiting-checks-failure attendu, obtenu #{data.inspect}" \
      unless data[:error] == 'git-pr-waiting-checks-failure'

    merged = `gh pr list -R #{REMOTE_REPO_SLUG} --state merged --head #{branch} --json number`.strip
    raise "la PR ne devrait jamais avoir été mergée : #{merged}" unless merged == '[]'
  end
ensure
  close_remote_pr(branch) if branch
  delete_remote_branch(branch) if branch
end

board_test("PR_Github_Cycle.rb (submit) : checks CI en échec, merge jamais tenté (réseau réel)") { run_test }
