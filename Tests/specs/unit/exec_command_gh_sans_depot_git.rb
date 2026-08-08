# Test : ExecCommand.sh (backend/scripts/, utilisé par tous les services
# 'gh' — create-git-issue, gh-issue-create, git-issue-list, ServiceData.js)
# n'a AUCUN garde-fou quand le dossier du projet n'est pas un dépôt git.
# `gh issue create` échoue avec le message brut de git ("failed to run git:
# fatal: not a git repository...") relayé tel quel côté app — pas de
# message clair pour l'utilisateur.
#
# Test unitaire (pas d'app lancée) : appelle ExecCommand.sh directement,
# comme backend/lib/exec_script.rb le ferait, sur un dossier tmp SANS git.

require_relative '../../support/helpers_base'
require 'shellwords'
include BoardTest

EXEC_COMMAND_SH = File.join(BoardTest::ROOT, 'backend', 'scripts', 'ExecCommand.sh')

def run_test
  Dir.mktmpdir('board-test-no-git-') do |dir|
    cmd = "cd #{dir.shellescape} && gh issue create -l bug -t test -b test"
    out = IO.popen(['zsh', EXEC_COMMAND_SH, cmd], err: [:child, :out], &:read)
    data = JSON.parse(out)

    raise "un échec (ok: false) était attendu (pas de dépôt git), obtenu #{data.inspect}" if data['ok']

    raise "message d'erreur pas assez clair pour l'utilisateur, obtenu #{data['error'].inspect}" unless
      data['error'] =~ /pas.*d[ée]p[ôo]t git|n'est pas un d[ée]p[ôo]t git/i
  end
end

board_test("ExecCommand.sh : message clair (pas l'erreur brute de git) quand le dossier n'est pas un dépôt git") { run_test }
