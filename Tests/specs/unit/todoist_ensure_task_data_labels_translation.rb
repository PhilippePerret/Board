require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  # Chaîne "a, b,c" (espaces irrégulières) → tableau nettoyé
  result = Todoist._ensure_task_data('proj1', {'content' => 'x', 'labels' => 'a, b,c'})
  raise "attendu ['a','b','c'], obtenu #{result['labels'].inspect}" unless result['labels'] == ['a', 'b', 'c']

  # Cas de contrôle : déjà un tableau → inchangé
  result = Todoist._ensure_task_data('proj1', {'content' => 'x', 'labels' => ['a', 'b']})
  raise "tableau déjà fourni : ne doit pas être modifié, obtenu #{result['labels'].inspect}" unless result['labels'] == ['a', 'b']

  # Cas de contrôle : pas de labels du tout
  result = Todoist._ensure_task_data('proj1', {'content' => 'x'})
  raise "sans labels : la clé ne doit pas apparaître, obtenu #{result.inspect}" if result.key?('labels')
end

board_test("Todoist._ensure_task_data : 'labels' chaîne → tableau, tableau déjà fourni inchangé") { run_test }
