# Test : récupération d'un projet archivé (remise en projet courant)
# Source : Tests/_tests_a_faire.adoc / .claude/project_todo_projets.md
#
# Setup : fixture créée directement dans projects-out (archivé), app relancée
# pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_archived_project(title: 'Projet archivé à récupérer')
  launch_app

  card_id = "project-#{project_id}"

  # → le projet est archivé, donc pas affiché au démarrage
  raise "#{card_id} visible alors qu'il est archivé" if exists?(card_id)

  # - ouvrir le dialogue d'ajout de projet
  click('btn-add-project')
  wait_for('btn-oui')

  # - jouer "Archives…"
  wait_for('btn-mid')
  click('btn-mid')

  # → la liste des projets archivés s'affiche
  wait_for_prefix('__panel-')
  set_value_prefix('__panel-', project_id)

  # - confirmer ("Celui-là")
  click('btn-oui')

  # → le projet réapparaît dans le panneau
  wait_for(card_id)

  # → appdata.json : le projet doit être repassé de projects-out à projects-in
  wait_until(desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    app_data = read_app_data
    app_data['projects-in'].to_a.include?(project_id) &&
      !app_data['projects-out'].to_a.include?(project_id)
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("récupération d'un projet archivé") { run_test }
