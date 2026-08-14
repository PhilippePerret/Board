# Test : PR_Github_Cycle.rb (phase 'commit'), fichier dont le chemin contient
# un espace et des accents -> doit être commité correctement (échappement
# shell correct de bout en bout : get_commitable_files -> SyntaxChecker ->
# commit_files).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    sous_dossier = File.join(dir, 'dossier accentué')
    FileUtils.mkdir_p(sous_dossier)
    chemin = File.join(sous_dossier, 'fichier à espaces.rb')
    File.write(chemin, "puts 'ok'\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'ajout fichier à espaces')

    raise "ok:true attendu, obtenu #{data.inspect}" unless data[:ok]
    raise "error nil attendu, obtenu #{data.inspect}" unless data[:error].nil?

    tracked = `git -c core.quotePath=false -C #{dir} ls-files`.force_encoding('UTF-8')
    raise "le fichier à espaces/accents devrait être suivi après commit, tracked=#{tracked.inspect}" \
      unless tracked.include?('fichier à espaces.rb')
  end
end

board_test("PR_Github_Cycle.rb (commit) : chemin avec espace et accents, commit correct") { run_test }
