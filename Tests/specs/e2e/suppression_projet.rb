# Test : suppression d'un projet
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec un projet, créée directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet à retirer')
  launch_app

  card_id = "project-#{project_id}"

  # - le sélectionner (clic sur sa carte)
  wait_for(card_id)
  click(card_id)

  # - jouer "Le retirer"
  wait_for('btn-remove-project')
  click('btn-remove-project')

  # - confirmer
  wait_for('btn-oui')
  click('btn-oui')

  # → le projet ne doit plus être affiché
  wait_until(5, desc: -> { "#{card_id} toujours présent dans l'accessibilité" }) { !exists?(card_id) }

  # → le projet doit avoir été retiré de appdata.json (projects-in → projects-out)
  wait_until(5, desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    app_data = read_app_data
    !app_data['projects-in'].to_a.include?(project_id) &&
      app_data['projects-out'].to_a.include?(project_id)
  end

  # → la fiche du projet doit toujours exister dans project-cards
  unless File.exist?(project_card_path(project_id))
    raise "La fiche du projet a disparu de #{PROJECT_CARD_FOLDER}, elle devrait juste changer de statut"
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("suppression d'un projet") { run_test }
