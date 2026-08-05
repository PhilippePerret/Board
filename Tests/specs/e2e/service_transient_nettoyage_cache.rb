# Test : un service commun `transient` (au moins un param `transient:
# true`, ex. 'code' de "Terminal au dossier") joué depuis le panneau crée à
# CHAQUE clic une instance dupliquée fraîche (Service#duplicateService,
# uuid généré), enregistrée dans le dictionnaire interne Service.services
# (Service#add, appelé par le constructeur). Après une exécution réussie,
# ServiceExecuter#afterRunService la retire de ce dictionnaire
# (Service.remove(service.uuid), frontend/js/ServiceExecuter.js:120-123) —
# sans quoi ce dictionnaire grossirait indéfiniment à chaque clic.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section C point 13). service_commun_param_transient.rb couvre déjà le
# remplacement de la valeur par le sentinel ':transient:' et la
# redemande du dialogue (mécanisme DIFFÉRENT : Service#ensureServiceData
# court-circuite sur `this.transient` avant même de regarder
# common_services_data) — pas le nettoyage du dictionnaire lui-même.
#
# Vérifié indirectement : la taille de Service.services (nombre de clés)
# revient à sa valeur de départ après chaque exécution, sur 2 clics
# successifs (pas juste "ne grossit pas une fois par hasard").

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'

def services_cache_size
  bridge_eval('Object.keys(Service.services||{}).length').to_i
end

def run_scenario(n)
  window_id = nil
  ids_before = terminal_all_window_ids
  baseline = services_cache_size

  click(SERVICE_DOM_ID)
  wait_for('__code__', 5)
  set_value('__code__', 'ls')
  click_suffix('btn-oui')

  wait_until(10, desc: -> { "aucune nouvelle fenêtre Terminal (avant : #{ids_before.inspect}) -- DUMP:\n#{terminal_debug_dump}" }) do
    window_id = (terminal_all_window_ids - ids_before).first
    !window_id.nil?
  end

  wait_until(5, desc: -> { "Service.services pas revenu à sa taille de départ (#{baseline}) après le clic ##{n} : #{services_cache_size}" }) do
    services_cache_size == baseline
  end
ensure
  (terminal_close_window(window_id) rescue nil) if window_id
end

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)

    run_scenario(1)
    run_scenario(2)
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun transient : l'instance dupliquée est retirée de Service.services après exécution (2 clics)") { run_test }
