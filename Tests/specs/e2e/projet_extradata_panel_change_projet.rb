# Test : panneau extra-data ouvert sur un projet A, sélection d'un projet B
# (sans déselectionner A à la main) → panneau reste ouvert et réadapté à B,
# une modif faite depuis B s'applique à B (pas à A), retour sur A réadapte
# le panneau à A.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 4, 5, 6.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id_a = create_fixture_project(title: 'Projet A', genre: 'Roman')
  project_id_b = create_fixture_project(title: 'Projet B', genre: 'Jeu')
  launch_app

  card_a = "project-#{project_id_a}"
  card_b = "project-#{project_id_b}"
  panel_a = "projet-extradata-panel-#{project_id_a}"
  panel_b = "projet-extradata-panel-#{project_id_b}"
  genre_a = "project-extradata-#{project_id_a}-genre"
  genre_b = "project-extradata-#{project_id_b}-genre"

  wait_for(card_a)
  click(card_a)
  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')
  wait_for(panel_a)

  # - cas 4 : sélection de B sans déselectionner A à la main
  click(card_b)

  raise 'panneau fermé après sélection de B' unless panel_open?(panel_b)
  wait_until(desc: -> { "genre affiché = #{get_text(genre_b).inspect}" }) do
    get_text(genre_b).include?('Jeu')
  end

  # - cas 5 : modifier une valeur depuis B → s'applique à B, pas à A
  click(genre_b)
  wait_for('__genre__')
  set_value('__genre__', 'Application')
  click('btn-oui')

  wait_until(desc: -> { "carte B = #{read_project_card(project_id_b).inspect}" }) do
    read_project_card(project_id_b)['genre'] == 'Application'
  end
  raise 'la modif faite depuis B a été appliquée à A' if read_project_card(project_id_a)['genre'] == 'Application'
  raise 'carte A modifiée alors que seule B était affichée' unless read_project_card(project_id_a)['genre'] == 'Roman'

  # - cas 6 : resélectionner A → panneau réadapté à A
  click(card_a)

  raise 'panneau fermé après retour sur A' unless panel_open?(panel_a)
  wait_until(desc: -> { "genre affiché = #{get_text(genre_a).inspect}" }) do
    get_text(genre_a).include?('Roman')
  end
ensure
  remove_fixture_project(project_id_a) if project_id_a
  remove_fixture_project(project_id_b) if project_id_b
end

board_test('panneau extra-data : changement de projet sans le fermer, réadapté à chaque fois') { run_test }
