# Test : cliquer sur une carte en standby ne la sélectionne pas —
# Project.js#onMouseDown (garde `if (this.collapsed) return stopEvent(ev)`)
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet en standby (sélection)', collapsed: true)
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # - clic sur la carte collapsed
  click(card_id)

  # → pas sélectionnée (pas de classe 'selected', comportement normal de
  # Project.constructor.onSelect)
  raise "#{card_id} sélectionnée alors qu'elle est en standby" if has_class?(card_id, 'selected')
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("clic sur une carte en standby ne la sélectionne pas") { run_test }
