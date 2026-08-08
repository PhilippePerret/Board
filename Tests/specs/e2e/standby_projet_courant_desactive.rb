# Test : mettre en standby le projet COURANT doit le désélectionner
# immédiatement (Project.current) ET ne plus le restaurer comme projet
# courant au prochain chargement (App#selectLastProjectIfRequired,
# App.js:49-58, lit 'last-project' dans les données de l'app).
# Bug signalé : les deux se produisent encore aujourd'hui (issues GitHub
# #28 et #29).

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

def current_project_id
  bridge_eval("String(Project.current && Project.current.id || '')")
end

def run_test
  project_id = create_fixture_project(title: 'Projet courant à standby-iser')

  # 'remember-last-project' est désactivé par défaut (AppData.js) : sans
  # ça, App#selectLastProjectIfRequired ne lit/n'écrit jamais 'last-project',
  # et la partie "au chargement" du bug ne peut pas être observée.
  app_data = read_app_data
  app_data['remember-last-project'] = true
  write_app_data(app_data)

  launch_app

  card_id = "project-#{project_id}"
  wait_for_project_card(project_id)

  click(card_id)
  wait_until(desc: -> { "projet pas encore courant (#{current_project_id.inspect})" }) do
    current_project_id == project_id
  end

  click_standby_btn(project_id)
  wait_until(desc: -> { "classe 'collapsed' absente de #{card_id}" }) { has_class?(card_id, 'collapsed') }

  raise "le projet reste le projet courant après mise en standby (Project.current)" if
    current_project_id == project_id

  wait_until(desc: -> { "last-project pas encore nettoyé côté serveur (#{read_app_data['last-project'].inspect})" }) do
    read_app_data['last-project'].to_s != project_id
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("mise en standby du projet courant : ne doit plus être courant, ni le redevenir au rechargement") { run_test }
