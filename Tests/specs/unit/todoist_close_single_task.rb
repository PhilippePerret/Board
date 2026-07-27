require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push(true)
    Todoist.close_task('abc123')

    raise "1 appel réseau attendu, #{stub.calls.length} obtenu(s)" unless stub.calls.length == 1
    call = stub.calls.first
    raise "méthode attendue :post, obtenu #{call.method.inspect}" unless call.method == :post
    raise "chemin attendu '/tasks/abc123/close', obtenu #{call.path.inspect}" unless call.path == '/tasks/abc123/close'
  end
end

board_test("Todoist.close_task : envoie bien POST /tasks/{id}/close") { run_test }
