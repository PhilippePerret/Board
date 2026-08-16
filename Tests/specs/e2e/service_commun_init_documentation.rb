# Test : service commun "init-documentation" ("Initier documentation")
# Source : demande explicite (2026-07-13). Réécrit le 2026-08-16 pour le
# nouveau mécanisme (ServiceData.js) :
#   - docu-folder (type 'project', if_undefined type 'path') : le dossier
#     de documentation LUI-MÊME, déjà existant (pas un conteneur) ->
#     backend/scripts/InitDocumentation.rb y crée :
#     <basename(docu-folder)>.adoc + adocs/introduction.adoc
#
# Contrairement aux 3 autres services "Documentation", celui-ci a un effet
# purement filesystem, vérifiable directement (pas besoin de Finder/app
# externe) : les assertions portent sur les fichiers créés.
#
# 2e clic (même projet, sans rechargement) : 'docu-folder' déjà résolu (type
# 'project') -> pas de redialogue -> le script réécrit les mêmes fichiers
# avec le même contenu (pas de garde-fou côté script, mais idempotent) ->
# vérifie que Board ne plante pas et que le contenu reste identique.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'init-documentation'
UPDATE_SERVICE_DOM_ID = 'update-documentation'
OPEN_SERVICE_DOM_ID   = 'open-a-file'

def safari_running?
  system('pgrep', '-x', 'Safari', out: File::NULL, err: File::NULL)
end

def safari_tab_with_url?(url)
  out = `osascript -e 'tell application "Safari" to return URL of every tab of every window' 2>/dev/null`
  out.include?(url)
end

# Ferme UNIQUEMENT l'onglet ouvert par ce test (jamais toute l'app, ni les
# autres onglets/fenêtres) — pour le cas où Safari était déjà ouvert avant
# le test (quit_new_apps, dans run_tests.sh, ne quitte que les apps
# apparues DEPUIS le run, donc ne s'applique pas ici).
def close_safari_tab_with_url(url)
  system('osascript', '-e', <<~APPLESCRIPT)
    tell application "Safari"
      repeat with w in windows
        repeat with t in tabs of w
          if URL of t is #{url.inspect} then close t
        end repeat
      end repeat
    end tell
  APPLESCRIPT
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
  main_disp_file = nil
  safari_was_running = safari_running?

  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)

    # docu-folder doit déjà exister (sélectionné tel quel dans le Finder,
    # pas créé par le script) — File.realpath résout le symlink macOS
    # /var -> /private/var une bonne fois.
    docu_folder = File.join(File.realpath(fixture_dir), 'Manuel')
    FileUtils.mkdir_p(docu_folder)
    main_docu_file = File.join(docu_folder, 'Manuel.adoc')
    main_disp_file = File.join(docu_folder, 'Manuel.html')
    first_adoc     = File.join(docu_folder, 'adocs', 'introduction.adoc')

    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du dossier de documentation LUI-MÊME (déjà
    #   existant, pas un conteneur). Le clic ne fait que lancer un
    #   aller-retour ASYNCHRONE (bridge -> backend -> getPathOfFinderSelection.scpt,
    #   qui lit `selection` du Finder) : fermer la fenêtre tout de suite la
    #   ferme AVANT que l'aller-retour soit terminé -> AppleScript ne trouve
    #   plus de sélection -> erreur JS silencieuse -> exec-service jamais
    #   appelé. On garde donc la fenêtre ouverte jusqu'à la preuve que
    #   l'aller-retour est terminé (fichier créé).
    wait_for_suffix('btn-oui')
    expected_selection_name = finder_select(docu_folder)
    sleep 0.3
    click_suffix_last('btn-oui')

    # → arborescence créée
    wait_until(desc: -> { "Manuel.adoc existe ? #{File.exist?(main_docu_file)}" }) { File.exist?(main_docu_file) }
    finder_close_front_window_if_named(expected_selection_name)
    raise "adocs/introduction.adoc pas créé" unless File.exist?(first_adoc)

    main_content = File.read(main_docu_file)
    raise "Manuel.adoc sans titre '= Documentation =' : #{main_content.inspect}" unless main_content.start_with?('= Documentation =')
    raise "Manuel.adoc n'inclut pas adocs/introduction.adoc : #{main_content.inspect}" unless main_content.include?('include::adocs/introduction.adoc[]')

    intro_content = File.read(first_adoc)
    raise "introduction.adoc sans titre '== Introduction ==' : #{intro_content.inspect}" unless intro_content.start_with?('== Introduction ==')

    # → propriétés projet auto-définies : 'docu-folder' par le mécanisme
    #   type:'project' (Prompter#promptProject, dès la résolution du
    #   dialogue), 'docu-main-file-adoc'/'docu-main-file-html' par
    #   ServiceData.js#afterRunWithSuccess
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      card_data = read_project_card(id)
      card_data['docu-folder'] && File.realpath(card_data['docu-folder']) == File.realpath(docu_folder)
    end
    card_data = read_project_card(id)
    raise "docu-main-file-adoc attendu #{main_docu_file.inspect}, trouvé #{card_data['docu-main-file-adoc'].inspect}" \
      unless card_data['docu-main-file-adoc'] && File.realpath(card_data['docu-main-file-adoc']) == File.realpath(main_docu_file)
    # docu-main-file-html : pas encore créé à ce stade (généré par
    # update-documentation, ci-dessous) -> comparaison de chemin, pas realpath
    raise "docu-main-file-html attendu #{main_disp_file.inspect}, trouvé #{card_data['docu-main-file-html'].inspect}" \
      unless card_data['docu-main-file-html'] && File.expand_path(card_data['docu-main-file-html']) == File.expand_path(main_disp_file)

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
    #   -> 'docu-folder' déjà résolu (type 'project') -> pas de redialogue,
    #   le script réécrit les mêmes fichiers avec le même contenu
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le 2e clic sur #{SERVICE_DOM_ID}" unless board_running?
    sleep 1 # laisse le temps à l'aller-retour backend, rien de plus à attendre côté DOM

    raise "Manuel.adoc altéré par le 2e clic" unless File.read(main_docu_file) == main_content
    raise "introduction.adoc altéré par le 2e clic" unless File.read(first_adoc) == intro_content
  end
ensure
  remove_fixture_project(id) if id
  # Safari déjà ouvert avant le test : quit_new_apps (run_tests.sh) ne le
  # quittera pas (app pas "apparue" pendant le run) — on ferme juste notre
  # onglet. Sinon (Safari lancé par ce test), quit_new_apps s'en charge.
  close_safari_tab_with_url("file://#{main_disp_file}") if safari_was_running && main_disp_file
end

board_test("service commun 'initier documentation' : crée l'arborescence, garde-fou au 2e clic, enchaînement update/open") { run_test }
