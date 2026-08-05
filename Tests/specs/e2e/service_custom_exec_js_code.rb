# Test : service personnalisé "exec-js-code" ("Exécuter du code
# javascript") — Service.evalJavascript, un `front` (pas de script backend
# du tout, cf. ServiceExecuter#sendToScript : this.front prioritaire,
# retourne avant le moindre appel serveur). Un seul param fixe 'code' (type
# 'string'), rejoué identique à chaque clic (pas de dynParams).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 5).
#
# Pas de message générique de succès à attendre ici (contrairement aux
# services backend) puisque `front` court-circuite tout le mécanisme
# afterRunService/message(true, …service-success…) — l'effet est vérifié
# directement via une variable posée sur `window` par le code exécuté.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'exec-js-code'
CUSTOM_NAME = 'Compteur JS de test'
CODE = "window.__execjs_marker = (window.__execjs_marker||0)+1"

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
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

    wait_for('__code__')
    set_value('__code__', CODE)
    click_suffix('btn-oui')

    uuid = nil
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| Array(s['name']).include?(CUSTOM_NAME) }
      uuid = found['uuid'] if found
      !!found
    end

    # → l'attribution ne joue PAS le service (Project#addService ne fait que
    #   sauvegarder, cf. frontend/js/Project.js) : 1er clic explicite requis
    service_card = "service-#{uuid}"
    click(service_card)
    wait_until(5, desc: -> { "marqueur JS = #{(bridge_eval('String(window.__execjs_marker||0)') rescue '(erreur)').inspect}" }) do
      bridge_eval('String(window.__execjs_marker||0)') == '1'
    end

    # → re-clic sur le service attaché : rejoue le MÊME code, sans dialogue
    click(service_card)
    wait_until(5, desc: -> { "marqueur JS pas incrémenté au 2e clic = #{(bridge_eval('String(window.__execjs_marker||0)') rescue '(erreur)').inspect}" }) do
      bridge_eval('String(window.__execjs_marker||0)') == '2'
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service personnalisé 'exécuter du code javascript' : attribution, exécution puis ré-exécution") { run_test }
