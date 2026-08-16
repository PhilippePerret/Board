# Test : Reminder.destroy('task') (Reminder.js, appelé par
# Project.js#updateTasksAfterMarkAndCreate) — ne retire QUE les rappels
# liés à une tâche (prop 'task' définie), garde les rappels indépendants
# d'une tâche.
#
# filter garde reminder[type] == undefined -> retire donc ceux qui ONT
# la propriété 'task' définie.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app
  # launch_app garantit seulement que le socket de test répond (page
  # chargée), pas que Reminder.init() a tourné (this.remindedTasks assigné,
  # App._initProjectsServicesAndReminders) — sans cette attente, le
  # bridge_eval plus bas peut s'exécuter avant, et planter sur
  # this.remindedTasks encore undefined (Reminder.js ~122).
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  result = bridge_eval(<<~JS)
    (function(){
      var t = new Date(Date.now() + 5 * 60 * 1000);
      Reminder.register({ time: t, task: { id: 'fixture-task-destroy' }, message: 'lié à une tâche' });
      Reminder.register({ time: t, message: 'indépendant' });
      var beforeCount = Reminder.count;
      Reminder.destroy('task');
      // destroy() ne persiste JAMAIS (contrairement à .remove()) : sans ce
      // saveReminders explicite, le rappel lié à la tâche resterait à vie
      // dans appdata.yaml['reminders'] après ce test.
      App.saveReminders();
      var remaining = Reminder.asArray().map(function(r){ return r.message; });
      return JSON.stringify({ beforeCount: beforeCount, remaining: remaining });
    })()
  JS
  data = JSON.parse(result)

  raise "2 rappels attendus avant destroy, obtenu #{data['beforeCount']}" unless data['beforeCount'] == 2
  raise "le rappel lié à une tâche devrait avoir été retiré, obtenu #{data['remaining'].inspect}" if data['remaining'].include?('lié à une tâche')
  raise "le rappel indépendant devrait être conservé, obtenu #{data['remaining'].inspect}" unless data['remaining'].include?('indépendant')
ensure
  log_offset = File.exist?(DEBUG_LOG_FILE) ? File.size(DEBUG_LOG_FILE) : 0
  (bridge_eval("Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })") rescue nil)
  # Attend la confirmation réelle (Board-debug.log) que le save-app-data
  # débouncé (App.saveReminders -> App.saveData, 1000ms) est bien parti,
  # au lieu d'un sleep fixe deviné (même principe que remove_fixture_project).
  begin
    wait_until((DEBOUNCE_SAVE_MS + DEBOUNCE_MARGIN_MS) / 1000.0, 0.05, desc: -> { 'save-app-data jamais confirmé après nettoyage des reminders' }) { new_save_app_data_line_since?(log_offset) }
  rescue
    nil
  end
end

board_test("Reminder.destroy('task') : retire seulement les rappels liés à une tâche") { run_test }
