# Test : Reminder.js#addReminderToTask — une même tâche peut avoir
# PLUSIEURS rappels tant que leurs temps sont différents (ex. rappel
# toutes les heures) ; les deux coexistent dans Reminder.remindedTasks.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var t1 = new Date(Date.now() + 5 * 60 * 1000);
      var t2 = new Date(Date.now() + 15 * 60 * 1000);
      Reminder.register({ time: t1, task: { id: 'fixture-task-multi' }, message: 'rappel 1' });
      Reminder.register({ time: t2, task: { id: 'fixture-task-multi' }, message: 'rappel 2' });
      var list = Reminder.remindedTasks['fixture-task-multi'] || [];
      return JSON.stringify({
        count: list.length,
        times: list.map(function(r){ return r.time.getTime(); })
      });
    })()
  JS
  data = JSON.parse(result)

  raise "2 rappels attendus pour la même tâche, obtenu #{data['count']}" unless data['count'] == 2
  raise "les temps des deux rappels devraient être différents, obtenu #{data['times'].inspect}" if data['times'].uniq.length != 2
ensure
  (bridge_eval("(Reminder.remindedTasks['fixture-task-multi'] || []).slice().forEach(function(r){ Reminder.remove(r); })") rescue nil)
  sleep 1.2
end

board_test("Reminder : deux rappels à temps différents coexistent pour une même tâche") { run_test }
