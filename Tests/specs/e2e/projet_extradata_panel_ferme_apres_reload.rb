# Test : rechargement de l'app pendant que le ConfigDialog du projet était
# ouvert → après reload, dialogue fermé par défaut (App.init reconstruit la
# page depuis zéro, aucun état de dialogue ouvert n'est persisté).
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 9.

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

  launch_app # relance Board (kill + reopen), pendant que le dialogue était ouvert

  wait_for(card_id)
  raise 'ConfigDialog déjà reconstruit juste après le reload' if exists?(panel_id)
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : fermé par défaut après un rechargement') { run_test }
