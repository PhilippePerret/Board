# Test : panneau extra-data (ProjectExtraDataPanel) jamais ouvert de toute
# la session — sélectionner puis redésélectionner un projet ne doit pas
# planter, même si le panneau (frontend/js/ProjectExtraData.js) n'a jamais
# été construit.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 1.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet A', genre: 'Roman')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "projet-extradata-panel-#{project_id}"

  # → jamais construit avant le 1er clic sur "Extra Data"
  raise 'projet-extradata-panel présent dans le DOM avant tout clic sur "Extra Data"' if exists?(panel_id)

  wait_for(card_id)
  click(card_id)
  click(card_id) # redésélection, panneau toujours pas construit

  raise 'projet-extradata-panel construit alors qu\'il n\'a jamais été ouvert' if exists?(panel_id)
  raise 'Board a quitté après sélection/redésélection sans jamais ouvrir le panneau' unless board_running?
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data jamais ouvert : sélection/redésélection sans crash') { run_test }
