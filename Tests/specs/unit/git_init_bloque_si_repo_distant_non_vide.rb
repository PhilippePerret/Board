# Test : Git.init_for_project — dossier local propre (pas encore gité), mais
# dépôt distant (Repo-For-Tests) déjà existant et non vide -> doit bloquer
# AVANT toute initialisation locale (aucun `.git` créé dans le dossier).

require_relative '../../support/git_class_helpers'
include BoardTest
include GitClassTestHelpers

def run_test
  account, name = EXISTING_NOT_EMPTY_REPO
  Dir.mktmpdir('board-test-git-init-') do |dir|
    retour = Git.init_for_project(dir, account, name, [])

    raise "ok:false attendu, obtenu #{retour.inspect}" if retour[:ok]
    raise "error git-init-repo-exists-not-empty attendu, obtenu #{retour.inspect}" \
      unless retour[:error] == ['git-init-repo-exists-not-empty', "#{account}/#{name}"]

    raise "aucun .git ne devrait avoir été créé localement" if File.exist?(File.join(dir, '.git'))
  end
end

board_test("Git.init_for_project : dépôt distant non vide, bloqué avant toute init locale (réseau réel)") { run_test }
