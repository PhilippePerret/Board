# Test : service personnalisé "run-chronometre" ("Minuteur"), groupe
# "Prudence"/lifecycle du panneau CUSTOM (pas commun) — partage
# COUNTDOWN_PROPERTIES avec "work-clock" (frontend/js/ServiceData.js,
# front: Clock.instance.toggle) mais, contrairement à "work-clock", c'est un
# service ATTACHÉ par glisser-déposer à une carte de projet (positionné dans
# services['startup']/['others'], déplaçable/retirable comme n'importe quel
# service custom), pas un slot fixe unique dans common_services_data.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 3) — la mécanique Start/Pause/Stop/changelog/todo de
# Clock.js est déjà couverte en détail par service_commun_horloge.rb, pas
# re-testée ici en profondeur : l'objet de ce test est l'attribution par
# glissé + le déclenchement du même widget Clock depuis un service attaché.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'run-chronometre'
CUSTOM_NAME = 'Minuteur du projet'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"

    wait_for(card)
    click(card)

    # → le panneau commun s'ouvre seul à la sélection ; "common-services-panel-toggle"
    #   bascule VERS le panneau personnalisé (cf. toggle_panels_conserve_position.rb)
    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')
    wait_for(SERVICE_ID)

    drag(SERVICE_ID, others_field)

    wait_for('__service-name__')
    set_value('__service-name__', CUSTOM_NAME)
    click_suffix('btn-oui')

    # → 1re définition : durée de session puis durée de tranche (préremplie
    #   avec la session), mêmes params/ids que work-clock (COUNTDOWN_PROPERTIES)
    wait_for('__session-duration__', 10)
    set_value('__session-duration__', '20')
    click_suffix('btn-oui')

    wait_for('__work-duration__', 10)
    prefill = get_value('__work-duration__')
    raise "work-duration pas préremplie avec la session (#{prefill.inspect})" unless prefill == '20'
    set_value('__work-duration__', '15')
    click_suffix('btn-oui')

    uuid = nil
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| Array(s['name']).include?(CUSTOM_NAME) }
      uuid = found['uuid'] if found
      !!found
    end

    # → positionné dans services['others'], PAS dans common_services_data
    #   (contrairement à work-clock) : c'est la différence structurelle qui
    #   permet à ce service d'être déplacé/retiré comme n'importe quel
    #   service personnalisé.
    raise 'run-chronometre ne devrait pas apparaître dans common_services_data' if
      read_project_card(id).dig('common_services_data', 'run-chronometre')

    service_card = "service-#{uuid}"
    wait_for(service_card)

    # → clic sur le service attaché : ouvre le MÊME widget Clock que work-clock
    click(service_card)
    wait_for('clock-dial', 10)
    wait_for('btn-clock-toggle', 5)

    # - Start puis Stop (changelog + todo), comme service_commun_horloge.rb —
    #   juste de quoi refermer proprement, pas re-détaillé ici
    click('clock-dial')
    wait_for('btn-clock-stop', 5)
    click('btn-clock-stop')

    wait_for('__clock_changelog__', 10)
    set_value('__clock_changelog__', 'Test minuteur personnalisé.')
    click_suffix('btn-oui')

    wait_for('__clock_todo__', 10)
    set_value('__clock_todo__', 'Rien à faire')
    click_suffix('btn-oui')

    wait_until(5, desc: -> { 'horloge encore visible après Stop' }) { !visible?('clock-dial') }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service personnalisé 'minuteur' : attribution par glissé, déclenche le widget horloge partagé") { run_test }
