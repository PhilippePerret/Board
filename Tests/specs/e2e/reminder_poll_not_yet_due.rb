# Test d'intégration Reminder : un rappel dont l'heure n'est pas encore
# arrivée ne doit PAS s'exécuter au poll, et reste dans la pile.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      window.__testDue = false;
      Reminder.register({
        time: new Date(Date.now() + 60 * 60 * 1000),
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
  raise "onDue appelé alors que l'heure du rappel n'est pas encore arrivée" if data['due']
  raise "countAfter attendu 1 (rappel toujours en attente), obtenu #{data['countAfter']}" unless data['countAfter'] == 1
end

board_test("Reminder : rappel futur non exécuté au poll, reste en attente") { run_test }
