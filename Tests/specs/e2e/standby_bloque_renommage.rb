# Test : cliquer sur le titre d'une carte en standby ne déclenche pas la
# dialog de renommage — Project.js#modifyTitle (garde
# `if (this.collapsed) return stopEvent(ev)`)
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet en standby (titre)', collapsed: true)
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # - clic sur le titre de la carte collapsed
  click("#{card_id}-title")

  # → aucune dialog de renommage ouverte
  raise 'Dialog de renommage ouverte alors que la carte est en standby' if exists?('btn-oui')
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("clic sur le titre d'une carte en standby ne déclenche pas de renommage") { run_test }
