# Test : définition du genre (extra-data) d'un projet
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec un projet, créée directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet à genrer')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "project-#{project_id}-panel-data"

  # - le sélectionner (clic sur sa carte)
  wait_for(card_id)
  click(card_id)

  # - ouvrir le dialogue de configuration du projet (ConfigDialog)
  wait_for('btn-deal-project-data')
  click('btn-deal-project-data')

  # → la ligne "genre" est affichée dans le dialogue
  wait_for("#{panel_id}-genre-value")
  click("#{panel_id}-genre-value")

  # → une SelectDialog s'ouvre avec les valeurs de GENRES_PROJETS (id du
  #   ParamDefiner = 'genre', PAS de suffixe générique 'btn-oui' seul : le
  #   ConfigDialog reste ouvert derrière, donc ambigu sans qualifier par id)
  wait_for('__genre__')
  set_value('__genre__', 'Application')

  # - confirmer la SelectDialog
  wait_for_suffix('genre-btn-oui')
  click_suffix('genre-btn-oui')

  # - valider le ConfigDialog (Save)
  click("#{panel_id}-btn-oui")

  # → la fiche du projet sur disque doit porter le genre choisi
  wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
    read_project_card(project_id)['genre'] == 'Application'
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("définition du genre d'un projet") { run_test }
