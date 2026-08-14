# Test : PR_Github_Cycle.rb (phase 'commit'), fichier d'une extension non
# couverte par SyntaxChecker (ex. image) -> doit passer sans blocage.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'image.png'), "\x89PNG\r\n\x1a\nfaux contenu binaire")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'ajout image')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "error nil attendu (pas de blocage pour extension inconnue), obtenu #{data.inspect}" unless data[:error].nil?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "le commit devrait avoir eu lieu, log=#{log.inspect}" unless log == 'ajout image'
  end
end

board_test("PR_Github_Cycle.rb (commit) : extension inconnue du vérificateur, non bloquant") { run_test }
