# Test : révélation du panneau des services au démarrage (bouton "GO !",
# Project.js#buildStartupContainer).
# Bug signalé en live (2026-07-21), 3 points :
#   - le meta+clic (sur le bouton GO! lui-même) ne doit PAS lancer les services
#   - le message d'astuce doit s'afficher dans le footer (#message), pas dans
#     un div sous le bouton
#   - le panneau des services doit devenir réellement VISIBLE, pas seulement
#     présent dans le DOM
#
# Setup : 1 service "open-folder-project" attaché en "startup" — suffisant
# pour vérifier révélation/non-lancement (le retrait par glissement est testé
# séparément, Tests/specs/e2e/retrait_services_startup.rb).

require_relative '../../support/helpers'

include BoardTest

def check_finder_window_not_open_on(dir)
  expected = File.realpath(dir)
  targets = finder_snapshot_windows.lines.map { |l| l.split("\t").first }
  found = targets.any? { |t| (File.realpath(t) rescue nil) == expected }
  raise "une fenêtre Finder est ouverte sur #{dir.inspect} : les services startup ont été lancés à tort" if found
end

def run_test
  id = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    service = fixture_open_folder_service(fixture_dir, name: 'Service 1', type: 'startup')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [service], 'others' => [] })
    launch_app

    card = "service-#{service['uuid']}"
    btn_startup = "project-#{id}-btn-startup"
    startup_container = "project-#{id}-startup-container"
    startup_panel = "project-#{id}-startup-services"

    wait_for("project-#{id}")
    wait_until(desc: -> { 'bouton GO! absent alors qu\'un service au démarrage est attaché' }) { exists?(btn_startup) }

    # → survol : message d'astuce dans le footer, pas un div sous le bouton
    hover(startup_container)
    wait_until(desc: -> { "message = #{(get_text('message') rescue '(erreur)').inspect}" }) do
      get_text('message').include?('clic')
    end

    # - meta+clic sur le bouton GO! lui-même : révèle le panneau
    meta_click(btn_startup)
    wait_until(desc: -> { 'carte du service startup jamais révélée après meta+clic' }) { exists?(card) }
    raise 'panneau des services startup pas visible après meta+clic' unless visible?(startup_panel)

    # → le meta+clic ne doit PAS avoir lancé les services (aucune fenêtre
    #   Finder ouverte sur le dossier du projet)
    sleep 2
    check_finder_window_not_open_on(fixture_dir)
    raise 'Board a quitté après meta+clic sur GO!' unless board_running?
  end
ensure
  remove_fixture_project(id) if id
end

board_test("révélation du panneau des services au démarrage : message footer, visibilité, pas de lancement") { run_test }
