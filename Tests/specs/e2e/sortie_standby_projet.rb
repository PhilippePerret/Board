# Test : sortie de standby d'un projet (reclic sur le bouton standby d'une
# carte déjà en standby) — Project.js#standbyize
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
  project_id = create_fixture_project(title: 'Projet déjà en standby', collapsed: true)
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)
  wait_until(desc: -> { "classe 'collapsed' absente au départ de #{card_id}" }) { has_class?(card_id, 'collapsed') }

  # - reclic sur le bouton standby
  click_standby_btn(project_id)

  # → la classe 'collapsed' a disparu
  wait_until(desc: -> { "classe 'collapsed' toujours présente sur #{card_id}" }) { !has_class?(card_id, 'collapsed') }

  # → la carte est revenue dans le conteneur normal
  in_normal_container = bridge_eval(<<~JS) == 'true'
    (function(){
      var card=document.getElementById(#{card_id.to_json});
      var normal=document.getElementById('project-cards-container');
      return !!normal && normal.contains(card);
    })()
  JS
  raise "La carte n'est pas revenue dans #project-cards-container" unless in_normal_container

  # → persisté dans la fiche du projet
  wait_until(desc: -> { 'collapsed pas encore persisté à false dans la fiche' }) do
    read_project_card(project_id)['collapsed'] == false
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("sortie de standby d'un projet") { run_test }
