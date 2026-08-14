# Test : PR_Github_Cycle.rb (phase 'submit'), le pull final après merge
# échoue (conflit local) -> l'erreur doit être remontée. Provoqué en avançant
# la branche locale `main` d'un commit JAMAIS poussé, qui modifie la même
# ligne que celle mergée côté distant : après le squash-merge réel, le
# `git pull` local rencontre un vrai conflit.
#
# Note : le code réutilise actuellement la même clé d'erreur que le merge
# ('git-unable-pr-merge', cf. backend/lib/git.rb#pull_on_main) — copié-collé
# probable, ce test vérifie la valeur RÉELLEMENT renvoyée aujourd'hui.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-pull-ko-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    # Avance le main LOCAL d'un commit jamais poussé, sur la même ligne.
    File.write(File.join(dir, 'README.md'), "# Repo-For-Tests (version locale jamais poussée)\n")
    system('git', '-C', dir, 'commit', '-q', '-am', 'modif locale de main, jamais poussée', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'README.md'), "# Repo-For-Tests (version mergée à distance)\n")
    system('git', '-C', dir, 'commit', '-q', '-am', 'modif distante, sera mergée', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "'error' devrait porter l'échec du pull, obtenu #{data.inspect}" if data[:error].nil?

    status = `git -C #{dir} status -s`
    raise "le dépôt local devrait être en conflit de merge après l'échec du pull, status vide" if status.strip.empty?
  end
ensure
  delete_remote_branch(branch) if branch # déjà supprimée par --delete-branch si le merge a réussi
end

board_test("PR_Github_Cycle.rb (submit) : échec du pull final (conflit local), erreur remontée (réseau réel)") { run_test }
