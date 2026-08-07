# Test unitaire de Project#lockSave/unlockSave (Project.js) : appel direct
# des méthodes via le pont JS, sans passer par le flux complet de
# redéfinition d'un service. Vérifie que :
#  - un save() normal (non verrouillé) appelle son callback tout de suite
#    (cas de contrôle) ;
#  - pendant le verrou, un save() ne déclenche RIEN tout de suite (ni appel
#    backend, ni callback) — juste mis en file d'attente ;
#  - au déverrouillage, TOUS les callbacks en attente sont appelés (aucun
#    perdu), via un flush unique.

require_relative '../../support/helpers'

include BoardTest

def save_log
  JSON.parse(bridge_eval('JSON.stringify(window.__saveLog || [])'))
end

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet LockSave', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # --- Cas de contrôle : save() non verrouillé, callback appelé tout de suite ---
    bridge_eval(<<~JS)
      window.__saveLog = [];
      Project.current.save(function(){ window.__saveLog.push('control') });
    JS
    wait_until(desc: -> { "saveLog = #{save_log.inspect}" }) { save_log.include?('control') }

    # --- Verrouillé : deux save() mis en attente, rien ne doit s'exécuter tout de suite ---
    bridge_eval(<<~JS)
      window.__saveLog = [];
      Project.current.lockSave();
      Project.current.save(function(){ window.__saveLog.push('A') });
      Project.current.save(function(){ window.__saveLog.push('B') });
    JS
    pending = bridge_eval('(Project.current._pendingSaveCallbacks || []).length').to_i
    raise "2 sauvegardes attendues en file, obtenu #{pending}" unless pending == 2
    raise "callback(s) appelé(s) alors que verrouillé : #{save_log.inspect}" unless save_log.empty?

    # --- Déverrouillage : flush unique, les deux callbacks en attente sont appelés ---
    bridge_eval('Project.current.unlockSave()')
    wait_until(desc: -> { "saveLog = #{save_log.inspect}" }) do
      logs = save_log
      logs.include?('A') && logs.include?('B')
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("Project#lockSave/unlockSave : sauvegardes mises en attente puis rejouées au déverrouillage, sans en perdre") { run_test }
