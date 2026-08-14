# Test : PR_Github_Cycle.rb (phase 'commit'), fichier d'un type dont l'outil
# de vérification syntaxique n'est pas installé sur la machine (ici .ts,
# `tsc` absent de ce poste) -> doit être traité comme un blocage (pas un
# succès silencieux), cf. SyntaxChecker#run_checker rescue Errno::ENOENT.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  raise Pending, "tsc est installé sur ce poste, ce scénario ne peut pas être vérifié tel quel" if system('command -v tsc > /dev/null 2>&1')

  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'fichier.ts'), "const x: number = 1;\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'ajout fichier.ts')

    raise "ok:true attendu (erreur traitée en dict), obtenu #{data.inspect}" unless data[:ok]
    syntax_errors = data.dig(:error, :syntax) || []
    raise "un blocage sur fichier.ts (outil absent) attendu, obtenu #{data.inspect}" if syntax_errors.empty?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu, log=#{log.inspect}" if log == 'ajout fichier.ts'
  end
end

board_test("PR_Github_Cycle.rb (commit) : outil de vérification absent, traité comme blocage") { run_test }
