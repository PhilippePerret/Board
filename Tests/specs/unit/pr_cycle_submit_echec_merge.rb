# Test : PR_Github_Cycle.rb (phase 'submit'), le merge échoue malgré des
# checks au vert (branche protégée exigeant une revue) -> l'erreur doit être
# remontée, `git-unable-pr-merge`.
#
# Pose une règle de protection temporaire sur `main` du dépôt jetable
# (revue obligatoire, enforce_admins) le temps du test, la retire ensuite
# dans tous les cas (ensure).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

PROTECTION_BODY = <<~JSON
  {
    "required_status_checks": null,
    "enforce_admins": true,
    "required_pull_request_reviews": {"required_approving_review_count": 1},
    "restrictions": null
  }
JSON

def protect_main
  IO.popen(['gh', 'api', '-X', 'PUT', "repos/#{PRCycleTestHelpers::REMOTE_REPO_SLUG}/branches/main/protection",
            '--input', '-'], 'w') { |io| io.write(PROTECTION_BODY) }
  raise "impossible de poser la protection de branche sur main" unless $?.success?
end

def unprotect_main
  system('gh', 'api', '-X', 'DELETE', "repos/#{PRCycleTestHelpers::REMOTE_REPO_SLUG}/branches/main/protection",
         out: File::NULL, err: File::NULL)
end

def run_test
  branch = "test-submit-merge-ko-#{Time.now.to_i}"
  protect_main
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, "fichier-#{branch}.txt"), "contenu\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'commit de test', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error git-unable-pr-merge attendu, obtenu #{data.inspect}" \
      unless data[:error].is_a?(Array) && data[:error][0] == 'git-unable-pr-merge'

    merged = `gh pr list -R #{REMOTE_REPO_SLUG} --state merged --head #{branch} --json number`.strip
    raise "la PR ne devrait pas avoir été mergée : #{merged}" unless merged == '[]'
  end
ensure
  unprotect_main
  close_remote_pr(branch) if branch
  delete_remote_branch(branch) if branch
end

board_test("PR_Github_Cycle.rb (submit) : merge refusé (branche protégée), erreur remontée (réseau réel)") { run_test }
