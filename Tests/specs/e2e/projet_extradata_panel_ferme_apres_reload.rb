# Test : rechargement de l'app pendant que le panneau extra-data était
# ouvert → après reload, panneau fermé par défaut (App.init reconstruit la
# page, aucun état de panneau ouvert n'est persisté).
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 9.

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

  launch_app # relance Board (kill + reopen), pendant que le panneau était ouvert

  wait_for(card_id)
  raise 'panneau extra-data déjà construit juste après le reload' if exists?(panel_id)
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : fermé par défaut après un rechargement') { run_test }
