# Test : Git.init_for_project — dossier déjà gité localement (.git présent)
# -> doit bloquer IMMÉDIATEMENT avec 'backend-already-git', sans jamais
# interroger Github (aucun accès réseau nécessaire pour ce cas).

require_relative '../../support/git_class_helpers'
include BoardTest
include GitClassTestHelpers

def run_test
  Dir.mktmpdir('board-test-git-init-') do |dir|
    system('git', 'init', '-q', dir, out: File::NULL, err: File::NULL)

    retour = Git.init_for_project(dir, 'PhilippePerret', 'peu-importe', [])

    raise "ok:false attendu, obtenu #{retour.inspect}" if retour[:ok]
    raise "error backend-already-git attendu, obtenu #{retour.inspect}" \
      unless retour[:error] == ['backend-already-git']
  end
end

board_test("Git.init_for_project : .git déjà présent, bloqué avant tout accès réseau") { run_test }
