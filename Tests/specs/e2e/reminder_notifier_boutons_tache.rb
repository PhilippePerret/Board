# Test : Reminder#setAsTask/defineRealButtons (Reminder.js) — un rappel lié
# à une tâche expose 2 boutons (remind-started/remind-remove) dont le
# onclick réel est bindé sur Reminder.remove(ce rappel) — vérifié
# fonctionnellement (appeler le bouton retire bien CE rappel).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app
  # launch_app garantit seulement que le socket de test répond (page
  # chargée), pas que Reminder.init() a tourné (this.remindedTasks assigné,
  # App._initProjectsServicesAndReminders) — sans cette attente, le
  # bridge_eval plus bas peut s'exécuter avant, et planter sur
  # this.remindedTasks encore undefined (Reminder.js ~122).
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  result = bridge_eval(<<~JS)
    (function(){
      var countBefore = Reminder.count;
      var r = new Reminder({ time: new Date(Date.now() + 60000), task: { id: 'fixture-task-buttons' }, message: 'test boutons' });
      var names = r.realButtons.map(function(b){ return b.name; });
      var expected = [getMsg('remind-started'), getMsg('remind-remove')];
      var countAfterCreate = Reminder.count;
      r.realButtons[0].onclick();
      var countAfterClick = Reminder.count;
      return JSON.stringify({
        namesMatch: JSON.stringify(names) === JSON.stringify(expected),
        countBefore: countBefore,
        countAfterCreate: countAfterCreate,
        countAfterClick: countAfterClick
      });
    })()
  JS
  data = JSON.parse(result)

  raise "les noms des boutons devraient être remind-started/remind-remove, mismatch : #{data.inspect}" unless data['namesMatch']
  raise "le rappel devrait avoir été ajouté à la création, obtenu #{data.inspect}" unless data['countAfterCreate'] == data['countBefore'] + 1
  raise "cliquer sur le bouton devrait retirer CE rappel (Reminder.remove bindé), obtenu #{data.inspect}" unless data['countAfterClick'] == data['countBefore']
end

board_test("Reminder lié à une tâche : boutons remind-started/remind-remove fonctionnels") { run_test }
