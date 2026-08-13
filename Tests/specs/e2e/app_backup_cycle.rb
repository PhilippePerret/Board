# Test : cycle du backup quotidien (backend/lib/app_backup.rb).
# - 1er backup : archive + .infos créés, comptes corrects.
# - 2e backup, après une grosse baisse (projet fixture retiré) : aucune
#   nouvelle archive tant que l'user n'a pas confirmé (needsConfirmation).

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
    title: 'Test backup',
    services: { 'startup' => [fixture_open_folder_service(Dir.tmpdir)], 'others' => [] }
  )

  retour1 = send_action('app-backup')
  raise "1er backup : erreur #{retour1['error'].inspect}" if retour1['error']
  data1 = retour1['data']
  raise "needsConfirmation inattendu au 1er backup : #{data1.inspect}" if data1['needsConfirmation']
  raise "projects attendu 1, obtenu #{data1['projects'].inspect}" unless data1['projects'] == 1
  raise "services attendu 1, obtenu #{data1['services'].inspect}" unless data1['services'] == 1

  backups_dir = "#{BoardTest::BOARD_SUPPORT_DIR}-backups"
  archives = Dir[File.join(backups_dir, '*.tar.gz')]
  raise "aucune archive créée dans #{backups_dir}" if archives.empty?
  infos = Dir[File.join(backups_dir, '*.infos')]
  raise "aucun .infos créé dans #{backups_dir}" if infos.empty?

  remove_fixture_project(project_id)

  retour2 = send_action('app-backup')
  data2 = retour2['data']
  raise "needsConfirmation attendu au 2e backup (grosse baisse), obtenu #{data2.inspect}" unless data2['needsConfirmation']
  raise "triggered devrait contenir 'projects', obtenu #{data2['triggered'].inspect}" unless data2['triggered'].include?('projects')

  archives_after = Dir[File.join(backups_dir, '*.tar.gz')]
  raise "aucune nouvelle archive ne devrait avoir été créée avant confirmation (#{archives.size} avant, #{archives_after.size} après)" unless archives_after.size == archives.size

  retour3 = send_action('app-backup-confirm')
  data3 = retour3['data']
  raise "needsConfirmation ne devrait plus apparaître après confirmation : #{data3.inspect}" if data3['needsConfirmation']
  archives_confirmed = Dir[File.join(backups_dir, '*.tar.gz')]
  raise "une archive devrait avoir été créée après confirmation (#{archives.size} avant, #{archives_confirmed.size} après)" unless archives_confirmed.size == archives.size + 1
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("App backup : cycle normal + détection de grosse baisse (aucune archive tant que non confirmé)") { run_test }
