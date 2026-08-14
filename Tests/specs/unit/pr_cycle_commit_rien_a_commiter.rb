# Test : PR_Github_Cycle.rb (phase 'commit'), statut déjà clean (rien à
# commiter). GIT.get_commitable_files renvoie une liste vide -> relpath_list
# vide passée à GIT.commit_files -> commande générée `git add` SANS argument,
# ce qui ajoute silencieusement tout le dossier courant (comportement Git
# standard) au lieu de ne rien faire.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    # Un fichier NON tracké par git, présent avant l'appel, hors de tout
    # commit : sert à révéler si `git add` (sans argument) l'embarque.
    File.write(File.join(dir, 'fichier-hors-cycle.txt'), "ne doit pas être ajouté\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'commit sans rien à committer')

    tracked = `git -C #{dir} ls-files`.split("\n")
    raise "fichier-hors-cycle.txt ne devrait pas être suivi par git (git add sans argument a tout ajouté) : #{data.inspect}" \
      if tracked.include?('fichier-hors-cycle.txt')
  end
end

board_test("PR_Github_Cycle.rb (commit) : rien à commiter, ne doit pas ajouter tout le dossier") { run_test }
