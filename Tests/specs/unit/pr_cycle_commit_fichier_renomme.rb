# Test : PR_Github_Cycle.rb (phase 'commit'), fichier renommé (état 'R' dans
# get_commitable_files) -> doit être traité sur son NOUVEAU chemin (syntaxe
# vérifiée sur le nouveau nom) et correctement commité.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    File.write(File.join(dir, 'original.rb'), "puts 'ok'\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'ajout original.rb', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'mv', 'original.rb', 'renomme.rb', out: File::NULL, err: File::NULL)

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'renommage')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "error nil attendu, obtenu #{data.inspect}" unless data[:error].nil?

    tracked = `git -C #{dir} ls-files`.split("\n")
    raise "renomme.rb devrait être suivi après commit, tracked=#{tracked.inspect}" unless tracked.include?('renomme.rb')
    raise "original.rb ne devrait plus être suivi après commit, tracked=#{tracked.inspect}" if tracked.include?('original.rb')
  end
end

board_test("PR_Github_Cycle.rb (commit) : fichier renommé, traité sur le nouveau chemin") { run_test }
