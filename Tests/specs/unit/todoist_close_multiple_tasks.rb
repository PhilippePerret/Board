require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push(true)
    stub.push(true)
    retour = Todoist.close_tasks(['a', 'b'])

    raise "count attendu 2, obtenu #{retour[:count]}" unless retour[:count] == 2
    raise "errors attendu vide, obtenu #{retour[:errors].inspect}" unless retour[:errors].empty?
    raise "2 appels réseau attendus, #{stub.calls.length} obtenu(s)" unless stub.calls.length == 2
    raise "chemins attendus /tasks/a/close puis /tasks/b/close, obtenu #{stub.calls.map(&:path).inspect}" \
      unless stub.calls.map(&:path) == ['/tasks/a/close', '/tasks/b/close']
  end
end

board_test("Todoist.close_tasks : plusieurs tâches, une requête close par id") { run_test }
