# Test : PR_Github_Cycle.rb (phase 'commit'), cas nominal.
# Un fichier valide (syntaxe ok) modifié sur la bonne branche doit être
# commité sans erreur.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'script.rb'), "puts 'ok'\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'un commit de test')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "error nil attendu, obtenu #{data.inspect}" unless data[:error].nil?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "le commit devrait être visible dans l'historique, log=#{log.inspect}" unless log == 'un commit de test'
  end
end

board_test("PR_Github_Cycle.rb (commit) : cas nominal, fichier valide commité") { run_test }
