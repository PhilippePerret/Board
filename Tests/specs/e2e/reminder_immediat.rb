# Test d'intégration Reminder : un rappel 'immediat' s'exécute (onDue
# appelé) de façon synchrone dès Reminder.register(), sans passer par la
# pile de poll. Reminder#exec() ne retire jamais le rappel de la pile
# (Reminder.js) — count reste à 1 après exécution.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  # Diagnostic : identifier l'origine du rappel résiduel
  puts "  reminders déjà présents avant register : #{bridge_eval('JSON.stringify(Reminder.asArray().map(function(r){return {message: r.message, task: r.task, type: r.type};}))')}"

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
  raise "countAfter attendu 1 (Reminder#exec ne retire pas le rappel), obtenu #{data['countAfter']}" unless data['countAfter'] == 1
end

board_test("Reminder : rappel 'immediat' exécuté et retiré de façon synchrone") { run_test }
