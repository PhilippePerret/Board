# Test d'intégration Reminder : un rappel 'immediat' s'exécute (onDue
# appelé) de façon synchrone dès Reminder.register(), sans passer par la
# pile de poll — donc retiré immédiatement (count revient à 0).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      window.__testDue = false;
      Reminder.register({
        immediat: true,
        message: 'test',
        type: 'notice',
        onDue: function(){ window.__testDue = true; }
      });
      return JSON.stringify({countAfter: Reminder.count, due: window.__testDue});
    })()
  JS
  data = JSON.parse(result)

  raise "onDue non appelé pour un rappel 'immediat'" unless data['due']
  raise "countAfter attendu 0 (exécuté et retiré immédiatement), obtenu #{data['countAfter']}" unless data['countAfter'] == 0
end

board_test("Reminder : rappel 'immediat' exécuté et retiré de façon synchrone") { run_test }
