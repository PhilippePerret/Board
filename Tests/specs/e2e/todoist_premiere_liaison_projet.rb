# Test : première liaison projet ↔ Todoist (Todoist#_resolveId,
# frontend/js/Todoist.js:21-35) — un projet SANS todoist_id, au clic sur son
# badge, demande le titre du projet côté Todoist (TextFieldDialog, valeur
# par défaut = titre du projet), cherche l'id correspondant
# (action 'todoist-find-project' -> Todoist.find_project_id, backend/lib/
# todoist.rb) et l'enregistre dans les données du projet.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section H point 24).
#
# 2 réponses stubées, dans l'ordre des appels HTTP réels :
#   0. GET /projects (Todoist.find_project_id, recherche par nom)
#   1. GET /tasks (today_tasks, juste après la résolution de l'id)
# À la différence d'un projet AVEC todoist_id déjà défini (cf.
# todoist_flux_tasksdialog_reel.rb), aucun appel n'est fait au CHARGEMENT
# (Project#todayTaskForNotInter renvoie directement [] sans requête tant que
# todoist_id est absent).

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
  project_title = 'Projet À Lier'

  stub_responses = [
    {'results' => [{'id' => 'todoist-proj-42', 'name' => project_title}]},  # 0. find_project_id
    {'results' => []},                                                     # 1. today_tasks
  ]
  with_todoist_e2e_stub(stub_responses) do |stub_dir|
    project_id = create_fixture_project(title: project_title)
    # Sans token local (dossier de données toujours vierge à chaque run,
    # cf. run_tests.sh), Todoist._resolveAPIKey affiche le dialogue "Clé
    # API" au lieu du dialogue "titre du projet" attendu ici — token bidon,
    # seul le stub HTTP (with_todoist_e2e_stub) compte pour la suite.
    File.write(File.join(BOARD_SUPPORT_DIR, 'todoist.yaml'), {'token' => 'fake-test-token-e2e'}.to_yaml)
    launch_app

    card = "project-#{project_id}"
    wait_for(card)

    # → aucun appel au chargement (pas de todoist_id encore)
    raise "appel(s) todoist inattendu(s) au chargement : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless
      todoist_e2e_stub_calls(stub_dir).empty?

    click_todoist_badge(project_id)

    # → TextFieldDialog "Quel est le titre du projet dans Todoist ?",
    #   valeur par défaut = titre du projet -> on garde le défaut
    wait_for_suffix('btn-oui', 8)
    click_suffix('btn-oui')

    wait_until(10, desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
      read_project_card(project_id)['todoist_id'] == 'todoist-proj-42'
    end

    find_call = todoist_e2e_stub_calls(stub_dir).find { |c| c['path'] == '/projects' }
    raise "aucun appel GET /projects : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless find_call
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("Todoist : première liaison projet -> résolution et enregistrement du todoist_id") { run_test }
