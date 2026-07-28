# Test : mise en standby d'un projet (clic sur le bouton standby de la
# carte) — Project.js#standbyize
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def click_standby_btn(project_id)
  bridge_eval(<<~JS)
    (function(){
      var fireClick=#{BoardTest::FIRE_CLICK_JS};
      var el=document.querySelector('#project-#{project_id} .standby-btn');
      if(!el) throw new Error('bouton standby introuvable');
      fireClick(el);
      return '';
    })()
  JS
end

def run_test
  project_id = create_fixture_project(title: 'Projet à standby-iser')
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # - cliquer sur le bouton standby
  click_standby_btn(project_id)

  # → la carte a la classe 'collapsed'
  wait_until(desc: -> { "classe 'collapsed' absente de #{card_id}" }) { has_class?(card_id, 'collapsed') }

  # → la carte est dans le conteneur standby, pas le conteneur normal
  in_standby = bridge_eval(<<~JS) == 'true'
    (function(){
      var card=document.getElementById(#{card_id.to_json});
      var standby=document.getElementById('standby-project-container');
      return !!standby && standby.contains(card);
    })()
  JS
  raise "La carte n'est pas dans #standby-project-container" unless in_standby

  # → persisté dans la fiche du projet
  wait_until(desc: -> { 'collapsed pas encore persisté à true dans la fiche' }) do
    read_project_card(project_id)['collapsed'] == true
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("mise en standby d'un projet") { run_test }
