# Test : redéfinition d'un service "open-terminal-at-folder" — couvre le
# type 'string' (param 'code', marqué transient — sans effet sur la
# redéfinition d'un service déjà attaché, ce marquage ne concerne que le
# service commun joué direct depuis le panneau).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef8"
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'open-terminal-at-folder', 'uuid' => uuid, 'type' => 'others',
      'name' => 'Nom initial', 'params' => [[fixture_dir], ['ls -la']], 'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    wait_for('__service-name__')
    click('btn-oui') # nom inchangé

    # → path (project) : résolu silencieusement, pas de dialogue
    # → code (string) : valeur actuelle préremplie
    wait_for('__code__')
    raise "code pas prérempli = #{get_value('__code__').inspect}" unless get_value('__code__') == 'ls -la'
    set_value('__code__', 'pwd')
    click('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && found['params'].flatten[1] == 'pwd'
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'open-terminal-at-folder' : string (code) préremplie") { run_test }
