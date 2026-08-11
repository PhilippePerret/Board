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
    lines << "ids présents dans le DOM (#{dom_ids.split(',').length}) : #{dom_ids.split(',').last(20).inspect} (20 derniers)"
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
  project_title = 'Projet À Lier'

  stub_responses = [
    {'results' => [{'id' => 'todoist-proj-42', 'name' => project_title}]},  # 0. find_project_id
    {'results' => []},                                                     # 1. today_tasks
  ]
  with_todoist_e2e_stub(stub_responses) do |stub_dir|
    diag_checkpoint('avant create_fixture_project')
    project_id = create_fixture_project(title: project_title)
    diag_checkpoint("fixture créée id=#{project_id}")
    # Sans token local (dossier de données toujours vierge à chaque run,
    # cf. run_tests.sh), Todoist._resolveAPIKey affiche le dialogue "Clé
    # API" au lieu du dialogue "titre du projet" attendu ici — token bidon,
    # seul le stub HTTP (with_todoist_e2e_stub) compte pour la suite.
    File.write(File.join(BOARD_SUPPORT_DIR, 'todoist.yaml'), {'token' => 'fake-test-token-e2e'}.to_yaml)
    launch_app
    diag_checkpoint('launch_app terminé')

    card = "project-#{project_id}"
    wait_until(4, desc: -> { "élément introuvable : #{card}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) { exists?(card) }
    diag_checkpoint('carte projet apparue')

    # → aucun appel au chargement (pas de todoist_id encore)
    raise "appel(s) todoist inattendu(s) au chargement : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless
      todoist_e2e_stub_calls(stub_dir).empty?

    click_todoist_badge(project_id)
    diag_checkpoint('badge todoist cliqué')

    # → TextFieldDialog "Quel est le titre du projet dans Todoist ?",
    #   valeur par défaut = titre du projet -> on garde le défaut
    wait_until(8, desc: -> { "suffixe introuvable : btn-oui\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) { exists_suffix?('btn-oui') }
    diag_checkpoint('TextFieldDialog affiché')
    click_suffix('btn-oui')
    diag_checkpoint('btn-oui cliqué')

    wait_until(10, desc: -> { "carte projet = #{read_project_card(project_id).inspect}\n    DUMP:\n    #{diag_dump(project_id, stub_dir)}" }) do
      read_project_card(project_id)['todoist_id'] == 'todoist-proj-42'
    end
    diag_checkpoint('todoist_id résolu et enregistré')

    find_call = todoist_e2e_stub_calls(stub_dir).find { |c| c['path'] == '/projects' }
    raise "aucun appel GET /projects : #{todoist_e2e_stub_calls(stub_dir).inspect}" unless find_call
  end
ensure
  diag_checkpoint("avant remove_fixture_project id=#{project_id}") if project_id
  remove_fixture_project(project_id) if project_id
end

board_test("Todoist : première liaison projet -> résolution et enregistrement du todoist_id") { run_test }
