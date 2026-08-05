# Test : service personnalisé "exec-bash-code" ("Exécuter du code
# bash/zsh") — backend/scripts/ExecCommand.sh, un seul param fixe 'code'
# (type 'string', enregistré une fois pour toutes à l'attribution, pas de
# dynParams : le même code est rejoué identique à chaque clic).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 4).
#
# Pas de param 'path' : le code fourni doit lui-même viser un chemin
# absolu (le fixture_dir du test) — ExecCommand.sh ne fait aucun "cd"
# automatique vers le dossier du projet.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'exec-bash-code'
CUSTOM_NAME = 'Marquer le dossier'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"
    marker = File.join(fixture_dir, 'exec-bash-marker.txt')

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
    set_value('__code__', "touch #{marker}")
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
    wait_until(5, desc: -> { "#{marker} pas créé après le 1er clic" }) { File.exist?(marker) }

    # → re-clic sur le service déjà attaché : rejoue le MÊME code sans
    #   redemander le dialogue (pas de dynParams)
    File.delete(marker)
    click(service_card)
    wait_until(5, desc: -> { "#{marker} pas recréé après le 2e clic" }) { File.exist?(marker) }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service personnalisé 'exécuter du code bash' : attribution, exécution puis ré-exécution identique") { run_test }
