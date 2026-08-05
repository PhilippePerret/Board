# Test : une tâche du jour à heure future a un Reminder programmé
# (Project.js#reactiveIfTask, lien task↔reminder via Reminder.js#addReminderToTask
# / Reminder.remindedTasks). Si la tâche est achevée avant son heure de
# début, son Reminder doit être détruit (sinon il se déclencherait quand
# même à l'heure prévue, pour une tâche déjà close).
#
# Pilotage direct de Project#updateTasksAfterMarkAndCreate via bridge_eval
# (plutôt que le clic UI complet) : isole le comportement testé ici (cycle
# de vie du Reminder) du flux de clic todoist complet.

require_relative '../../support/helpers'
require_relative '../../support/todoist_e2e_stub'
include BoardTest

def run_test
  due_iso = (Time.now + 5 * 60).strftime('%Y-%m-%dT%H:%M:%S') # +5 min : futur
  task = {'id' => 'fixture-task-close', 'content' => 'Tâche à clore avant son heure', 'due' => {'date' => due_iso}}

  with_todoist_e2e_stub([{'results' => [task]}]) do |stub_dir|
    project_id = create_fixture_project(title: 'Reminder détruit à la clôture', collapsed: false, todoist_id: 'fixture-todoist-id')
    launch_app

    card_id = "project-#{project_id}"
    wait_for(card_id)

    # → le Reminder a bien été programmé au chargement (lien task↔reminder).
    #   Le chargement des tâches todoist (getTachesAndSetBadges) se fait de
    #   façon asynchrone après l'apparition de la carte : on attend, pas de
    #   vérification instantanée.
    reminders_count = -> {
      bridge_eval(<<~JS)
        (function(){
          var list = (Reminder.remindedTasks && Reminder.remindedTasks[#{task['id'].to_json}]) || [];
          return list.length.toString();
        })()
      JS
    }
    wait_until(desc: -> { "reminders pour la tâche = #{reminders_count.call.inspect}" }) do
      reminders_count.call == '1'
    end

    # → simule la clôture de la tâche : today_tasks ne la contient plus
    bridge_eval(<<~JS)
      (function(){
        var p = Project.get(#{project_id.to_json});
        p.updateTasksAfterMarkAndCreate({data: {today_tasks: [], mod_count: 0, new_count: 0, done_count: 1, errors: []}});
        return '';
      })()
    JS

    after = bridge_eval(<<~JS)
      (function(){
        var list = (Reminder.remindedTasks && Reminder.remindedTasks[#{task['id'].to_json}]) || [];
        return list.length.toString();
      })()
    JS
    raise "reminder attendu détruit (0) après clôture de la tâche, obtenu #{after.inspect}" unless after == '0'
  ensure
    remove_fixture_project(project_id) if project_id
  end
end

board_test("Reminder détruit quand sa tâche est achevée avant son heure de début") { run_test }
