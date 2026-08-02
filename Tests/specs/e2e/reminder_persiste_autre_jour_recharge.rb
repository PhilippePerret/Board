# Test : App.js#awakeReminders — un rappel d'un autre jour, persisté dans
# appdata.yaml['reminders'] (Reminder.js#register, saveReminders
# inconditionnel), est bien RECHARGÉ (Reminder.register re-appelé) au
# lancement suivant de l'app.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  tomorrow_iso = (Time.now + 24 * 3600).strftime('%Y-%m-%dT%H:%M:%S')
  bridge_eval(<<~JS)
    (function(){
      Reminder.register({ time: new Date(#{tomorrow_iso.to_json}), message: 'persisté autre jour' });
      return '';
    })()
  JS
  sleep 1.2 # debounce App.js#saveData avant de tuer/relancer Board

  launch_app # App.init -> awakeReminders() relit appdata.yaml['reminders']

  # String(...) : un bridge_eval numérique nu peut renvoyer un résultat vide
  # côté Swift, masqué en 0 par .to_i sans rapport avec l'état réel.
  count = bridge_eval('String(Reminder.count)').to_i
  raise "1 Reminder attendu après rechargement, obtenu #{count}" unless count == 1
  message = bridge_eval('Reminder.asArray()[0].message')
  raise "message attendu 'persisté autre jour', obtenu #{message.inspect}" unless message == 'persisté autre jour'
ensure
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("App.awakeReminders : rappel d'un autre jour rechargé après relance") { run_test }
