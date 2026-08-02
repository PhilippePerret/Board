# Test : Reminder#execIfTime (Reminder.js) — un rappel dont l'heure est
# dépassée mais HORS de la fenêtre "proche" (DateUtils.close, 60 min) est
# détruit sans jamais être exécuté (this.constructor.remove(this)),
# plutôt que déclenché en retard.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      Notifier.notify = function(){ window.__notifyCount = (window.__notifyCount || 0) + 1; };
      var countBefore = Reminder.count;
      var r = new Reminder({ time: new Date(Date.now() - 2 * 3600 * 1000), message: 'test trop en retard', type: 'notice' });
      var countAfterCreate = Reminder.count;
      r.execIfTime(new Date());
      return JSON.stringify({
        notifyCount: window.__notifyCount || 0,
        countBefore: countBefore,
        countAfterCreate: countAfterCreate,
        countAfterExec: Reminder.count
      });
    })()
  JS
  data = JSON.parse(result)

  raise "le rappel devrait avoir été ajouté au store à la création, obtenu #{data.inspect}" unless data['countAfterCreate'] == data['countBefore'] + 1
  raise "aucune exécution attendue pour un rappel trop en retard, obtenu #{data['notifyCount']}" unless data['notifyCount'] == 0
  raise "le rappel devrait avoir été détruit (retiré du store), obtenu #{data.inspect}" unless data['countAfterExec'] == data['countBefore']
end

board_test("Reminder#execIfTime : rappel trop en retard détruit sans exécution") { run_test }
