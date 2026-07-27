require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    retour = Todoist.close_and_create_tasks('proj1', [], [])

    raise "done_count attendu 0, obtenu #{retour[:done_count]}" unless retour[:done_count] == 0
    raise "created_count attendu 0, obtenu #{retour[:created_count]}" unless retour[:created_count] == 0
    raise "errors attendu vide, obtenu #{retour[:errors].inspect}" unless retour[:errors].empty?
    raise "aucune requête réseau ne doit être envoyée, #{stub.calls.length} obtenue(s)" unless stub.calls.empty?
  end
end

board_test("Todoist.close_and_create_tasks : rien à faire des deux côtés → aucune requête envoyée") { run_test }
