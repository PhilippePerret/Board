# Test : service commun "init-documentation" ("Initier documentation")
# Source : demande explicite (2026-07-13).
#
# Param (frontend/js/ServiceData.js, groupe "Documentation") :
#   - docu-folder (type 'path', absolute:true) : dossier CONTENEUR
#     sélectionné dans le Finder -> backend/scripts/InitDocumentation.rb crée
#     dedans : Documentation/docu.adoc + Documentation/adocs/introduction.adoc
#
# Contrairement aux 3 autres services "Documentation", celui-ci a un effet
# purement filesystem, vérifiable directement (pas besoin de Finder/app
# externe) : les assertions portent sur les fichiers créés.
#
# 2e clic (même projet, sans rechargement) : common_services_data déjà en carte projet ->
# le script est rejoué avec le même dossier -> tombe sur son propre garde-fou
# ("Le dossier existe déjà...", table[:ok] = false côté script) -> vérifie
# que Board ne plante pas et que les fichiers déjà créés ne sont pas altérés.
#
# Suite (demande explicite, 2026-08-03) : les noms de dossier/fichiers sont
# pilotés par les réglages application ('docu-folder-name',
# 'docu-main-edit-file', 'docu-main-disp-file', frontend/js/AppData.js) —
# testés ici avec des noms personnalisés (pas les défauts) pour prouver
# qu'ils sont bien utilisés, pas juste coïncidents avec le défaut. Une fois
# l'init faite, 'docu-folder'/'docu-main-file-adoc'/'docu-main-file-html'
# doivent être définis pour le projet, et permettre d'enchaîner tout de
# suite (même session) sur 'update-documentation' puis 'open-a-file' SANS
# aucune redemande (param type 'project', déjà résolu).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'init-documentation'
UPDATE_SERVICE_DOM_ID = 'update-documentation'
OPEN_SERVICE_DOM_ID   = 'open-a-file'

DOCU_FOLDER_NAME    = 'Docs'
DOCU_MAIN_EDIT_FILE = 'main.adoc'
DOCU_MAIN_DISP_FILE = 'main.html'

def safari_running?
  system('pgrep', '-x', 'Safari', out: File::NULL, err: File::NULL)
end

def safari_tab_with_url?(url)
  out = `osascript -e 'tell application "Safari" to return URL of every tab of every window' 2>/dev/null`
  out.include?(url)
end

# Même principe que pour CotEditor (service_commun_edit_documentation.rb) :
# deux étapes distinctes (app lancée, puis onglet ouvert), poll 1s chacune,
# jamais un timeout deviné sur l'ensemble.
def wait_for_safari_tab(url)
  wait_until(15, 1, desc: -> { 'Safari jamais lancé' }) { safari_running? }
  wait_until(15, 1, desc: -> { "onglets Safari sans #{url.inspect}" }) { safari_tab_with_url?(url) }
end

