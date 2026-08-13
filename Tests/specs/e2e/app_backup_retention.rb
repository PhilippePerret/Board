# Test : rétention des backups — 20 derniers jours gardés tels quels, et
# un seul par mois révolu au-delà (app_backup_apply_retention!,
# backend/lib/app_backup.rb). Archives fabriquées directement sur disque
# (mtime forcé) : la rétention ne regarde que les dates de fichier, pas le
# contenu — inutile de faire tourner 3 mois de vrais backups.

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

def fabricate_backup(backups_dir, days_ago, label)
  stamp = "19700101-#{label}" # nom unique, la date réelle est portée par le mtime, pas le nom
  archive_path = File.join(backups_dir, "app-backup-#{stamp}.tar.gz")
  infos_path   = File.join(backups_dir, "app-backup-#{stamp}.infos")
  File.write(archive_path, 'fake')
  File.write(infos_path, { 'date' => 'x', 'projects' => 0, 'services' => 0 }.to_yaml)
  t = Time.now - days_ago * 24 * 60 * 60
  File.utime(t, t, archive_path)
  File.utime(t, t, infos_path)
  archive_path
end

def run_test
  launch_app

  backups_dir = "#{BoardTest::BOARD_SUPPORT_DIR}-backups"
  FileUtils.mkdir_p(backups_dir)

  three_months_old = [
    fabricate_backup(backups_dir, 95, 'a'),
    fabricate_backup(backups_dir, 90, 'b') # plus récente des deux -> gardée
  ]
  two_months_old = [
    fabricate_backup(backups_dir, 65, 'c'),
    fabricate_backup(backups_dir, 60, 'd') # plus récente des deux -> gardée
  ]
  within_20_days = [
    fabricate_backup(backups_dir, 15, 'e'),
    fabricate_backup(backups_dir, 10, 'f'),
    fabricate_backup(backups_dir, 5, 'g')
  ]

  retour = send_action('app-backup')
  raise "backup : erreur #{retour['error'].inspect}" if retour['error']
  raise "needsConfirmation inattendu : #{retour['data'].inspect}" if retour['data']['needsConfirmation']

  remaining = Dir[File.join(backups_dir, '*.tar.gz')]

  raise "#{three_months_old[0]} aurait dû être supprimé (mois révolu, pas le plus récent du mois)" if remaining.include?(three_months_old[0])
  raise "#{three_months_old[1]} aurait dû être gardé (le plus récent de son mois)" unless remaining.include?(three_months_old[1])
  raise "#{two_months_old[0]} aurait dû être supprimé (mois révolu, pas le plus récent du mois)" if remaining.include?(two_months_old[0])
  raise "#{two_months_old[1]} aurait dû être gardé (le plus récent de son mois)" unless remaining.include?(two_months_old[1])
  within_20_days.each do |path|
    raise "#{path} (< 20 jours) aurait dû être gardé tel quel" unless remaining.include?(path)
  end
  raise "l'archive tout juste créée par ce test devrait être présente" unless remaining.size == 6
end

board_test("App backup : rétention (20 derniers jours + 1 par mois révolu)") { run_test }
