# Test : service commun "open-in-vscode" ("Ouvrir dans VSCode")
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 1).
#
# Service à un seul paramètre (path, type 'project', résolu silencieusement
# depuis project.path) : contrairement à la plupart des autres services
# communs, AUCUN dialogue n'apparaît, même au premier clic — pas de nomage,
# Service#defineCommonServiceParameters force unnamed=false pour tout
# service commun (frontend/js/Service.js). Le clic exécute donc directement
# backend/scripts/OpenInVscode.sh <path>, qui fait "code <path>".
#
# VSCode n'est pas scriptable nativement comme Terminal (pas d'attribut
# "id" exploitable sur ses fenêtres via System Events, renvoie
# "missing value") : repérage de la fenêtre créée par NOM (diff
# avant/après), comme service_commun_edit_documentation.rb le fait pour
# CotEditor. Fermeture CIBLÉE de cette seule fenêtre (jamais "quit app") :
# VSCode est une app multi-fenêtres/multi-projets, potentiellement déjà
# ouverte sur un autre travail en cours au moment du test.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-in-vscode'
VSCODE_BUNDLE_ID = 'com.microsoft.VSCode'

def vscode_installed?
  !`mdfind "kMDItemCFBundleIdentifier == '#{VSCODE_BUNDLE_ID}'"`.strip.empty?
end

def vscode_window_names
  out = `osascript -e 'tell application "System Events" to get name of every window of process "Code"' 2>/dev/null`
  out.split(', ').map(&:strip)
end

def close_vscode_window_named(name)
  system('osascript', '-e', %Q(tell application "System Events" to click button 1 of window "#{name}" of process "Code"))
end

def run_test
  pending('Visual Studio Code non installé sur cette machine') unless vscode_installed?

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

    names_before = vscode_window_names
    new_name = nil
    click(SERVICE_DOM_ID)

    # → aucun dialogue à gérer ici (cf. note en tête de fichier) : on
    #   attend directement l'apparition de la fenêtre VSCode.
    wait_until(15, 1, desc: -> { "aucune nouvelle fenêtre VSCode contenant #{expected_name.inspect} parmi #{vscode_window_names.inspect}" }) do
      new_name = (vscode_window_names - names_before).find { |n| n.include?(expected_name) }
      !new_name.nil?
    end
  ensure
    close_vscode_window_named(new_name) if new_name
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'ouvrir dans VSCode'") { run_test }
