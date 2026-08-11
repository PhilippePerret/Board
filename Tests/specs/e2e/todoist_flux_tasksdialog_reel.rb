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

# Instrumentation temporaire (2026-08-11) : échoue en suite complète, jamais
# isolé — cf. service_commun_ouverture_terminal_guillemets.rb pour le même
# traitement et la raison. Dump systématique en cas de timeout, checkpoints
# horodatés à chaque étape.
def diag_checkpoint(label)
  puts "[diag #{Time.now.strftime('%H:%M:%S.%L')}] #{label}"
end

def diag_dump(project_id, stub_dir)
  lines = []
  lines << "heure : #{Time.now.strftime('%H:%M:%S.%L')}"
  lines << "charge système (uptime) : #{`uptime 2>&1`.strip}"
  lines << "process Board (pgrep -x Board) : #{`pgrep -x Board 2>&1`.strip.split("\n").inspect}"
  begin
    lines << "appels stub Todoist reçus : #{todoist_e2e_stub_calls(stub_dir).inspect}"
  rescue => e
    lines << "stub illisible : #{e.class} #{e.message}"
  end
  begin
    lines << "carte projet sur disque : #{read_project_card(project_id).inspect}"
  rescue => e
    lines << "carte projet illisible : #{e.class} #{e.message}"
  end
  begin
    lines << "ErrorsDialog affichée : #{(errors_dialog_text.empty? ? '(aucune)' : errors_dialog_text).inspect}"
  rescue => e
    lines << "errors_dialog_text erreur : #{e.class} #{e.message}"
  end
  begin
    dom_ids = bridge_eval(<<~JS)
      Array.from(document.querySelectorAll('[id]')).map(function(e){return e.id}).filter(function(id){return id.length>0}).join(',')
    JS
    lines << "ids présents dans le DOM (#{dom_ids.split(',').length}) : #{dom_ids.split(',').last(25).inspect} (25 derniers)"
  rescue => e
    lines << "DOM illisible : #{e.class} #{e.message}"
  end
  lines.join("\n    ")
end

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
    diag_checkpoint('avant create_fixture_project')
    project_id = create_fixture_project(title: 'Projet Todoist', todoist_id: 'fixture-todoist-id')
    diag_checkpoint("fixture créée id=#{project_id}")
    launch_app
    diag_checkpoint('launch_app terminé')

    card = "project-#{project_id}"
    wait_until(4, desc: -> { "élément introuvable : #{card}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) { exists?(card) }
    diag_checkpoint('carte projet apparue')

    # → chargement au démarrage : consomme la réponse 0 (badge mis à jour)
    wait_until(4, desc: -> { "appels stub = #{todoist_e2e_stub_calls(stub_dir).inspect}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) do
      todoist_e2e_stub_calls(stub_dir).length >= 1
    end
    diag_checkpoint('appel today_tasks au chargement consommé')

    click_todoist_badge(project_id)
    diag_checkpoint('badge todoist cliqué')

    # → TasksDialog affiché avec la tâche du stub
    checkbox = "todoist-task-#{task['id']}-cb"
    wait_until(8, desc: -> { "élément introuvable : #{checkbox}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) { exists?(checkbox) }
    diag_checkpoint('TasksDialog affiché, checkbox présente')
    click(checkbox)
    click_suffix('btn-oui') # OK du TasksDialog -> onValidateTodoist
    diag_checkpoint('checkbox cochée, OK cliqué')

    # → ConfirmDialog "Confirmation des tâches"
    wait_until(4, desc: -> { "suffixe introuvable : btn-oui (ConfirmDialog)\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) { exists_suffix?('btn-oui') }
    diag_checkpoint('ConfirmDialog affiché')
    click_suffix('btn-oui') # Confirmer -> onMarkAndCreateTodoistTask -> backend
    diag_checkpoint('Confirmer cliqué')

    wait_until(10, desc: -> { "message en exergue = #{(exergue_message_text rescue '(erreur)').inspect}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) do
      (exergue_message_text rescue '') =~ /achevées : 1/
    end
    diag_checkpoint('message de clôture reçu')

    # → l'appel de clôture a bien ciblé LA tâche cochée
    close_call = todoist_e2e_stub_calls(stub_dir).find { |c| c['path'] == "/tasks/#{task['id']}/close" }
    raise "aucun appel de clôture pour la tâche #{task['id']} : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless close_call
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("flux Todoist réel : clic badge -> TasksDialog -> coche -> OK -> Confirmer -> clôture backend") { run_test }
