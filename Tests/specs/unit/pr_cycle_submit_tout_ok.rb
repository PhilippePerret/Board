# Test : PR_Github_Cycle.rb (phase 'submit'), cas nominal de bout en bout,
# contre le dépôt GitHub jetable réel (push, création PR, attente des checks
# CI réels — workflow minimal toujours vert —, retour sur main, merge, pull).
#
# Coûteux (réseau + attente réelle des GitHub Actions) : à ne lancer que
# volontairement, pas dans une boucle rapide.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-ok-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, "fichier-#{branch}.txt"), "contenu de test\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', "commit de test (#{branch})", out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "message de succès attendu, obtenu #{data.inspect}" unless data[:message] == 'github-pr-cycle-submission-ok'

    merged = `gh pr list -R #{REMOTE_REPO_SLUG} --state merged --head #{branch} --json number`.strip
    raise "la PR de la branche #{branch} devrait apparaître comme mergée : #{merged}" if merged == '[]'
  end
ensure
  delete_remote_branch(branch) if branch # no-op si déjà supprimée par --delete-branch au merge
end

board_test("PR_Github_Cycle.rb (submit) : cas nominal de bout en bout (réseau réel)") { run_test }
