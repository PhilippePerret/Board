# Test : service commun "open-terminal-at-folder" ("Terminal au dossier")
# Source : demande explicite (2026-07-12), complété (2026-07-17) suite à
# l'ajout du param 'code' (type 'string', dialogue "Code à exécuter à
# l'ouverture") dans frontend/js/ServiceData.js.
#
# Le param 'code' est stocké dans projet.service_common_data[id] au premier
# clic sur le service (Service#ensureServiceData / #defineCommonServiceParameters,
# frontend/js/Service.js) — le dialogue n'apparaît donc QU'UNE FOIS par
# projet pour ce service, jamais aux clics suivants. D'où 3 fixtures
# distinctes ci-dessous, une par scénario, plutôt que 3 clics sur le même
# projet.
#
# backend/scripts/OpenTerminalAtFolder.scpt fait "do script" + "activate".
# Repérage en 2 temps : la fenêtre par NOM (léger, répété dans le polling —
# pas "front window", l'user a en général d'autres fenêtres Terminal
# ouvertes en parallèle), puis le tab exact par CONTENU au sein de CETTE
# fenêtre, une seule fois (pas "selected tab", qui pourrait ne pas être le
# bon si la fenêtre a plusieurs tabs). Voir BoardTest#terminal_window_id_named
# / #terminal_tab_index_matching / #terminal_tab_history.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'

def run_scenario(code_value)
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    expected_name = File.basename(fixture_dir)

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → premier clic sur ce service pour ce projet : dialogue du param 'code'
    wait_for('__code__')
    set_value('__code__', code_value) unless code_value.empty?
    click('btn-oui')

    window_id = nil
    # Timeout élargi (10s, comme execution_services_startup.rb et
    # service_commun_horloge.rb) : sous charge concurrente (autres
    # process/fenêtres Terminal de l'user), le tab peut mettre plus que 4s
    # à apparaître.
    wait_until(10, desc: -> { "aucune fenêtre Terminal trouvée avec #{expected_name.inspect} dans son nom -- DUMP:\n#{terminal_debug_dump}" }) do
      window_id = terminal_window_id_named(expected_name)
      !window_id.nil?
    end

    # Le nom de la fenêtre (piloté par le "cd", quasi instantané) peut se
    # mettre à jour AVANT que "clear;clear;<code>" ait fini de s'exécuter et
    # d'apparaître dans l'historique — d'où un wait_until ici aussi (pas un
    # essai unique), même si scopé à cette seule fenêtre donc peu coûteux.
    tab_index = nil
    wait_until(10, desc: -> { "tab introuvable dans la fenêtre id #{window_id} avec #{expected_name.inspect} dans son historique -- DUMP:\n#{terminal_debug_dump}" }) do
      tab_index = terminal_tab_index_matching(window_id, expected_name)
      !tab_index.nil?
    end

    unless code_value.empty?
      wait_until(10, desc: -> { "historique Terminal (window id #{window_id}, tab #{tab_index}) ne contient pas #{code_value.inspect} -- DUMP:\n#{terminal_debug_dump}" }) do
        terminal_tab_history(window_id, tab_index).include?(code_value)
      end
    end
  ensure
    (terminal_close_window(window_id) rescue nil) if window_id
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'terminal au dossier' : code d'un mot ('ls')") { run_scenario('ls') }
board_test("service commun 'terminal au dossier' : code de plusieurs mots ('ls -la')") { run_scenario('ls -la') }
board_test("service commun 'terminal au dossier' : aucun code donné") { run_scenario('') }
