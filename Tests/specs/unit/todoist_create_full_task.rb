require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  lang = APP_DATA['lang'].split('-')[0]

  with_todoist_stub do |stub|
    stub.push({'id' => '1'})
    Todoist.create_task('proj1', {
      'content'     => 'Préparer le rapport',
      'description' => 'Avec les chiffres du mois dernier',
      'start'       => 'demain',
      'deadline'    => 'dans 3 jours',
      'duration'    => '45 minutes',
      'priority'    => '2',
      'labels'      => 'travail, urgent',
    })

    call = stub.calls.first
    expected_body = {
      'content'       => 'Préparer le rapport',
      'description'   => 'Avec les chiffres du mois dernier',
      'priority'      => '2',
      'project_id'    => 'proj1',
      'due_string'    => 'demain',
      'due_lang'      => lang,
      'deadline_date' => 'dans 3 jours',
      'deadline_lang' => lang,
      'duration'      => 45,
      'duration_unit' => 'minute',
      'labels'        => ['travail', 'urgent'],
    }
    raise "body attendu #{expected_body.inspect}, obtenu #{call.body.inspect}" unless call.body == expected_body
  end
end

board_test("Todoist.create_task : tâche complète, tous les champs traduits vers le format API") { run_test }