def run_test
  id = nil
  safari_was_running = system('pgrep', '-x', 'Safari', out: File::NULL, err: File::NULL)

  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)

    app_data = read_app_data
    app_data['docu-folder-name']    = DOCU_FOLDER_NAME
    app_data['docu-main-edit-file'] = DOCU_MAIN_EDIT_FILE
    app_data['docu-main-disp-file'] = DOCU_MAIN_DISP_FILE
    write_app_data(app_data)

    launch_app

    card = "project-#{id}"
    docu_folder    = File.join(fixture_dir, DOCU_FOLDER_NAME)
    main_docu_file = File.join(docu_folder, DOCU_MAIN_EDIT_FILE)
    main_disp_file = File.join(docu_folder, DOCU_MAIN_DISP_FILE)
    first_adoc     = File.join(docu_folder, 'adocs', 'introduction.adoc')

    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du dossier CONTENEUR (le service crée
    #   lui-même le sous-dossier "Documentation" dedans)
    #   Le clic ne fait que lancer un aller-retour ASYNCHRONE (bridge ->
    #   backend -> getPathOfFinderSelection.scpt, qui lit `selection` du
    #   Finder) : fermer la fenêtre tout de suite (comme le faisait
    #   with_finder_selection) la ferme AVANT que l'aller-retour soit
    #   terminé -> AppleScript ne trouve plus de sélection -> erreur JS
    #   silencieuse -> exec-service jamais appelé (même course que
    #   service_commun_ouverture_dossier.rb). On garde donc la fenêtre
    #   ouverte jusqu'à la preuve que l'aller-retour est terminé (fichier créé).
    wait_for_suffix('btn-oui')
    expected_selection_name = finder_select(fixture_dir)
    click_suffix('btn-oui')

    # → arborescence créée
    wait_until(desc: -> { "docu.adoc existe ? #{File.exist?(main_docu_file)}" }) { File.exist?(main_docu_file) }
    finder_close_front_window_if_named(expected_selection_name)
    raise "adocs/introduction.adoc pas créé" unless File.exist?(first_adoc)

    main_content = File.read(main_docu_file)
    raise "docu.adoc sans titre '= Documentation =' : #{main_content.inspect}" unless main_content.start_with?('= Documentation =')
    raise "docu.adoc n'inclut pas adocs/introduction.adoc : #{main_content.inspect}" unless main_content.include?('include::adocs/introduction.adoc[]')

    intro_content = File.read(first_adoc)
    raise "introduction.adoc sans titre '== Introduction ==' : #{intro_content.inspect}" unless intro_content.start_with?('== Introduction ==')

    # → common_services_data enregistrée groupée par param : [[dossier_conteneur]]
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      common_services_data = read_project_card(id).dig('common_services_data', 'init-documentation')
      common_services_data.is_a?(Array) && File.realpath(common_services_data[0][0]) == File.realpath(fixture_dir)
    end

    # → propriétés projet auto-définies par ServiceData.js#afterRunWithSuccess,
    #   à partir des réglages application personnalisés (pas les défauts)
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      card_data = read_project_card(id)
      card_data['docu-folder'] && File.realpath(card_data['docu-folder']) == File.realpath(docu_folder)
    end
    card_data = read_project_card(id)
    raise "docu-main-file-adoc attendu #{main_docu_file.inspect}, trouvé #{card_data['docu-main-file-adoc'].inspect}" \
      unless card_data['docu-main-file-adoc'] && File.realpath(card_data['docu-main-file-adoc']) == File.realpath(main_docu_file)
    raise "docu-main-file-html attendu #{main_disp_file.inspect}, trouvé #{card_data['docu-main-file-html'].inspect}" \
      unless card_data['docu-main-file-html'] && File.realpath(card_data['docu-main-file-html']) == File.realpath(main_disp_file)

    # → enchaînement immédiat, même session : 'update-documentation' ne
    #   redemande rien (param type 'project', déjà résolu) et génère le html
    wait_for(UPDATE_SERVICE_DOM_ID)
    click(UPDATE_SERVICE_DOM_ID)
    wait_until(desc: -> { "#{main_disp_file} jamais généré par update-documentation" }) { File.exist?(main_disp_file) }

    # → enchaînement immédiat : 'open-a-file' (documentation) ne redemande
    #   rien non plus et ouvre le fichier html dans le navigateur
    wait_for(OPEN_SERVICE_DOM_ID)
    click(OPEN_SERVICE_DOM_ID)
    wait_for_safari_tab("file://#{main_disp_file}")

    # - recharger l'application : re-sélection, nouveau clic sur le service
    #   -> common_services_data déjà présente -> pas de redialogue, le script retombe sur
    #   son garde-fou ("dossier existe déjà")
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le 2e clic sur #{SERVICE_DOM_ID}" unless board_running?
    sleep 1 # laisse le temps à l'aller-retour backend, rien de plus à attendre côté DOM

    raise "docu.adoc altéré par le 2e clic" unless File.read(main_docu_file) == main_content
    raise "introduction.adoc altéré par le 2e clic" unless File.read(first_adoc) == intro_content
  end
ensure
  remove_fixture_project(id) if id
  # → ferme Safari uniquement si c'est ce test qui l'a lancé (jamais si déjà
  #   ouvert avant, pour ne pas fermer un travail en cours)
  system('osascript', '-e', 'quit app "Safari"') if id && !safari_was_running
end

board_test("service commun 'initier documentation' : crée l'arborescence, garde-fou au 2e clic, enchaînement update/open") { run_test }
