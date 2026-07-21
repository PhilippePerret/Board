# Test : panneau extra-data fermé manuellement (bouton "Fermer") sur un
# projet A, puis sélection d'un projet B → le panneau reste fermé (aucune
# tentative de le rouvrir/l'adapter).
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 7.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id_a = create_fixture_project(title: 'Projet A', genre: 'Roman')
  project_id_b = create_fixture_project(title: 'Projet B', genre: 'Jeu')
  launch_app

  card_a = "project-#{project_id_a}"
  card_b = "project-#{project_id_b}"
  panel_a = "projet-extradata-panel-#{project_id_a}"

  wait_for(card_a)
  click(card_a)
  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')
  wait_for(panel_a)
  raise 'panneau pas ouvert après le clic' unless panel_open?(panel_a)

  click("#{panel_a}-close")
  wait_until(desc: -> { 'panneau toujours ouvert après clic sur "Fermer"' }) { !panel_open?(panel_a) }

  click(card_b)

  raise 'panneau rouvert après changement de projet alors qu\'il avait été fermé manuellement' if panel_open?(panel_a)
  raise 'Board a quitté après changement de projet, panneau fermé' unless board_running?
ensure
  remove_fixture_project(project_id_a) if project_id_a
  remove_fixture_project(project_id_b) if project_id_b
end

board_test('panneau extra-data : fermé manuellement, reste fermé au changement de projet') { run_test }
