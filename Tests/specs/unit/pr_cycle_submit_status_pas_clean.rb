# Test : PR_Github_Cycle.rb (phase 'submit'), fichier modifié non commité
# au moment du submit -> doit être bloqué avant tout accès réseau.

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  branch = "test-submit-dirty-#{Time.now.to_i}"
  with_remote_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', branch, out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'oublie.txt'), "fichier non commité\n")

    data = run_pr_cycle(dir, 'submit', branch)

    raise "ok:false attendu, obtenu #{data.inspect}" if data[:ok]
    raise "error de statut non-clean attendu, obtenu #{data.inspect}" \
      unless data[:error] == 'github-pr-cycle-require-clean-status-to-submit'

    distantes = `git -C #{dir} ls-remote --heads origin #{branch}`.strip
    raise "aucune branche distante ne devrait avoir été créée : #{distantes.inspect}" unless distantes.empty?
  end
end

board_test("PR_Github_Cycle.rb (submit) : statut pas clean, bloqué avant le réseau") { run_test }
