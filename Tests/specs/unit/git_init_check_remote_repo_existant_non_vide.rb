# Test : Git.check_remote_repo — dépôt existant et NON vide (Repo-For-Tests,
# le dépôt jetable réel déjà utilisé pour les tests du cycle PR, qui contient
# déjà des commits) -> doit bloquer avec 'git-init-repo-exists-not-empty'.
# Lecture seule (`gh api`), ne modifie jamais ce dépôt.

require_relative '../../support/git_class_helpers'
include BoardTest
include GitClassTestHelpers

def run_test
  account, name = EXISTING_NOT_EMPTY_REPO
  status = Git.check_remote_repo(account, name)

  raise "ok:true attendu, obtenu #{status.inspect}" unless status[:ok]
  raise "exists:true attendu, obtenu #{status.inspect}" unless status[:exists]
  raise "error git-init-repo-exists-not-empty attendu, obtenu #{status.inspect}" \
    unless status[:error] == ['git-init-repo-exists-not-empty', "#{account}/#{name}"]
end

board_test("Git.check_remote_repo : dépôt existant non vide, bloqué (réseau réel, lecture seule)") { run_test }
