# Test : redéfinition d'un service "run-script" dont les params sont
# stockés À PLAT (BoardTest#fixture_run_script_service : ['params' =>
# [script_path, basename]], pas groupés [[script_path]]) — régression pour
# la compatibilité ancien format de Service.js#redefine (this.params[i] pas
# forcément un tableau à 1 élément).
# Source : demande explicite (2026-07-19), bug découvert en live le même jour.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    script_path = create_fixture_run_script(fixture_dir)
    service = fixture_run_script_service(script_path, name: 'Nom initial')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{service['uuid']}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    wait_for('__service-name__')
    click('btn-oui') # nom inchangé

    # → path stocké à plat : le bouton Préserver doit quand même apparaître
    wait_for('btn-mid')
    raise "pas de bouton Préserver (format à plat non géré)" unless get_text('btn-mid') == 'Préserver'
    click('btn-mid')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == service['uuid'] }
      found && File.realpath(found['params'].flatten[0]) == File.realpath(script_path)
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service au format à plat (ancien projet) : Préserver fonctionne quand même") { run_test }
