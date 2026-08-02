# Test : Reminder.remove (Reminder.js) persiste sa suppression —
# App.saveReminders() est appelé par remove() ; un rappel supprimé ne doit
# pas réapparaître après relance de l'app (contrairement à un rappel non
# supprimé, cf. reminder_persiste_autre_jour_recharge.rb).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  tomorrow_iso = (Time.now + 24 * 3600).strftime('%Y-%m-%dT%H:%M:%S')
  bridge_eval(<<~JS)
    (function(){
      Reminder.register({ time: new Date(#{tomorrow_iso.to_json}), message: 'à supprimer' });
      return '';
    })()
  JS
  sleep 1.2

  app_data = read_app_data
  raise "le rappel devrait être persisté avant suppression, obtenu #{app_data['reminders'].inspect}" unless
    (app_data['reminders'] || []).any? { |r| r['message'] == 'à supprimer' }

  bridge_eval(<<~JS)
    (function(){
      var r = Reminder.asArray().find(function(x){ return x.message === 'à supprimer'; });
      if (r) Reminder.remove(r);
      return '';
    })()
  JS
  sleep 1.2 # debounce de la sauvegarde déclenchée par remove()

  launch_app # relance : awakeReminders() ne doit PAS re-régistrer le rappel supprimé

  # String(...) : un bridge_eval numérique nu peut renvoyer un résultat vide
  # côté Swift, masqué en 0 par .to_i sans rapport avec l'état réel.
  count = bridge_eval("String(Reminder.asArray().filter(function(r){ return r.message === 'à supprimer'; }).length)").to_i
  raise "le rappel supprimé ne devrait pas être rechargé, obtenu count=#{count}" unless count == 0

  app_data_after = read_app_data
  raise "le rappel supprimé ne devrait plus être dans appdata.yaml, obtenu #{app_data_after['reminders'].inspect}" if
    (app_data_after['reminders'] || []).any? { |r| r['message'] == 'à supprimer' }
end

board_test("Reminder.remove : suppression persistée, pas rechargée après relance") { run_test }
