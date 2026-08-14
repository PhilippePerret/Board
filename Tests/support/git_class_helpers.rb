# Helpers pour tester directement les méthodes de classe de Git
# (backend/lib/git.rb, check_remote_repo/create_remote_repo/init_for_project)
# — appel direct de la lib (pas de sous-processus), lecture seule côté
# Github (aucune création/suppression de dépôt réel dans ces tests).

require_relative 'helpers_base'
require_relative '../../backend/lib/git.rb'

module GitClassTestHelpers
  EXISTING_NOT_EMPTY_REPO = ['PhilippePerret', 'Repo-For-Tests']

  # Nom de compte/repo garanti inexistant (lecture seule, ne le crée jamais).
  def unlikely_nonexistent_repo
    ['PhilippePerret', "repo-inexistant-test-#{Time.now.to_i}-#{rand(36**4).to_s(36)}"]
  end
end
