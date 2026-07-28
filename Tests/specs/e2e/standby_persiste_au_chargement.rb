# Test : un projet créé avec collapsed: true apparaît directement dans le
# conteneur standby au lancement de l'app, sans avoir à cliquer sur le
# bouton standby — Project.js (construction de la carte, ligne ~517)
# Source : Tests/_tests_a_faire.adoc

require_relative '../../support/helpers'

include BoardTest

def run_test
  project_id = create_fixture_project(title: 'Projet standby au chargement', collapsed: true)
  launch_app

  card_id = "project-#{project_id}"
  wait_for(card_id)

  # → classe 'collapsed' déjà présente, sans action de l'utilisateur
  raise "#{card_id} sans la classe 'collapsed' dès le chargement" unless has_class?(card_id, 'collapsed')

  # → déjà dans le conteneur standby, sans action de l'utilisateur
  in_standby = bridge_eval(<<~JS) == 'true'
    (function(){
      var card=document.getElementById(#{card_id.to_json});
      var standby=document.getElementById('standby-project-container');
      return !!standby && standby.contains(card);
    })()
  JS
  raise "La carte n'est pas dans #standby-project-container dès le chargement" unless in_standby
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("un projet collapsed apparaît en standby dès le chargement") { run_test }
