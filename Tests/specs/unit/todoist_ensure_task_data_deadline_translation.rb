require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  lang = APP_DATA['lang'].split('-')[0]

  result = Todoist._ensure_task_data('proj1', {'content' => 'x', 'deadline' => 'dans 3 jours'})
  expected = {'content' => 'x', 'project_id' => 'proj1', 'deadline_date' => 'dans 3 jours', 'deadline_lang' => lang}
  raise "avec 'deadline' : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected

  # Cas de contrôle : sans deadline, pas de deadline_date ajouté
  result = Todoist._ensure_task_data('proj1', {'content' => 'x'})
  raise "sans deadline : deadline_date ne doit pas apparaître, obtenu #{result.inspect}" if result.key?('deadline_date')
end

board_test("Todoist._ensure_task_data : 'deadline' traduit en deadline_date+deadline_lang") { run_test }
