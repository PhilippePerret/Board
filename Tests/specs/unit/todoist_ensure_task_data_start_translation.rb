require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  lang = APP_DATA['lang'].split('-')[0]

  # 'start' (clé du formulaire frontend) → due_string + due_lang
  result = Todoist._ensure_task_data('proj1', {'content' => 'x', 'start' => 'demain'})
  expected = {'content' => 'x', 'project_id' => 'proj1', 'due_string' => 'demain', 'due_lang' => lang}
  raise "avec 'start' : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected

  # 'due' (alias accepté) → même traduction
  result = Todoist._ensure_task_data('proj1', {'content' => 'x', 'due' => 'après-demain'})
  expected = {'content' => 'x', 'project_id' => 'proj1', 'due_string' => 'après-demain', 'due_lang' => lang}
  raise "avec 'due' : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected

  # Ni 'start' ni 'due' → pas de due_string ajouté (cas de contrôle)
  result = Todoist._ensure_task_data('proj1', {'content' => 'x'})
  raise "sans date : due_string ne doit pas apparaître, obtenu #{result.inspect}" if result.key?('due_string')
end

board_test("Todoist._ensure_task_data : 'start'/'due' traduits en due_string+due_lang") { run_test }
