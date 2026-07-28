# Test : un projet en standby avec une tâche Todoist du jour (sans heure,
# ou avec une heure déjà passée) doit en sortir automatiquement.
# Fonctionnalité pas encore implémentée (rien dans Project.js ne gère ça
# actuellement) — pending jusqu'à son développement.
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def run_test
  pending('Sortie auto du standby via tâches Todoist du jour : pas encore implémenté')

  project_id = create_fixture_project(title: 'Projet standby + tâche du jour', collapsed: true, todoist_id: 'fixture-todoist-id')
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # → sort automatiquement du standby (tâche du jour sans heure ou heure passée)
  wait_until(desc: -> { "#{card_id} toujours en standby" }) { !has_class?(card_id, 'collapsed') }
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("sortie auto du standby (tâche du jour)") { run_test }
