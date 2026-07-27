require_relative '../../support/todoist_stub'
include BoardTest

# Vérifie le garde-fou de Todoist.request lui-même (pas le stub réseau) :
# sans token, aucune tentative réseau ne doit être faite.
def run_test
  original_token = Todoist.method(:token)
  Todoist.define_singleton_method(:token) { nil }

  raised = false
  begin
    Todoist.request(:get, '/projects')
  rescue => e
    raised = true
    raise "message attendu mentionnant le token, obtenu #{e.message.inspect}" unless e.message.include?('Token')
  end
  raise "token manquant : une exception était attendue" unless raised
ensure
  Todoist.define_singleton_method(:token, original_token)
end

board_test("Todoist.request : token manquant → erreur avant toute tentative réseau") { run_test }
