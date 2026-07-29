# Test : un projet en standby avec une tâche Todoist du jour à une heure
# (même déjà passée au moment du poll, cf. plus bas) reste en standby tant
# que le poll n'a pas tourné, ajoute la tâche à ses tâches courantes, lui
# enregistre un Reminder, puis sort automatiquement du standby au poll.
# Source : Tests/_tests_a_faire.adoc
#
# Utilise le stub Todoist (Tests/support/todoist_e2e_stub.rb +
# BOARD_TEST_TODOIST_STUB_DIR côté backend/lib/todoist.rb) : aucun appel
# réseau réel. Plutôt que d'attendre le vrai setInterval de Reminder (60s,
# cf. frontend/js/Reminder.js#run), la tâche fixture est due dans le passé
# et on déclenche Reminder.poll() nous-même via bridge_eval — déterministe,
# rapide, pas de marqueur @long nécessaire.

require_relative '../../support/todoist_e2e_stub'

include BoardTest

def run_test
  # Due il y a 30s : déjà passée au moment du poll manuel, mais ça ne change
  # rien à "reste en standby juste après le lancement" — le poll automatique
  # (setInterval 60s) n'a de toute façon pas eu le temps de tourner.
  due_iso = (Time.now - 30).strftime('%Y-%m-%dT%H:%M:%S')
  task_content = 'Tâche à heure future test'
  fixture_task = {'id' => 'fixture-task-1', 'content' => task_content, 'due' => {'date' => due_iso}}

  with_todoist_e2e_stub([{'results' => [fixture_task]}]) do |stub_dir|
    project_id = create_fixture_project(title: 'Projet standby + tâche à heure future', collapsed: true, todoist_id: 'fixture-todoist-id')
    launch_app

    card_id = "project-#{project_id}"
    wait_for(card_id)

    # → reste en standby juste après le chargement (poll automatique pas encore passé)
    raise "#{card_id} déjà sorti du standby avant le poll" unless has_class?(card_id, 'collapsed')

    # → la tâche est bien dans les tâches courantes du projet
    has_task = bridge_eval(<<~JS)
      (function(){
        var p = Project.get(#{project_id.to_json});
        return p.tasks.some(function(t){ return t.content === #{task_content.to_json}; }).toString();
      })()
    JS
    raise "tâche #{task_content.inspect} absente de project.tasks" unless has_task == 'true'

    # → un Reminder a été enregistré pour cette tâche, avec réactivation du standby
    has_reminder = bridge_eval(<<~JS)
      (function(){
        var p = Project.get(#{project_id.to_json});
        return Reminder.asArray().some(function(r){
          return r.project === p && typeof r.onDue === 'function';
        }).toString();
      })()
    JS
    raise "aucun Reminder (avec onDue de réactivation) enregistré pour le projet" unless has_reminder == 'true'

    # → simule le poll périodique (au lieu d'attendre le vrai setInterval 60s)
    bridge_eval('Reminder.poll()')

    # → sort du standby une fois le poll passé
    raise "#{card_id} toujours en standby après le poll" if has_class?(card_id, 'collapsed')
  ensure
    remove_fixture_project(project_id) if project_id
  end
end

board_test("sortie auto du standby à l'heure d'une tâche future : tâche ajoutée, Reminder enregistré, réactivation au poll") { run_test }
