# Test : redéfinition d'un service "edit-documentation" — couvre les types
# 'project' et 'app', tous deux résolus SILENCIEUSEMENT (aucun dialogue),
# à condition que la propriété projet / le réglage appdata.json existent
# déjà (cf. ParamDefiner#onProject/#onApp).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef7"
  original_editor = read_app_data['documentation-editor']
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'edit-documentation', 'uuid' => uuid, 'type' => 'others', 'scType' => '.rb',
      'name' => 'Nom initial', 'params' => [[fixture_dir], ['Finder']], 'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] }, 'docu-folder' => fixture_dir)

    app_data = read_app_data
    app_data['documentation-editor'] = 'Finder'
    write_app_data(app_data)

    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    wait_for('__service-name__')
    click('btn-oui') # nom inchangé

    # → 'project' (docu-folder) et 'app' (documentation-editor) : aucun
    #   dialogue, résolution silencieuse — si un dialogue bloquait, ce
    #   wait_until finirait par expirer.
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && File.realpath(found['params'].flatten[0]) == File.realpath(fixture_dir) && found['params'].flatten[1] == 'Finder'
    end
  end
ensure
  remove_fixture_project(id) if id
  app_data = read_app_data
  if original_editor
    app_data['documentation-editor'] = original_editor
  else
    app_data.delete('documentation-editor')
  end
  write_app_data(app_data)
end

board_test("redéfinition d'un service 'edit-documentation' : project + app résolus sans dialogue") { run_test }
