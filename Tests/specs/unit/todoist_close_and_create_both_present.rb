require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push(true)              # close a
    stub.push(true)              # close b
    stub.push({'id' => '1'})     # create tâche 1
    stub.push({'id' => '2'})     # create tâche 2

    retour = Todoist.close_and_create_tasks('proj1', ['a', 'b'], [{'content' => 'Tâche 1'}, {'content' => 'Tâche 2'}])

    raise "done_count attendu 2, obtenu #{retour[:done_count]}" unless retour[:done_count] == 2
    raise "created_count attendu 2, obtenu #{retour[:created_count]}" unless retour[:created_count] == 2
    raise "errors attendu vide, obtenu #{retour[:errors].inspect}" unless retour[:errors].empty?

    raise "4 appels réseau attendus, #{stub.calls.length} obtenu(s)" unless stub.calls.length == 4
    close_paths = stub.calls.select { |c| c.path.end_with?('/close') }.map(&:path)
    create_paths = stub.calls.select { |c| c.path == '/tasks' }.map(&:path)
    raise "2 fermetures attendues, obtenu #{close_paths.inspect}" unless close_paths == ['/tasks/a/close', '/tasks/b/close']
    raise "2 créations attendues, obtenu #{create_paths.inspect}" unless create_paths.length == 2
  end
end

board_test("Todoist.close_and_create_tasks : marquage et création en même temps, comptages indépendants corrects") { run_test }
