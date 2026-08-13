# Test : bouton "Annuler" du dialogue de baisse détectée — ferme le cycle
# (Spinner.stop('Application prête.')) sans appeler le backend, aucune
# archive créée.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  backups_dir = "#{BoardTest::BOARD_SUPPORT_DIR}-backups"
  archives_before = Dir[File.join(backups_dir, '*.tar.gz')]

  bridge_eval(<<~JS)
    (function(){
      App._confirmAppBackupDiscrepancy({
        triggered: ['projects'],
        previousProjects: 10, currentProjects: 2,
        previousServices: 5, currentServices: 5
      })
      return ''
    })()
  JS

  wait_for_suffix('btn-non')
  click_suffix('btn-non')

  wait_until(5, desc: -> { "texte #spinner-message = #{(bridge_eval('document.querySelector(\"#spinner-message\")?.textContent') rescue '(erreur)').inspect}" }) do
    bridge_eval('document.querySelector("#spinner-message")?.textContent') == 'Application prête.'
  end

  archives_after = Dir[File.join(backups_dir, '*.tar.gz')]
  raise "aucune archive ne devrait avoir été créée par Annuler (#{archives_before.size} avant, #{archives_after.size} après)" unless archives_after.size == archives_before.size
end

board_test("App backup : le bouton Annuler ferme le cycle sans créer d'archive") { run_test }
