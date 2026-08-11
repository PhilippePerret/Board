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

# Instrumentation temporaire (2026-08-11) : ce test échoue en suite complète
# mais pas isolé, ni même en remontant 26 tests précédents — la cause n'est
# pas identifiée. Ce dump capture, à CHAQUE checkpoint et systématiquement
# en cas de timeout, tout ce qui peut expliquer un échec de rendu de carte
# projet : horodatage réel, charge système, process Board en double,
# contenu réel d'appdata.yaml et de project-cards/ sur disque, contenu réel
# du DOM. Objectif : diagnostiquer sur UN SEUL run complet, sans avoir à le
# rejouer pour ajouter un log manquant après coup.
def diag_checkpoint(label)
  puts "[diag #{Time.now.strftime('%H:%M:%S.%L')}] #{label}"
end

def diag_dump(expected_id: nil)
  lines = []
  lines << "heure : #{Time.now.strftime('%H:%M:%S.%L')}"
  lines << "charge système (uptime) : #{`uptime 2>&1`.strip}"
  lines << "process Board (pgrep -x Board) : #{`pgrep -x Board 2>&1`.strip.split("\n").inspect}"
  begin
    app_data = read_app_data
    lines << "appdata.yaml projects-in : #{app_data['projects-in'].inspect}"
  rescue => e
    lines << "appdata.yaml illisible : #{e.class} #{e.message}"
  end
  begin
    lines << "project-cards/ sur disque : #{Dir.children(PROJECT_CARD_FOLDER).inspect}"
  rescue => e
    lines << "project-cards/ illisible : #{e.class} #{e.message}"
  end
  if expected_id
    lines << "fiche #{expected_id} présente sur disque : #{File.exist?(project_card_path(expected_id))}"
  end
  begin
    dom_ids = bridge_eval(<<~JS)
      Array.from(document.querySelectorAll('[id^="project-"]')).map(function(e){return e.id}).join(',')
    JS
    lines << "cartes projet dans le DOM : #{dom_ids.split(',').reject(&:empty?).inspect}"
  rescue => e
    lines << "DOM illisible : #{e.class} #{e.message}"
  end
  begin
    lines << "btn-add-project présent : #{exists?('btn-add-project')}"
  rescue => e
    lines << "erreur exists?('btn-add-project') : #{e.class} #{e.message}"
  end
  lines.join("\n    ")
end

def run_scenario(code_value, expected_output: nil)
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    diag_checkpoint('avant create_fixture_project')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    diag_checkpoint("fixture créée id=#{id}, avant launch_app")
    launch_app
    diag_checkpoint('launch_app terminé (btn-add-project ok)')

    card = "project-#{id}"
    output = expected_output.respond_to?(:call) ? expected_output.call(fixture_dir) : expected_output

    wait_until(4, desc: -> { "élément introuvable : #{card}\n    DUMP:\n    #{diag_dump(expected_id: id)}" }) { exists?(card) }
    diag_checkpoint('carte projet apparue')
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_until(4, desc: -> { "élément introuvable : #{SERVICE_DOM_ID}\n    DUMP:\n    #{diag_dump(expected_id: id)}" }) { exists?(SERVICE_DOM_ID) }
    diag_checkpoint('panneau services communs ouvert')
    click(SERVICE_DOM_ID)

    # → premier clic sur ce service pour ce projet : dialogue du param 'code'
    wait_until(4, desc: -> { "élément introuvable : __code__\n    DUMP:\n    #{diag_dump(expected_id: id)}" }) { exists?('__code__') }
    diag_checkpoint('dialogue code affiché')
    set_value('__code__', code_value) unless code_value.empty?

    # Fenêtres Terminal déjà ouvertes AVANT le déclenchement — la nôtre sera
    # celle qui apparaît en plus. Ni le nom ni l'historique de la fenêtre ne
    # sont fiables pour l'identifier : le script fait "clear;clear;<code>"
    # juste après le "cd", qui efface l'historique (nom du dossier compris)
    # avant qu'on ait pu le lire.
    ids_before = terminal_all_window_ids
    diag_checkpoint("avant clic btn-oui, fenêtres Terminal existantes : #{ids_before.inspect}")
    click_suffix('btn-oui')

    window_id = nil
    # Timeout élargi (10s, comme execution_services_startup.rb et
    # service_commun_horloge.rb) : sous charge concurrente (autres
    # process/fenêtres Terminal de l'user), la fenêtre peut mettre plus que
    # 4s à apparaître.
    wait_until(10, desc: -> { "aucune nouvelle fenêtre Terminal (avant : #{ids_before.inspect}) -- DUMP:\n#{terminal_debug_dump}\n    #{diag_dump}" }) do
      window_id = (terminal_all_window_ids - ids_before).first
      !window_id.nil?
    end
    diag_checkpoint("nouvelle fenêtre Terminal id=#{window_id}")
    tab_index = 1 # fenêtre neuve d'un "do script" : un seul tab

    if output
      wait_until(10, desc: -> { "historique Terminal (window id #{window_id}, tab #{tab_index}) ne contient pas #{output.inspect} -- DUMP:\n#{terminal_debug_dump}" }) do
        terminal_tab_history(window_id, tab_index).include?(output)
      end
      diag_checkpoint('historique Terminal conforme')
    end
  ensure
    (terminal_close_window(window_id) rescue nil) if window_id
  end
ensure
  diag_checkpoint("avant remove_fixture_project id=#{id}") if id
  remove_fixture_project(id) if id
end

# Guillemets dans la chaîne (Ruby .inspect → shell → AppleScript →
# Terminal) : vérifie que l'échappement tient sur toute la chaîne.
board_test("service commun 'terminal au dossier' : code de plusieurs mots avec guillemets") { run_scenario('echo "je suis un test"', expected_output: 'je suis un test') }
