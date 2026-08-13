# Test : la baisse déclenchant needsConfirmation peut venir des SERVICES
# (pas seulement du nombre de projets) — même projet conservé entre les
# deux backups, mais ses services retirés directement dans sa carte.

require_relative '../../support/helpers'

include BoardTest

def send_action(action, extra = {})
  bridge_eval(<<~JS)
    (function(){
      window.__abResult = undefined
      server.send(Object.assign({action: #{action.to_json}}, #{extra.to_json}), function(retour){ window.__abResult = retour })
      return ''
    })()
  JS
  wait_until(10, desc: -> { "#{action} : pas de réponse" }) do
    bridge_eval('window.__abResult !== undefined ? "1" : ""') == '1'
  end
  JSON.parse(bridge_eval('JSON.stringify(window.__abResult)'))
end

def run_test
  launch_app

  project_id = create_fixture_project(
    title: 'Test services drop',
    services: {
      'startup' => [fixture_open_folder_service(Dir.tmpdir)],
      'others'  => [
        fixture_open_file_service(Dir.tmpdir, 'none', name: 'A'),
        fixture_open_file_service(Dir.tmpdir, 'none', name: 'B'),
        fixture_open_file_service(Dir.tmpdir, 'none', name: 'C')
      ]
    }
  )

  retour1 = send_action('app-backup')
  raise "1er backup : erreur #{retour1['error'].inspect}" if retour1['error']
  raise "services attendu 4, obtenu #{retour1['data']['services'].inspect}" unless retour1['data']['services'] == 4

  card = read_project_card(project_id)
  card['services']['others'] = []
  File.write(project_card_path(project_id), card.to_yaml)

  retour2 = send_action('app-backup')
  data2 = retour2['data']
  raise "needsConfirmation attendu (grosse baisse de services), obtenu #{data2.inspect}" unless data2['needsConfirmation']
  raise "triggered devrait contenir 'services', obtenu #{data2['triggered'].inspect}" unless data2['triggered'].include?('services')
  raise "triggered ne devrait pas contenir 'projects' (nombre de projets inchangé)" if data2['triggered'].include?('projects')
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("App backup : une baisse du nombre de services déclenche aussi needsConfirmation") { run_test }
