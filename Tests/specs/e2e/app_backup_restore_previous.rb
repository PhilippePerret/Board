# Test : "Revenir au backup précédent" (app-backup-restore-previous)
# restaure bien le dernier backup SAIN — celui d'avant la baisse — puisque
# app_backup_run ne crée aucune nouvelle archive tant que la baisse n'est
# pas confirmée (cf. app_backup_cycle.rb).

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
    title: 'Test restore',
    services: { 'startup' => [fixture_open_folder_service(Dir.tmpdir)], 'others' => [] }
  )

  retour1 = send_action('app-backup')
  raise "1er backup : erreur #{retour1['error'].inspect}" if retour1['error']

  remove_fixture_project(project_id)
  raise "carte projet toujours présente après remove_fixture_project" if File.exist?(project_card_path(project_id))

  retour2 = send_action('app-backup')
  raise "needsConfirmation attendu (grosse baisse), obtenu #{retour2['data'].inspect}" unless retour2['data']['needsConfirmation']

  retour3 = send_action('app-backup-restore-previous')
  raise "restore-previous : erreur #{retour3['error'].inspect}" if retour3['error']

  raise "carte projet #{project_id} pas restaurée" unless File.exist?(project_card_path(project_id))
  app_data = read_app_data
  raise "#{project_id} pas dans projects-in après restauration" unless Array(app_data['projects-in']).include?(project_id)
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("App backup : restaurer le backup précédent réintroduit le projet retiré") { run_test }
