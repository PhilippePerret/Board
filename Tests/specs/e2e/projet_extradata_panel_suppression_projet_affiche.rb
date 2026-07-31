# Test : suppression du projet actuellement affiché dans le ConfigDialog
# (ouvert dessus) → pas de crash côté Board.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 10.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet A', genre: 'Roman')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "project-#{project_id}-panel-data"

  wait_for(card_id)
  click(card_id)
  wait_for('btn-deal-project-data')
  click('btn-deal-project-data')
  wait_for(panel_id)

  click('btn-remove-project')
  wait_for_suffix('btn-mid')
  click_suffix('btn-mid')

  wait_until(desc: -> { "#{card_id} toujours présent dans l'accessibilité" }) { !exists?(card_id) }
  raise 'Board a quitté après suppression du projet affiché dans le ConfigDialog ouvert' unless board_running?
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : suppression du projet affiché ferme le panneau') { run_test }
