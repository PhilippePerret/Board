# Test : "Revenir au backup précédent" sans aucun backup existant renvoie
# une erreur explicite, ne plante pas.

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

  backups_dir = "#{BoardTest::BOARD_SUPPORT_DIR}-backups"
  raise "des backups existent déjà dans #{backups_dir}, précondition invalide pour ce test" \
    unless Dir[File.join(backups_dir, '*.tar.gz')].empty?

  retour = send_action('app-backup-restore-previous')
  data = retour['data']
  raise "ok attendu false, obtenu #{data.inspect}" if data['ok']
  raise "error attendu 'backend-app-backup-no-previous', obtenu #{data['error'].inspect}" \
    unless data['error'] == 'backend-app-backup-no-previous'
end

board_test("App backup : restaurer sans backup précédent renvoie une erreur explicite") { run_test }
