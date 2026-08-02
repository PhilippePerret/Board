# Test : Reminder#fullPathIcon (Reminder.js) — un rappel lié à un projet
# dont l'icône est définie retourne le chemin complet
# (Project#getFullPath(icon, 'file://')), pas l'icône brute du Reminder.

require_relative '../../support/helpers'
include BoardTest

def run_test
  Dir.mktmpdir('board-test-project-icon-') do |fixture_dir|
    project_id = create_fixture_project(title: 'Projet avec icône', path: fixture_dir, icon: 'icon.png')
    launch_app

    wait_for_project_card(project_id)

    result = bridge_eval(<<~JS)
      (function(){
        var r = new Reminder({ time: new Date(Date.now() + 60000), projectId: #{project_id.to_json}, message: 'test icône' });
        return r.fullPathIcon();
      })()
    JS

    expected = "file://#{fixture_dir}/icon.png"
    raise "chemin d'icône attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected
  ensure
    remove_fixture_project(project_id) if project_id
  end
end

board_test("Reminder#fullPathIcon : chemin complet de l'icône du projet lié") { run_test }
