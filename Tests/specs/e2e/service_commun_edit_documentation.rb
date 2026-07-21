require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'edit-documentation'
EDITOR_NAME = 'CotEditor'
EDITOR_BUNDLE_ID = 'com.coteditor.CotEditor'

def coteditor_installed?
  !`mdfind "kMDItemCFBundleIdentifier == '#{EDITOR_BUNDLE_ID}'"`.strip.empty?
end

def coteditor_window_named?(name)
  out = `osascript -e 'tell application "System Events" to get name of every window of process "CotEditor"' 2>/dev/null`
  out.split(',').map(&:strip).include?(name)
end

def run_test
  pending("#{EDITOR_NAME} non installé sur cette machine") unless coteditor_installed?

  id = nil
  coteditor_was_running = system('pgrep', '-x', 'CotEditor', out: File::NULL, err: File::NULL)

  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    File.write(File.join(fixture_dir, 'notes.md'), '# Notes')

    id = create_fixture_project(title: 'Projet A', path: fixture_dir)

    app_data = read_app_data
    app_data['documentation-editor'] = EDITOR_NAME
    write_app_data(app_data)

    launch_app

    card = "project-#{id}"
    expected_name = File.basename(fixture_dir)

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du dossier de documentation dans le Finder
    #   (documentation-editor ne redemande rien : type 'app')
    wait_for('btn-oui')
    with_finder_selection(fixture_dir) do
      click('btn-oui')

      # → le dossier doit s'ouvrir dans l'éditeur de test (fenêtre nommée
      #   d'après le dossier — seulement si le dossier contient un fichier,
      #   CotEditor ouvre un document vierge sans rapport sinon)
      wait_until(desc: -> { "fenêtres #{EDITOR_NAME} = #{`osascript -e 'tell application \"System Events\" to get name of every window of process \"CotEditor\"' 2>/dev/null`.strip.inspect} (attendu #{expected_name.inspect})" }) do
        coteditor_window_named?(expected_name)
      end
    end

    # → common_services_data enregistrée : [dossier, éditeur]
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      common_services_data = read_project_card(id).dig('common_services_data', 'edit-documentation')
      common_services_data.is_a?(Array) && common_services_data[1] == [EDITOR_NAME]
    end

    # - recharger l'application : re-sélection, nouveau clic sur le service
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois, aucun dialogue : le dossier s'ouvre direct dans l'éditeur
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le clic sur #{SERVICE_DOM_ID}" unless board_running?
    wait_until(desc: -> { "fenêtres #{EDITOR_NAME} = #{`osascript -e 'tell application \"System Events\" to get name of every window of process \"CotEditor\"' 2>/dev/null`.strip.inspect} (attendu #{expected_name.inspect})" }) do
      coteditor_window_named?(expected_name)
    end
  end
ensure
  remove_fixture_project(id) if id
  # → ferme CotEditor uniquement si c'est ce test qui l'a lancé (jamais si
  #   déjà ouvert avant, pour ne pas fermer un travail en cours)
  system('osascript', '-e', 'quit app "CotEditor"') if id && !coteditor_was_running
end

board_test("service commun 'éditer la documentation' : définition au premier clic, exécution directe ensuite") { run_test }
