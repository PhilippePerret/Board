require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push({'id' => '1'})
    stub.push({'id' => '2'})
    retour = Todoist.create_tasks('proj1', [{'content' => 'Tâche 1'}, {'content' => 'Tâche 2'}])

    raise "count attendu 2, obtenu #{retour[:count]}" unless retour[:count] == 2
    raise "errors attendu vide, obtenu #{retour[:errors].inspect}" unless retour[:errors].empty?
    raise "2 appels réseau attendus, #{stub.calls.length} obtenu(s)" unless stub.calls.length == 2
    raise "chaque appel doit cibler /tasks" unless stub.calls.all? { |c| c.path == '/tasks' }
  end
end

board_test("Todoist.create_tasks : plusieurs tâches valides, toutes créées") { run_test }
