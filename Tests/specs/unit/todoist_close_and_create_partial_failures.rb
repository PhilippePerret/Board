require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  with_todoist_stub do |stub|
    stub.push(true)                              # close a : ok
    stub.push(RuntimeError.new('b introuvable'))  # close b : échoue
    stub.push({'id' => '1'})                      # create tâche 1 : ok
    stub.push(RuntimeError.new('content manquant')) # create tâche 2 : échoue

    retour = Todoist.close_and_create_tasks('proj1', ['a', 'b'], [{'content' => 'ok'}, {'content' => ''}])

    raise "done_count attendu 1, obtenu #{retour[:done_count]}" unless retour[:done_count] == 1
    raise "created_count attendu 1, obtenu #{retour[:created_count]}" unless retour[:created_count] == 1
    raise "2 erreurs attendues (une par côté), obtenu #{retour[:errors].length}" unless retour[:errors].length == 2
  end
end

board_test("Todoist.close_and_create_tasks : une erreur de chaque côté, indépendantes l'une de l'autre") { run_test }
