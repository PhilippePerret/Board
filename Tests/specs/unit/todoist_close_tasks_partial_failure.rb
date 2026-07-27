require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push(true)                                # a : ok
    stub.push(RuntimeError.new('tâche introuvable')) # b : échoue
    stub.push(true)                                # c : ok quand même, malgré l'échec de b

    retour = Todoist.close_tasks(['a', 'b', 'c'])

    raise "count attendu 2, obtenu #{retour[:count]}" unless retour[:count] == 2
    raise "3 appels réseau attendus (b tenté malgré l'échec), #{stub.calls.length} obtenu(s)" unless stub.calls.length == 3
    raise "1 erreur attendue, #{retour[:errors].length} obtenue(s)" unless retour[:errors].length == 1
    raise "l'erreur doit mentionner la tâche b, obtenu #{retour[:errors].first.inspect}" unless retour[:errors].first.include?('b')
  end
end

board_test("Todoist.close_tasks : un échec au milieu n'interrompt pas les suivants") { run_test }
