# Test : Reminder#dataNotifierByType (Reminder.js) — 'error' et 'notice'.
# Même remarque que reminder_notifier_data_warning.rb : données vérifiées,
# pas le rendu (fenêtre native séparée).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var r = new Reminder({ time: new Date(Date.now() + 60000), message: 'test' });
      return JSON.stringify({
        error:  r.dataNotifierByType('error').background,
        notice: r.dataNotifierByType('notice').background
      });
    })()
  JS
  data = JSON.parse(result)

  raise "background 'error' attendu #e60000, obtenu #{data['error'].inspect}" unless data['error'] == '#e60000'
  raise "background 'notice' attendu #0000FF, obtenu #{data['notice'].inspect}" unless data['notice'] == '#0000FF'
end

board_test("Reminder#dataNotifierByType : 'error' et 'notice', couleurs correctes") { run_test }
