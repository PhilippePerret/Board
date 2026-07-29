# Test d'intégration Reminder (frontend/js/Reminder.js) : un rappel dont
# l'heure est déjà passée doit s'exécuter (onDue appelé) et se retirer de
# la pile dès le prochain poll — sans attendre le setInterval réel (60s),
# on appelle Reminder.poll() directement pour rester rapide et déterministe.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      window.__testDue = false;
      Reminder.register({
        time: new Date(Date.now() - 5000),
        message: 'test',
        onDue: function(){ window.__testDue = true; }
      });
      var countBefore = Reminder.count;
      Reminder.poll();
      var countAfter = Reminder.count;
      return JSON.stringify({countBefore: countBefore, countAfter: countAfter, due: window.__testDue});
    })()
  JS
  data = JSON.parse(result)

  raise "countBefore attendu 1 (rappel enregistré), obtenu #{data['countBefore']}" unless data['countBefore'] == 1
  raise "onDue non appelé après poll() sur un rappel déjà échu" unless data['due']
  raise "countAfter attendu 0 (rappel retiré après exécution), obtenu #{data['countAfter']}" unless data['countAfter'] == 0
end

board_test("Reminder : rappel déjà échu exécuté et retiré au poll") { run_test }
