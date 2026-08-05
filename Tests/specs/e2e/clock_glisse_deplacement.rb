# Test : glissé de déplacement du panneau horloge entier (poignée
# #clock-handle-move, Draggable#listenMove/onMoveHandleDown/onDragMove,
# frontend/js/Draggable.js — mécanique PARTAGÉE avec SidePanel, cf.
# frontend/js/SidePanel.js:93). Seul le redimensionnement
# (#clock-handle-resize) était couvert par un vrai glissé souris
# (service_commun_horloge_redimensionnement.rb), pas ce déplacement.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section D point 16).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'work-clock'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(
      title: 'Projet A', path: fixture_dir,
      'common_services_data' => { 'work-clock' => [[20], [15]] }
    )
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    wait_for('clock-dial', 10)
    wait_for('clock-handle-move', 5)

    left_before = bridge_eval("document.querySelector('.clock-panel')?.getBoundingClientRect().left").to_f

    # → glissé réel (mousedown/move/up) vers le nom de l'app dans le header
    drag('clock-handle-move', 'app-name')

    raise "l'horloge a démarré pendant le déplacement" if visible?('btn-clock-stop')

    left_after = bridge_eval("document.querySelector('.clock-panel')?.getBoundingClientRect().left").to_f
    raise "le panneau horloge n'a pas bougé (left avant=#{left_before}, après=#{left_after})" if (left_after - left_before).abs < 5
  end
ensure
  remove_fixture_project(id) if id
end

board_test("horloge : glissé réel de la poignée de déplacement, sans démarrer le minuteur") { run_test }
