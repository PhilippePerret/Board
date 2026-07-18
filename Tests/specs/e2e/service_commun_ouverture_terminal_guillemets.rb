# Test : service commun "open-terminal-at-folder" ("Terminal au dossier")
# — scénario "code de plusieurs mots avec guillemets".
# Splitté depuis service_commun_ouverture_terminal.rb (2026-07-18) : le
# runner lance "ruby $spec" une fois PAR FICHIER, et board_test fait exit()
# à la fin de chaque appel — plusieurs board_test dans un même fichier,
# seul le premier s'exécute. Cf. service_commun_ouverture_terminal.rb pour
# le détail des choix de repérage de fenêtre (par différence d'ids, pas par
# nom/contenu, à cause du "clear;clear;" du script).

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

# Guillemets dans la chaîne (Ruby .inspect → shell → AppleScript →
# Terminal) : vérifie que l'échappement tient sur toute la chaîne.
board_test("service commun 'terminal au dossier' : code de plusieurs mots avec guillemets") { run_scenario('echo "je suis un test"', expected_output: 'je suis un test') }
