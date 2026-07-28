# Test : cliquer sur le badge Todoist d'une carte en standby ne déclenche
# pas l'action normale — Project.js#onClickTodoist (garde
# `if (ev && this.collapsed) return stopEvent(ev)`)
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

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
  project_id = create_fixture_project(title: 'Projet en standby (todoist)', collapsed: true, todoist_id: 'fixture-todoist-id')
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # - clic sur le badge todoist de la carte collapsed
  click_todoist_badge(project_id)

  # → aucune dialog/panneau de tâches ouvert
  raise 'Un panneau todoist est apparu alors que la carte est en standby' if exists?('btn-oui')
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("clic sur le badge todoist d'une carte en standby ne déclenche rien") { run_test }
