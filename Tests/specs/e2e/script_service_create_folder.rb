require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    yaml_path = File.join(fixture_dir, 'envoi.yaml')
    File.write(yaml_path, <<~YAML)
      - type: create-folder
        path: ./sortie-test
    YAML

    service = fixture_script_service(yaml_path, name: 'Envoi manuscrit')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    wait_for("project-#{id}")
    service_card = "service-#{service['uuid']}"
    wait_for(service_card)
    click(service_card)

    wait_until(10, desc: -> { "sortie-test créé ? #{File.directory?(File.join(fixture_dir, 'sortie-test'))}" }) do
      File.directory?(File.join(fixture_dir, 'sortie-test'))
    end
    raise "Board a quitté après exécution du script-service" unless board_running?
  end
ensure
  remove_fixture_project(id) if id
end

board_test("script-service : étape create-folder crée le dossier relatif au projet") { run_test }
