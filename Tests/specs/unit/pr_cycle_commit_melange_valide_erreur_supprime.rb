# Test : PR_Github_Cycle.rb (phase 'commit'), lot mixte : un fichier valide,
# un fichier supprimé, un fichier en erreur de syntaxe -> blocage total,
# aucune des deux premières catégories ne doit être commitée à part.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    a_supprimer = File.join(dir, 'a_supprimer.txt')
    File.write(a_supprimer, "contenu\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'ajout a_supprimer.txt', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.delete(a_supprimer)
    File.write(File.join(dir, 'valide.rb'), "puts 'ok'\n")
    File.write(File.join(dir, 'casse.rb'), "def foo(\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'message')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "erreur de syntaxe attendue, obtenu #{data.inspect}" if (data.dig(:error, :syntax) || []).empty?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu, log=#{log.inspect}" if log == 'message'
    raise "a_supprimer.txt ne devrait pas avoir été retiré du suivi git tant que rien n'est commité" \
      unless `git -C #{dir} ls-files`.split("\n").include?('a_supprimer.txt')
  end
end

board_test("PR_Github_Cycle.rb (commit) : lot mixte valide/supprimé/erreur, blocage total") { run_test }
