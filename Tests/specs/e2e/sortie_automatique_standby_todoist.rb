# Test : un projet en standby avec une tâche Todoist du jour SANS HEURE doit
# en sortir automatiquement, dès le chargement (pas besoin d'attendre un
# poll : Project.js#reactiveIfTask réactive tout de suite dans la branche
# "sans heure").
# Implémenté dans Project.js#reactiveIfTask.
# Source : Tests/_tests_a_faire.adoc
#
# Utilise le stub Todoist (Tests/support/todoist_e2e_stub.rb) : aucun appel
# réseau réel.

require_relative '../../support/helpers'
require_relative '../../support/todoist_e2e_stub'

include BoardTest

def run_test
  # Todoist renvoie une simple date (pas de "T...") pour une tâche sans heure.
  task = {'id' => 'fixture-task-no-hour', 'content' => 'Tâche du jour sans heure', 'due' => {'date' => Time.now.strftime('%Y-%m-%d')}}

  with_todoist_e2e_stub([{'results' => [task]}]) do |stub_dir|
    project_id = create_fixture_project(title: 'Projet standby + tâche du jour', collapsed: true, todoist_id: 'fixture-todoist-id')
    launch_app

    card_id = "project-#{project_id}"
    wait_for(card_id)

    # → sort automatiquement du standby (tâche du jour sans heure)
    wait_until(desc: -> { "#{card_id} toujours en standby" }) { !has_class?(card_id, 'collapsed') }
  ensure
    remove_fixture_project(project_id) if project_id
  end
end

board_test("sortie auto du standby (tâche du jour)") { run_test }
