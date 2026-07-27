require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push({'id' => '999'})
    Todoist.create_task('proj1', {'content' => 'Faire les courses'})

    raise "1 appel réseau attendu, #{stub.calls.length} obtenu(s)" unless stub.calls.length == 1
    call = stub.calls.first
    raise "méthode attendue :post, obtenu #{call.method.inspect}" unless call.method == :post
    raise "chemin attendu '/tasks', obtenu #{call.path.inspect}" unless call.path == '/tasks'
    expected_body = {'content' => 'Faire les courses', 'project_id' => 'proj1'}
    raise "body attendu #{expected_body.inspect}, obtenu #{call.body.inspect}" unless call.body == expected_body
  end
end

board_test("Todoist.create_task : tâche minimale (content seul) envoyée telle quelle + project_id") { run_test }
