# Test : une tâche du jour à heure future a un Reminder programmé. Si la
# tâche est modifiée pour changer son heure de début (toujours dans le
# futur), l'ancien Reminder (ancienne heure) doit être détruit et un
# nouveau Reminder (nouvelle heure) créé — pas les deux en même temps,
# sinon double notification / notification à la mauvaise heure.
#
# Pilotage direct de Project#updateTasksAfterMarkAndCreate via bridge_eval,
# même raison que reminder_destroyed_on_task_closed.rb.

require_relative '../../support/helpers'
require_relative '../../support/todoist_e2e_stub'
include BoardTest

def run_test
  old_due_iso = (Time.now + 30 * 60).strftime('%Y-%m-%dT%H:%M:%S') # +30 min
  new_due_iso = (Time.now + 10 * 60).strftime('%Y-%m-%dT%H:%M:%S') # +10 min (plus tôt, toujours futur)
  task_id = 'fixture-task-modify'
  task_before = {'id' => task_id, 'content' => 'Tâche dont on avance l\'heure', 'due' => {'date' => old_due_iso}}
  task_after  = {'id' => task_id, 'content' => 'Tâche dont on avance l\'heure', 'due' => {'date' => new_due_iso}}

  with_todoist_e2e_stub([{'results' => [task_before]}]) do |stub_dir|
    project_id = create_fixture_project(title: 'Reminder recréé à la modification', collapsed: false, todoist_id: 'fixture-todoist-id')
    launch_app

    card_id = "project-#{project_id}"
    wait_for(card_id)

    # → le Reminder est programmé pour l'ancienne heure au chargement
    before = bridge_eval(<<~JS)
      (function(){
        var list = (Reminder.remindedTasks && Reminder.remindedTasks[#{task_id.to_json}]) || [];
        return JSON.stringify(list.map(function(r){ return r.time.getTime(); }));
      })()
    JS
    old_times = JSON.parse(before)
    raise "1 reminder attendu (ancienne heure) au chargement, obtenu #{old_times.inspect}" unless old_times.length == 1

    # → simule la modification de la tâche : today_tasks la renvoie avec la nouvelle heure
    bridge_eval(<<~JS)
      (function(){
        var p = Project.get(#{project_id.to_json});
        p.updateTasksAfterMarkAndCreate({data: {today_tasks: [#{task_after.to_json}], mod_count: 1, new_count: 0, done_count: 0, errors: []}});
        return '';
      })()
    JS

    after = bridge_eval(<<~JS)
      (function(){
        var list = (Reminder.remindedTasks && Reminder.remindedTasks[#{task_id.to_json}]) || [];
        return JSON.stringify(list.map(function(r){ return r.time.getTime(); }));
      })()
    JS
    new_times = JSON.parse(after)

    raise "ancien reminder (ancienne heure) toujours présent après modification : #{new_times.inspect}" if new_times.include?(old_times.first)
    raise "1 reminder attendu (nouvelle heure) après modification, obtenu #{new_times.inspect}" unless new_times.length == 1
  ensure
    remove_fixture_project(project_id) if project_id
  end
end

board_test("Reminder recréé (ancien détruit, nouveau programmé) quand l'heure de la tâche est modifiée") { run_test }
