# Test : glissé réel souris d'un SidePanel (poignée gauche
# #common-services-panel-handle-left, Draggable#onMoveHandleDown/onDragMove,
# frontend/js/Draggable.js — même mécanique que Clock.js, cf.
# clock_glisse_deplacement.rb). Jusqu'ici la position d'un SidePanel n'était
# jamais posée par un VRAI glissé souris dans les tests (toggle_panels_
# conserve_position.rb et panels_open_at_last_dragged_position.rb simulent
# la position directement en bridge_eval).
#
# Id ajouté sur les poignées (SidePanel.js#build, `${this.domId}-handle-
# left`/`-right`) : elles n'en avaient aucun (seulement des classes),
# `drag()` (Tests/support/helpers_base.rb) cible par id — nécessaire pour
# écrire ce test.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section D point 17).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre seul à la sélection
    wait_for('common-services-panel')
    wait_for('common-services-panel-handle-left')

    left_before = bridge_eval("document.getElementById('common-services-panel').getBoundingClientRect().left").to_f

    # → glissé réel (mousedown/move/up) vers le nom de l'app dans le header
    drag('common-services-panel-handle-left', 'app-name')

    left_after = bridge_eval("document.getElementById('common-services-panel').getBoundingClientRect().left").to_f
    raise "le panneau n'a pas bougé (left avant=#{left_before}, après=#{left_after})" if (left_after - left_before).abs < 5
  end
ensure
  remove_fixture_project(id) if id
end

board_test("SidePanel : glissé réel de la poignée gauche déplace le panneau") { run_test }
