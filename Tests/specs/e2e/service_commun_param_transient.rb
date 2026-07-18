# Test : paramètre :transient d'un service commun ("code" de "Terminal au
# dossier") ne doit pas être persisté tel quel dans common_services_data, et
# doit être redemandé à chaque clic.
# Source : Tests/_tests_a_faire.adoc, "Un paramètre :transient ne doit pas
# être persisté dans le projet".
#
# frontend/js/Service.js#defineCommonServiceParameters remplace la valeur
# d'un paramètre marqué transient:true (ServiceData.js, ex. 'code' de
# 'open-terminal-at-folder'/'open-iterm-at-folder') par le sentinel
# ':transient:' avant enregistrement — jamais la vraie valeur saisie.
# #ensureServiceData détecte ce sentinel au clic suivant pour forcer une
# redéfinition (redemander le dialogue), au lieu d'exécuter directement
# avec l'ancienne valeur.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'

def run_test
  id = nil
  window_id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → premier clic sur ce service pour ce projet : dialogue du param transient 'code'
    wait_for('__code__')
    set_value('__code__', 'ls')

    ids_before = terminal_all_window_ids
    click('btn-oui')

    wait_until(10, desc: -> { "aucune nouvelle fenêtre Terminal (avant : #{ids_before.inspect}) -- DUMP:\n#{terminal_debug_dump}" }) do
      window_id = (terminal_all_window_ids - ids_before).first
      !window_id.nil?
    end

    # → le paramètre transient ne doit pas être enregistré tel quel dans la
    #   carte projet (remplacé par le sentinel ':transient:', jamais 'ls')
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      stored = read_project_card(id).dig('common_services_data', SERVICE_DOM_ID)
      stored.is_a?(Array) && stored.include?(':transient:') && !stored.include?('ls')
    end

    # → second clic sur le même service : la dialogue du code doit
    #   réapparaître (pas d'exécution directe avec l'ancienne valeur)
    click(SERVICE_DOM_ID)
    wait_for('__code__', 5)
  ensure
    (terminal_close_window(window_id) rescue nil) if window_id
  end
ensure
  remove_fixture_project(id) if id
end

board_test("paramètre :transient d'un service commun non persisté, redemandé à chaque clic") { run_test }
