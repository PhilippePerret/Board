# Test : Reminder#execIfTime (Reminder.js) — un rappel dû et dans la
# fenêtre "proche" (DateUtils.close, 60 min) ne s'exécute (exec() ->
# Notifier.notify) que toutes les 3 vérifications (execCount % 3 == 0),
# pas à chaque poll — sinon une notification par minute tant que le
# rappel n'est pas retiré manuellement.
#
# Reminder construit directement (pas via Reminder.register) pour éviter
# les effets de bord (App.saveReminders, timer) hors sujet ici — jamais
# persisté, disparaît avec le process.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      Notifier.notify = function(){ window.__notifyCount = (window.__notifyCount || 0) + 1; };
      var r = new Reminder({ time: new Date(Date.now() - 1000), message: 'test répétition', type: 'notice' });
      var now = new Date();
      for (var i = 0; i < 7; i++) { r.execIfTime(now); }
      return JSON.stringify({ notifyCount: window.__notifyCount || 0, execCount: r.execCount });
    })()
  JS
  data = JSON.parse(result)

  raise "3 exécutions attendues sur 7 vérifications (execCount%3==0 aux calls 1,4,7), obtenu #{data['notifyCount']}" unless data['notifyCount'] == 3
  raise "execCount attendu 7 après 7 vérifications, obtenu #{data['execCount']}" unless data['execCount'] == 7
end

board_test("Reminder#execIfTime : exécuté toutes les 3 vérifications, pas à chaque poll") { run_test }
