# Test : PR_Github_Cycle.rb (phase 'commit'), un fichier Ruby avec une
# erreur de syntaxe -> doit bloquer TOTALEMENT le commit, y compris pour les
# autres fichiers valides du même lot (aucun commit partiel).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'valide.rb'), "puts 'ok'\n")
    File.write(File.join(dir, 'casse.rb'), "def foo(\n  puts 'jamais fermé'\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'message')

    raise "ok:true attendu (erreur traitée en dict), obtenu #{data.inspect}" unless data[:ok]
    syntax_errors = data.dig(:error, :syntax) || []
    raise "une erreur de syntaxe sur casse.rb attendue, obtenu #{data.inspect}" \
      unless syntax_errors.any? { |e| e['path'] == 'casse.rb' || e[:path] == 'casse.rb' }

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu (même valide.rb, pas de commit partiel), log=#{log.inspect}" if log == 'message'
  end
end

board_test("PR_Github_Cycle.rb (commit) : fichier avec erreur de syntaxe, commit totalement bloqué") { run_test }
