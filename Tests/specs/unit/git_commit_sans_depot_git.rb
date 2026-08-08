# Test : Git.commit (backend/lib/git.rb, service 'git-commit',
# backend/scripts/GitOpes.rb) — chemin de code SÉPARÉ des services
# gh/ExecCommand.sh (create-git-issue, gh-issue-create, git-issue-list) :
# aucun garde-fou non plus, mais PIRE ici — `commit` ne vérifie jamais
# $?.success? après `git add/commit/push`. Résultat actuel sur un dossier
# sans .git : {"ok":true, "error":null, "res":"fatal: not a git
# repository..."} — faux succès silencieux, pas juste une erreur brute
# relayée comme pour gh.
#
# Test unitaire (pas d'app lancée) : invoque GitOpes.rb en sous-processus,
# comme backend/lib/exec_script.rb le ferait pour le service 'git-commit'.

require_relative '../../support/helpers_base'
include BoardTest

GIT_OPES_RB = File.join(BoardTest::ROOT, 'backend', 'scripts', 'GitOpes.rb')

def run_test
  Dir.mktmpdir('board-test-no-git-') do |dir|
    out = IO.popen(['ruby', GIT_OPES_RB, 'commit', dir, '[]', 'message de test'], err: [:child, :out], &:read)
    data = JSON.parse(out)

    raise "un échec (ok: false) était attendu (pas de dépôt git), obtenu #{data.inspect}" if data['ok']
    raise "'error' devrait porter l'échec (actuellement muet, seul 'res' contient l'erreur brute), obtenu #{data.inspect}" if
      data['error'].nil?
  end
end

board_test("GitOpes.rb (commit) : signale un échec clair quand le dossier n'est pas un dépôt git") { run_test }
