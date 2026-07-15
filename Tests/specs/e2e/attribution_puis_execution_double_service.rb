# Test : attribution d'un service (glisser-déposer réel) PUIS exécution
# deux fois de suite (dossier fermé entre les deux clics) — même scénario
# que Tests/specs/e2e/execution_double_service.rb, mais sans raccourci :
# le service est attaché via la vraie UI (BoardTest#attach_service_to_project
# — glisser-déposer + les 3 boîtes de dialogue), pas injecté directement
# dans la fixture.
#
# Une seule session d'application du début à la fin, pas de rechargement.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'open-finder-window'
CUSTOM_NAME = 'Ouvrir projet A'

def run_test
  id = nil
  dir = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    dir = fixture_dir
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    uuid = attach_service_to_project(SERVICE_ID, id, fixture_dir, custom_name: CUSTOM_NAME)
    service_card = "service-#{uuid}"

    # - premier clic → le dossier s'ouvre
    click_service_and_wait_folder(service_card, fixture_dir)

    # - on referme le dossier
    close_folder_and_wait(fixture_dir)

    # - attendre 2 secondes
    sleep 2

    # - second clic → le dossier doit se rouvrir
    click_service_and_wait_folder(service_card, fixture_dir)
  end
ensure
  (finder_close_front_window_if_named(File.basename(dir)) rescue nil) if dir
  remove_fixture_project(id) if id
end

board_test("attribution d'un service puis exécution deux fois de suite") { run_test }
