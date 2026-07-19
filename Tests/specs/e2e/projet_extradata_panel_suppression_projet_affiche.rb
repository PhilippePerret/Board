# Test : suppression du projet actuellement affiché dans le panneau
# extra-data (ouvert dessus) → le panneau se ferme, pas de crash.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 10 ;
# fermeture explicitement demandée le 2026-07-19 (Project.js#afterRemove
# appelle maintenant updateOpenedPanel()).

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet A', genre: 'Roman')
  launch_app

  card_id = "project-#{project_id}"

  wait_for(card_id)
  click(card_id)
  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')
  wait_for('projet-extradata-panel')
  raise 'panneau pas ouvert après le clic' unless panel_open?('projet-extradata-panel')

  click('btn-remove-project')
  wait_for('btn-mid')
  click('btn-mid')

  wait_until(desc: -> { "#{card_id} toujours présent dans l'accessibilité" }) { !exists?(card_id) }
  wait_until(desc: -> { 'panneau toujours ouvert après suppression du projet affiché' }) { !panel_open?('projet-extradata-panel') }
  raise 'Board a quitté après suppression du projet affiché dans le panneau ouvert' unless board_running?
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : suppression du projet affiché ferme le panneau') { run_test }
