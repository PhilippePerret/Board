# Test : archivage d'un projet (bouton "Archiver" de la dialog de
# confirmation, PAS "Retirer" — cf. suppression_projet.rb pour ce cas-là)
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec un projet, créée directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet à archiver')
  launch_app

  card_id = "project-#{project_id}"

  # - le sélectionner (clic sur sa carte)
  wait_for(card_id)
  click(card_id)

  # - jouer "Le retirer"
  wait_for('btn-remove-project')
  click('btn-remove-project')

  # → confirmation avec deux choix : "Archiver" (oui) ou "Retirer" (mid)
  wait_for('btn-oui')
  click('btn-oui')

  # → le projet ne doit plus être affiché
  wait_until(desc: -> { "#{card_id} toujours présent dans l'accessibilité" }) { !exists?(card_id) }

  # → le projet doit avoir été déplacé de projects-in vers projects-out
  wait_until(desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    app_data = read_app_data
    !app_data['projects-in'].to_a.include?(project_id) &&
      app_data['projects-out'].to_a.include?(project_id)
  end

  # → la fiche du projet doit toujours exister (archivage = conservation)
  unless File.exist?(project_card_path(project_id))
    raise "La fiche du projet a disparu de #{PROJECT_CARD_FOLDER}, elle devrait juste changer de statut"
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("archivage d'un projet") { run_test }
