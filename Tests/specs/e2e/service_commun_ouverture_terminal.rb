# Test : service commun "open-terminal-at-folder" ("Terminal au dossier")
# Source : demande explicite (2026-07-12).
#
# frontend/js/ServiceData.js (COMMON_SERVICES_DATA) : un seul param,
# {id: 'path', type: 'project'} — ServiceDefiner#defineByType, case 'project',
# résout la valeur directement depuis Project.current[param.id] SANS ouvrir
# aucun dialogue (contrairement à open-folder-project, qui a en plus un param
# type 'bounds'). Le clic doit donc exécuter le service tout de suite, dès le
# premier clic comme au second.
#
# backend/scripts/OpenTerminalAtFolder.scpt fait "do script" + "activate" :
# le titre par défaut de la fenêtre Terminal reflète le dossier courant du
# shell (BoardTest#terminal_front_window_name, déjà utilisé dans
# ouverture_terminal_projet.rb pour l'ancien service custom "open-terminal").

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    expected_name = File.basename(fixture_dir)

    check_terminal_opened_on = lambda do
      wait_until(10, desc: -> { "nom de la fenêtre Terminal au premier plan = #{(terminal_front_window_name rescue '(erreur)').inspect} (attendu un nom contenant #{expected_name.inspect})" }) do
        terminal_front_window_name.include?(expected_name)
      end
    end

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → aucun dialogue : le Terminal doit s'ouvrir directement au dossier du projet
    check_terminal_opened_on.call

    # - recharger l'application
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → même chose après rechargement (sdata persistée, mais de toute façon
    #   ce service n'a jamais demandé de dialogue)
    click(SERVICE_DOM_ID)
    check_terminal_opened_on.call
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'terminal au dossier' : exécution directe, sans dialogue") { run_test }
