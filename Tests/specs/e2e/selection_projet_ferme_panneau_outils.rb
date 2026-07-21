# Test : sélection d'un projet doit fermer le panneau "Outils" s'il est ouvert.
# Source : demande explicite (2026-07-21).

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet Outils', genre: 'Roman')
  launch_app

  card = "project-#{project_id}"
  wait_for(card)

  click('tools-button')
  wait_for('tools-panel')
  raise 'tools-panel pas ouvert après clic sur "Outils"' unless panel_open?('tools-panel')

  click(card)

  wait_until(5, desc: -> { 'tools-panel encore ouvert après sélection du projet' }) do
    !panel_open?('tools-panel')
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('sélection d\'un projet : ferme le panneau "Outils" s\'il est ouvert') { run_test }
