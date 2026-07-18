# Test : service commun "open-terminal-at-folder" ("Terminal au dossier")
# Source : demande explicite (2026-07-12), complété (2026-07-17) suite à
# l'ajout du param 'code' (type 'string', dialogue "Code à exécuter à
# l'ouverture") dans frontend/js/ServiceData.js.
#
# Le param 'code' est stocké dans projet.common_services_data[id] au premier
# clic sur le service (Service#ensureServiceData / #defineCommonServiceParameters,
# frontend/js/Service.js) — le dialogue n'apparaît donc QU'UNE FOIS par
# projet pour ce service, jamais aux clics suivants. D'où 3 fixtures
# distinctes ci-dessous, une par scénario, plutôt que 3 clics sur le même
# projet.
#
# backend/scripts/OpenTerminalAtFolder.scpt fait "do script" + "activate",
# puis "cd <dossier>; clear;clear;<code>" — le "clear;clear;" efface
# l'historique du tab (nom du dossier compris) juste après le "cd". Ni le
# nom ni le contenu de la fenêtre ne sont donc fiables pour l'identifier :
# repérage par DIFFÉRENCE (ids de toutes les fenêtres Terminal avant/après
# le déclenchement, cf. BoardTest#terminal_all_window_ids), pas par nom ou
# contenu. La vérification d'exécution ne porte que sur la SORTIE du code
# (seule chose qui survit aux clear), cf. BoardTest#terminal_tab_history.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'

def run_scenario(code_value, expected_output: nil)
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    output = expected_output.respond_to?(:call) ? expected_output.call(fixture_dir) : expected_output

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → premier clic sur ce service pour ce projet : dialogue du param 'code'
    wait_for('__code__')
    set_value('__code__', code_value) unless code_value.empty?

    # Fenêtres Terminal déjà ouvertes AVANT le déclenchement — la nôtre sera
    # celle qui apparaît en plus. Ni le nom ni l'historique de la fenêtre ne
    # sont fiables pour l'identifier : le script fait "clear;clear;<code>"
    # juste après le "cd", qui efface l'historique (nom du dossier compris)
    # avant qu'on ait pu le lire.
    ids_before = terminal_all_window_ids
    click('btn-oui')

    window_id = nil
    # Timeout élargi (10s, comme execution_services_startup.rb et
    # service_commun_horloge.rb) : sous charge concurrente (autres
    # process/fenêtres Terminal de l'user), la fenêtre peut mettre plus que
    # 4s à apparaître.
    wait_until(10, desc: -> { "aucune nouvelle fenêtre Terminal (avant : #{ids_before.inspect}) -- DUMP:\n#{terminal_debug_dump}" }) do
      window_id = (terminal_all_window_ids - ids_before).first
      !window_id.nil?
    end
    tab_index = 1 # fenêtre neuve d'un "do script" : un seul tab

    if output
      wait_until(10, desc: -> { "historique Terminal (window id #{window_id}, tab #{tab_index}) ne contient pas #{output.inspect} -- DUMP:\n#{terminal_debug_dump}" }) do
        terminal_tab_history(window_id, tab_index).include?(output)
      end
    end
  ensure
    (terminal_close_window(window_id) rescue nil) if window_id
  end
ensure
  remove_fixture_project(id) if id
end

# Le "clear;clear;" du script efface l'historique du tab juste après le
# "cd" — on ne peut donc vérifier que la SORTIE du code (produite après les
# clear), jamais le "cd" ni le code lui-même s'il n'affiche rien. D'où
# "echo" pour avoir une sortie garantie ; le second scénario (fichier
# _guillemets.rb) passe en plus par des guillemets dans la chaîne (Ruby
# .inspect → shell → AppleScript → Terminal).
#
# Scénarios splittés en 3 FICHIERS distincts (pas 3 board_test dans ce même
# fichier) : le runner (Tests/version-pont/run_tests.sh) lance "ruby $spec"
# une fois PAR FICHIER, et board_test (helpers_base.rb) fait exit() à la fin
# de chaque appel — 3 board_test dans un seul fichier, seul le premier
# s'exécuterait, les 2 suivants ne tourneraient jamais. Cf.
# service_commun_ouverture_terminal_guillemets.rb et
# service_commun_ouverture_terminal_sans_code.rb.
board_test("service commun 'terminal au dossier' : code d'un mot ('pwd')") { run_scenario('pwd', expected_output: ->(dir) { File.basename(dir) }) }
