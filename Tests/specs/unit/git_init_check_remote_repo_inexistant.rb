# Test : Git.check_remote_repo (backend/lib/git.rb) — dépôt qui n'existe
# pas sur Github. Lecture seule (`gh api`), ne crée jamais rien.

require_relative '../../support/git_class_helpers'
include BoardTest
include GitClassTestHelpers

def run_test
  account, name = unlikely_nonexistent_repo
  status = Git.check_remote_repo(account, name)

  raise "ok:true attendu, obtenu #{status.inspect}" unless status[:ok]
  raise "exists:false attendu, obtenu #{status.inspect}" if status[:exists]
  raise "error nil attendu, obtenu #{status.inspect}" unless status[:error].nil?
end

board_test("Git.check_remote_repo : dépôt inexistant détecté, lecture seule") { run_test }
