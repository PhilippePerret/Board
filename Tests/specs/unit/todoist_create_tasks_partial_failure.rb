require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push({'id' => '1'})
    stub.push(RuntimeError.new('content manquant'))
    stub.push({'id' => '3'})

    retour = Todoist.create_tasks('proj1', [
      {'content' => 'Tâche valide 1'},
      {'content' => ''},
      {'content' => 'Tâche valide 3'},
    ])

    raise "count attendu 2, obtenu #{retour[:count]}" unless retour[:count] == 2
    raise "3 appels réseau attendus (les 3 tentés), #{stub.calls.length} obtenu(s)" unless stub.calls.length == 3
    raise "1 erreur attendue, #{retour[:errors].length} obtenue(s)" unless retour[:errors].length == 1
  end
end

board_test("Todoist.create_tasks : une tâche invalide au milieu n'empêche pas les autres") { run_test }
