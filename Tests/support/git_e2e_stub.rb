# Stub Git pour les specs e2e (service 'git-init', backend/scripts/GitInit.rb) :
# redirige le remote vers un dépôt bare LOCAL au lieu de github.com — même
# principe que Tests/support/todoist_e2e_stub.rb (variable d'environnement
# lue par le script backend, propagée via helpers_base.rb#launch_app).
#
# GitInit.rb n'utilise ce remote que si APP_BOARD_TESTS_RUNNING est aussi
# présent (posé par Tests/version-pont/run_tests.sh pour tout le run) —
# double verrou pour qu'une variable oubliée dans un shell ne détourne
# jamais un run réel.

require_relative 'helpers_base'
require 'fileutils'
require 'tmpdir'

module BoardTest
  # Crée un dépôt bare local (`git init --bare`), pose BOARD_TEST_GIT_REMOTE
  # dessus le temps du bloc, le retire ensuite.
  def with_git_e2e_stub
    dir = Dir.mktmpdir('board-git-e2e-stub')
    bare_repo = File.join(dir, 'remote.git')
    system('git', 'init', '--bare', '-q', bare_repo, out: File::NULL, err: File::NULL) \
      or raise "Impossible de créer le dépôt bare de test : #{bare_repo}"
    ENV['BOARD_TEST_GIT_REMOTE'] = bare_repo
    yield bare_repo
  ensure
    ENV.delete('BOARD_TEST_GIT_REMOTE')
    FileUtils.remove_entry(dir) if dir && File.directory?(dir)
  end

  # Dernier message de commit visible dans le dépôt bare (preuve que le
  # push a réellement atteint ce dépôt, pas juste que le script n'a pas
  # levé d'erreur).
  def git_bare_repo_last_commit_message(bare_repo)
    `git --git-dir=#{bare_repo} log -1 --pretty=%s 2>/dev/null`.strip
  end
end
