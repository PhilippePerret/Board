# Test : définition du genre (extra-data) d'un projet par valeur libre
# (bouton "Autre valeur…" de la SelectDialog, pas un choix dans la liste)
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec un projet, créée directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet à genrer (libre)')
  launch_app

  card_id = "project-#{project_id}"

  # - le sélectionner (clic sur sa carte)
  wait_for(card_id)
  click(card_id)

  # - ouvrir le panneau des extra-data
  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')

  # → la ligne "genre" est affichée dans le panneau
  wait_for("project-extradata-#{project_id}-genre")
  click("project-extradata-#{project_id}-genre")

  # → la SelectDialog s'ouvre, avec un bouton "Autre valeur…"
  wait_for('btn-mid')
  click('btn-mid')

  # → une TextFieldDialog s'ouvre pour saisir une valeur libre
  wait_for('__genre__')
  set_value('__genre__', 'Docu-fiction')

  # - confirmer
  wait_for('btn-oui')
  click('btn-oui')

  # → la fiche du projet sur disque doit porter la valeur libre saisie
  wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
    read_project_card(project_id)['genre'] == 'Docu-fiction'
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("définition du genre d'un projet par valeur libre") { run_test }
