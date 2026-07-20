# Test : redimensionnement de l'horloge (poignée #clock-handle-resize,
# Clock.js onResizeHandleDown/getMaxScale, --clock-scale en CSS calc()).
# Source : demande explicite (2026-07-20), _tests_a_faire.adoc "Tout de
# suite > redimensionnement de l'horloge".
#
# Déroulé : projet fixture avec common_services_data déjà rempli (pas de
# dialogue de définition) -> ouverture de l'horloge -> glissé de
# #clock-handle-resize -> l'horloge ne démarre pas (mousedown/mouseup sur la
# poignée n'atteignent jamais le listener toggle du panneau, cf. stopEvent
# dans onResizeHandleDown/le mouseup dédié) -> la nouvelle taille est
# persistée dans appdata.yaml (clé 'clock-scale') après rechargement complet
# de l'application.

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
    wait_for('clock-handle-resize', 5)

    scale_before = read_app_data['clock-scale']

    # → glissé (mousedown/move/up réels) de la poignée de redimensionnement
    #   vers le haut de l'écran (nom de l'app dans le header) : grossit
    #   nettement, sans jamais démarrer l'horloge au passage
    drag('clock-handle-resize', 'app-name')

    raise "l'horloge a démarré pendant le redimensionnement" if exists?('btn-clock-stop')

    # → persisté (App.saveData debounced ~1s)
    wait_until(5, desc: -> { "appdata.yaml['clock-scale'] = #{read_app_data['clock-scale'].inspect}" }) do
      read_app_data['clock-scale'] && read_app_data['clock-scale'] != scale_before
    end
    scale_after_drag = read_app_data['clock-scale']

    # → persistance après rechargement complet de l'application
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)
    wait_for('clock-dial', 10)

    raise "taille pas persistée après rechargement (#{scale_after_drag.inspect} -> #{read_app_data['clock-scale'].inspect})" unless read_app_data['clock-scale'] == scale_after_drag
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'horloge' : redimensionnement (poignée, pas de démarrage, persistance)") { run_test }
