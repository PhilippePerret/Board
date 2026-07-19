# Test : exécution réelle du service custom "open-file" (Ouvrir le
# fichier…, backend/scripts/OpenFile.sh) — service DÉJÀ attaché
# (BoardTest#fixture_open_file_service), l'attribution elle-même est testée
# séparément (attribution_service_ouvrir_fichier_*.rb).
# Source : demande explicite (2026-07-19).
#
# "Finder" comme logiciel de test (comme service_commun_edit_documentation.rb) :
# app forcément présente, effet observable fiable (finder_front_window_name)
# sans dépendre d'un éditeur tiers installé sur la machine de test. Path =
# le dossier du projet lui-même (pas un fichier) : "open -a Finder <fichier>"
# ne fait que le sélectionner dans une fenêtre déjà ouverte (pas de nouvelle
# fenêtre détectable), alors qu'un dossier en ouvre bien une, comme
# open-folder-project.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  dir = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    dir = fixture_dir
    service = fixture_open_file_service(fixture_dir, 'Finder')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    wait_for("project-#{id}")
    service_card = "service-#{service['uuid']}"

    click_service_and_wait_folder(service_card, fixture_dir)
  end
ensure
  (finder_close_front_window_if_named(File.basename(dir)) rescue nil) if dir
  remove_fixture_project(id) if id
end

board_test("service 'Ouvrir le fichier…' : exécution réelle (logiciel = Finder)") { run_test }
