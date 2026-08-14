# Test : PR_Github_Cycle.rb (phase 'commit'), un hook pre-commit qui échoue
# -> le commit doit échouer et l'erreur brute de git doit être remontée
# (pas de faux succès).

require_relative '../../support/pr_github_cycle_helpers'
include BoardTest
include PRCycleTestHelpers

def run_test
  with_fixture_repo do |dir|
    system('git', '-C', dir, 'checkout', '-q', '-b', 'ma-branche', out: File::NULL, err: File::NULL)
    hook_path = File.join(dir, '.git', 'hooks', 'pre-commit')
    File.write(hook_path, "#!/bin/sh\necho 'hook en échec' >&2\nexit 1\n")
    File.chmod(0755, hook_path)
    File.write(File.join(dir, 'script.rb'), "puts 'ok'\n")

    data = run_pr_cycle(dir, 'commit', 'ma-branche', 'message')

    raise "'error' devrait porter l'échec du hook, obtenu #{data.inspect}" if data[:error].nil?

    log = `git -C #{dir} log -1 --pretty=%s`.strip
    raise "aucun commit ne devrait avoir eu lieu (hook en échec), log=#{log.inspect}" if log == 'message'
  end
end

board_test("PR_Github_Cycle.rb (commit) : hook pre-commit en échec, erreur remontée") { run_test }
