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

  # → la SelectDialog s'ouvre, avec un bouton "Autre valeur…" (id du
  #   ParamDefiner = 'genre', pas de suffixe générique : le ConfigDialog
  #   reste ouvert derrière, avec son propre btn-mid invisible)
  wait_for_suffix('genre-btn-mid')
  click_suffix('genre-btn-mid')

  # → une TextFieldDialog s'ouvre pour saisir une valeur libre (même id
  #   'genre', réutilisé par ParamDefiner#onString)
  wait_for('__genre__')
  set_value('__genre__', 'Docu-fiction')

  # - confirmer
  wait_for_suffix('genre-btn-oui')
  click_suffix('genre-btn-oui')

  # - valider le ConfigDialog (Save)
  click("#{panel_id}-btn-oui")

  # → la fiche du projet sur disque doit porter la valeur libre saisie
  wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
    read_project_card(project_id)['genre'] == 'Docu-fiction'
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("définition du genre d'un projet par valeur libre") { run_test }
