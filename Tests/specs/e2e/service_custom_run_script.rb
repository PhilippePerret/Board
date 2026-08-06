# Test : service personnalisé "run-script" ("Jouer un script") —
# backend/scripts/RunScript.rb, dispatch par extension (.rb -> `ruby`,
# .py -> `python3`, .sh -> `bash`, sinon `open`). Un seul param fixe 'path'
# (type 'path', sélection Finder), rejoué identique à chaque clic.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 6) — seule la redéfinition d'un format ancien de ce
# service était couverte (redefinition_service_run_script_format_ancien.rb),
# pas l'exécution réelle.
#
# Script marqueur en `.rb` : sa sortie standard (`puts`) est relayée telle
# quelle dans le message de succès (ServiceExecuter#afterRunService,
# retour.message) — vérifiée via assert_service_message_ok!.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'run-script'
CUSTOM_NAME = 'Script de test'
MARKER = 'run-script-marker-ok'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    script_path = File.join(fixture_dir, 'marker.rb')
    File.write(script_path, %Q(puts "#{MARKER}"\n))
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"

    wait_for(card)
    click(card)
    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')
    wait_for(SERVICE_ID)

    drag(SERVICE_ID, others_field)

    wait_for('__service-name__')
    set_value('__service-name__', CUSTOM_NAME)
    click_suffix('btn-oui')

    wait_for_suffix('btn-oui')
    with_finder_selection(script_path) do
      click_suffix('btn-oui')
    end

    uuid = nil
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| Array(s['name']).include?(CUSTOM_NAME) }
      uuid = found['uuid'] if found
      !!found
    end

    # → l'attribution ne joue PAS le service (Project#addService ne fait que
    #   sauvegarder) : 1er clic explicite requis
    service_card = "service-#{uuid}"
    click(service_card)
    assert_service_message_ok!(timeout: 3, expect: /#{MARKER}/)
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service personnalisé 'jouer un script' : attribution puis exécution réelle (.rb)") { run_test }
