# Test : PR_Github_Cycle.rb (phase 'commit'), fichier en conflit Git non
# résolu (statut 'UU') -> doit bloquer le commit et remonter le conflit,
# jamais commiter un fichier avec des marqueurs de conflit dedans.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    File.write(File.join(dir, 'conflit.txt'), "base\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'ajout conflit.txt', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'conflit.txt'), "version branche\n")
    system('git', '-C', dir, 'commit', '-q', '-am', 'modif branche', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', 'main', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'conflit.txt'), "version main\n")
    system('git', '-C', dir, 'commit', '-q', '-am', 'modif main', out: File::NULL, err: File::NULL)

    system('git', '-C', dir, 'checkout', '-q', 'ma-branche', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'merge', 'main', out: File::NULL, err: File::NULL) # échoue exprès (conflit), laissé tel quel

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'message')

    raise "ok:true attendu (erreur traitée en dict, pas en raise), obtenu #{data.inspect}" unless data[:ok]
    conflicts = data.dig(:error, :conflict) || []
    raise "un conflit sur conflit.txt attendu, obtenu #{data.inspect}" if conflicts.empty?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu tant que le conflit n'est pas résolu, log=#{log.inspect}" if log == 'message'
  end
end

board_test("PR_Github_Cycle.rb (commit) : fichier en conflit git, commit bloqué") { run_test }
