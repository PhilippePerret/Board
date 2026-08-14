# Helpers partagés pour les tests unitaires de PR_Github_Cycle.rb
# (backend/scripts/PR_Github_Cycle.rb, service 'github-pr-cycle-init/commit/submit').
#
# Tests unitaires (pas d'app lancée) : invoquent le script en sous-processus,
# sur de vrais dépôts git créés dans un tmpdir — même principe que
# Tests/specs/unit/git_commit_sans_depot_git.rb pour GitOpes.rb.

require_relative 'helpers_base'
require 'fileutils'
require 'tmpdir'
require 'json'

module PRCycleTestHelpers
  PR_CYCLE_RB = File.join(BoardTest::ROOT, 'backend', 'scripts', 'PR_Github_Cycle.rb')

  # Crée un dépôt git réel dans +dir+, avec un premier commit sur `main`.
  def init_fixture_repo(dir)
    system('git', 'init', '-q', '-b', 'main', dir, out: File::NULL, err: File::NULL) \
      or raise "git init a échoué dans #{dir}"
    system('git', '-C', dir, 'config', 'user.email', 'test@example.com', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'config', 'user.name', 'Board Test', out: File::NULL, err: File::NULL)
    File.write(File.join(dir, 'README.md'), "# fixture\n")
    system('git', '-C', dir, 'add', '-A', out: File::NULL, err: File::NULL)
    system('git', '-C', dir, 'commit', '-q', '-m', 'premier commit', out: File::NULL, err: File::NULL) \
      or raise "premier commit a échoué dans #{dir}"
  end

  # Exécute PR_Github_Cycle.rb <project_path> <phase> <*args> et retourne le
  # JSON parsé (clés symbolisées : ok, error, message...).
  def run_pr_cycle(project_path, phase, *args)
    cmd = ['ruby', PR_CYCLE_RB, project_path, phase, *args]
    out = IO.popen(cmd, err: [:child, :out], &:read)
    JSON.parse(out, symbolize_names: true)
  end

  def with_fixture_repo
    Dir.mktmpdir('board-pr-cycle-') do |dir|
      init_fixture_repo(dir)
      yield dir
    end
  end
end
