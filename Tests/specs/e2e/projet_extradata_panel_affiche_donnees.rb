# Test : ouverture du ConfigDialog sur un projet sélectionné → affiche bien
# les données de CE projet.
# Source : .claude/2026-07-18-Etat-fin-de-session.md, Partie 3, cas 2.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet A', genre: 'Roman')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "project-#{project_id}-panel-data"
  genre_id = "#{panel_id}-genre-value"

  wait_for(card_id)
  click(card_id)

  wait_for('btn-deal-project-data')
  click('btn-deal-project-data')

  wait_for(panel_id)

  wait_until(desc: -> { "genre affiché = #{get_text(genre_id).inspect}" }) do
    get_text(genre_id).include?('Roman')
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : ouverture affiche les données du projet sélectionné') { run_test }
