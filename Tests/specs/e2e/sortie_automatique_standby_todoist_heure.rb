# Test : un projet en standby avec une tâche Todoist du jour à une heure
# future reste en standby jusqu'à cette heure, puis en sort automatiquement.
# Fonctionnalité pas encore implémentée — pending jusqu'à son développement.
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def run_test
  pending("Sortie auto du standby à l'heure d'une tâche Todoist future : pas encore implémenté")

  project_id = create_fixture_project(title: 'Projet standby + tâche à heure future', collapsed: true, todoist_id: 'fixture-todoist-id')
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # → reste en standby tant que l'heure n'est pas venue
  raise "#{card_id} déjà sorti du standby avant l'heure prévue" unless has_class?(card_id, 'collapsed')

  # → sort du standby une fois l'heure de la tâche atteinte
  wait_until(desc: -> { "#{card_id} toujours en standby après l'heure prévue" }) { !has_class?(card_id, 'collapsed') }
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("sortie auto du standby à l'heure d'une tâche future") { run_test }
