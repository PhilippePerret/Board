# Test : flux Todoist complet par VRAIS clics UI (jamais testé ainsi
# jusqu'ici — cf. reminder_destroyed_on_task_closed.rb et
# reminder_recreated_on_task_hour_modified.rb, qui pilotent directement
# Project#updateTasksAfterMarkAndCreate via bridge_eval pour isoler le
# cycle de vie du Reminder du reste). Ici : clic sur le badge -> TasksDialog
# (Dialogs.js) -> coche une tâche -> OK -> ConfirmDialog -> Confirmer ->
# retour backend -> message d'actualisation.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section H point 23).
#
# 4 réponses stubées, dans l'ordre exact des appels HTTP réels faits par
# backend/lib/todoist.rb (PAS un stub par action bridge, un stub par appel
# HTTP bas niveau) :
#   0. today_tasks au CHARGEMENT du projet (Project#getTachesAndSetBadges,
#      appelé automatiquement pour tout projet ayant un todoist_id)
#   1. today_tasks au CLIC sur le badge (Todoist#_fetchToday)
#   2. close_task (POST /tasks/<id>/close) — la tâche cochée
#   3. today_tasks FINAL, dans Todoist.update_tasks côté backend (rafraîchit
#      la liste après clôture) — aucun appel create/modify ici (0 nouvelle
#      tâche, 0 tâche modifiée)

require_relative '../../support/helpers'
require_relative '../../support/todoist_e2e_stub'
include BoardTest

def click_todoist_badge(project_id)
  bridge_eval(<<~JS)
    (function(){
      var fireClick=#{BoardTest::FIRE_CLICK_JS};
      var el=document.querySelector('#project-#{project_id} .todoist');
      if(!el) throw new Error('badge todoist introuvable');
      fireClick(el);
      return '';
    })()
  JS
end

def run_test
  project_id = nil
  due_iso = Time.now.strftime('%Y-%m-%dT%H:%M:%S')
  task = {'id' => 'fixture-task-flux', 'content' => 'Tâche à clôturer', 'due' => {'date' => due_iso}}

  stub_responses = [
    {'results' => [task]},  # 0. chargement
    {'results' => [task]},  # 1. clic badge
    true,                   # 2. close_task
    {'results' => []},      # 3. today_tasks final (tâche clôturée)
  ]
  with_todoist_e2e_stub(stub_responses) do |stub_dir|
    project_id = create_fixture_project(title: 'Projet Todoist', todoist_id: 'fixture-todoist-id')
    launch_app

    card = "project-#{project_id}"
    wait_for(card)

    # → chargement au démarrage : consomme la réponse 0 (badge mis à jour)
    wait_until(desc: -> { "appels stub = #{todoist_e2e_stub_calls(stub_dir).inspect}" }) do
      todoist_e2e_stub_calls(stub_dir).length >= 1
    end

    click_todoist_badge(project_id)

    # → TasksDialog affiché avec la tâche du stub
    checkbox = "todoist-task-#{task['id']}-cb"
    wait_for(checkbox, 8)
    click(checkbox)
    click_suffix('btn-oui') # OK du TasksDialog -> onValidateTodoist

    # → ConfirmDialog "Confirmation des tâches"
    wait_for_suffix('btn-oui')
    click_suffix('btn-oui') # Confirmer -> onMarkAndCreateTodoistTask -> backend

    wait_until(10, desc: -> { "message en exergue = #{(exergue_message_text rescue '(erreur)').inspect} / ErrorsDialog = #{(errors_dialog_text rescue '(erreur)').inspect} / nb divs exergue = #{(bridge_eval("document.querySelectorAll('.exergue-message').length") rescue '(erreur)')} / diag = #{(bridge_eval('JSON.stringify(window.__diag||[])') rescue '(erreur)')}" }) do
      (exergue_message_text rescue '') =~ /achevées : 1/
    end

    # → l'appel de clôture a bien ciblé LA tâche cochée
    close_call = todoist_e2e_stub_calls(stub_dir).find { |c| c['path'] == "/tasks/#{task['id']}/close" }
    raise "aucun appel de clôture pour la tâche #{task['id']} : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless close_call
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("flux Todoist réel : clic badge -> TasksDialog -> coche -> OK -> Confirmer -> clôture backend") { run_test }
