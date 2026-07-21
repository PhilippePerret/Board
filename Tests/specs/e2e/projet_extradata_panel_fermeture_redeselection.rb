# Test : panneau extra-data ouvert sur un projet, redésélectionner ce même
# projet (clic sur sa carte déjà sélectionnée) → le panneau se ferme.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 3.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet A', genre: 'Roman')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "projet-extradata-panel-#{project_id}"

  wait_for(card_id)
  click(card_id)

  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')

  wait_for(panel_id)
  raise 'panneau pas ouvert après le clic' unless panel_open?(panel_id)

  click(card_id) # redésélection

  wait_until(desc: -> { 'panneau toujours ouvert après redésélection du projet' }) do
    !panel_open?(panel_id)
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : redésélection du même projet ferme le panneau') { run_test }
