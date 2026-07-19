# Test : plusieurs changements de projet à la suite, panneau extra-data
# jamais ouvert → aucune tentative d'adaptation, pas de crash.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 8.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id_a = create_fixture_project(title: 'Projet A', genre: 'Roman')
  project_id_b = create_fixture_project(title: 'Projet B', genre: 'Jeu')
  project_id_c = create_fixture_project(title: 'Projet C', genre: 'Film')
  launch_app

  card_a = "project-#{project_id_a}"
  card_b = "project-#{project_id_b}"
  card_c = "project-#{project_id_c}"

  wait_for(card_a)
  click(card_a)
  click(card_b)
  click(card_c)
  click(card_a)
  click(card_c)

  raise 'projet-extradata-panel construit alors qu\'il n\'a jamais été ouvert' if exists?('projet-extradata-panel')
  raise 'Board a quitté après plusieurs changements de projet, panneau jamais ouvert' unless board_running?
ensure
  remove_fixture_project(project_id_a) if project_id_a
  remove_fixture_project(project_id_b) if project_id_b
  remove_fixture_project(project_id_c) if project_id_c
end

board_test('panneau extra-data : changements de projet successifs sans jamais ouvrir le panneau') { run_test }
