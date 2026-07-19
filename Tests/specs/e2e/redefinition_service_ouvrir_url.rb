# Test : redéfinition d'un service "open-URL" — couvre le type 'url'
# (préremplissage de la valeur actuelle dans le TextFieldDialog).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef5"
  original_url = 'https://exemple-original.test'
  new_url = 'https://exemple-modifie.test'
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'open-URL', 'uuid' => uuid, 'type' => 'others', 'scType' => '.scpt',
      'name' => 'Nom initial', 'params' => [[original_url]], 'projectId' => nil
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

    wait_for('__url__')
    raise "url pas préremplie = #{get_value('__url__').inspect}" unless get_value('__url__') == original_url
    set_value('__url__', new_url)
    click('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && found['params'].flatten == [new_url]
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'open-URL' : url préremplie avec la valeur actuelle") { run_test }
