# Test : PR_Github_Cycle.rb (phase 'commit'), message de commit vide -> git
# refuse (Aborting commit due to empty commit message), doit remonter une
# erreur claire, pas un faux succès.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'script.rb'), "puts 'ok'\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', '')

    raise "ok:true attendu (dans le format actuel du retour), obtenu #{data.inspect}" unless data[:ok]
    raise "'error' devrait porter l'échec du commit vide, obtenu #{data.inspect}" if data[:error].nil?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu avec un message vide, log=#{log.inspect}" if log.empty? && `git -C #{dir} log --oneline`.split("\n").size > 1
  end
end

board_test("PR_Github_Cycle.rb (commit) : message vide, git refuse, erreur remontée") { run_test }
