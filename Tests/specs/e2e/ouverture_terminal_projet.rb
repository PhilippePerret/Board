# Test : service "open-terminal" ("Ouvrir un Terminal au dossier du projet")
# Source : demande explicite (2026-07-11), pas encore implémenté côté
# backend au moment de l'écriture — ce test DOIT échouer tant que ce n'est
# pas fait (même convention que le test "[BUG] cliquer deux fois").
#
# frontend/js/ServiceData.js déclare ce service avec params: [] — aucun
# param demandé à l'utilisateur à l'attachement (contrairement à
# open-folder-project). Reste à déterminer, à l'implémentation, COMMENT le
# chemin du projet arrive jusqu'au script backend puisqu'aucun mécanisme
# générique n'injecte actuellement le chemin du projet dans les params d'un
# service (vérifié : ServiceExecuter#execReally envoie seulement
# `this.params`, jamais le path du projet séparément) — fixture ci-dessous
# suppose params: [chemin_projet], à ajuster selon le choix d'implémentation
# retenu.
#
# Setup : service attaché en "others" (pas "startup" — un simple clic suffit
# à l'exécuter, cf. Service.js#onClickOnProjectService).
#
# Vérification : le titre par défaut d'une fenêtre Terminal reflète le
# dossier courant du shell (BoardTest#terminal_front_window_name) —
# hypothèse non vérifiée en conditions réelles (jamais testé, le service
# n'existe pas encore).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'open-terminal',
      'uuid' => "fixture-service-#{Time.now.to_i}#{rand(36**4).to_s(36)}",
      'type' => 'others',
      'name' => 'Terminal ici',
      'params' => [fixture_dir],
      'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    service_card = "service-#{service['uuid']}"
    wait_for("project-#{id}")
    wait_for(service_card)

    click(service_card)

    expected_name = File.basename(fixture_dir)
    wait_until(10, desc: -> { "nom de la fenêtre Terminal au premier plan = #{(terminal_front_window_name rescue '(erreur)').inspect} (attendu un nom contenant #{expected_name.inspect})" }) do
      terminal_front_window_name.include?(expected_name)
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("ouverture d'un Terminal au dossier du projet") { run_test }
