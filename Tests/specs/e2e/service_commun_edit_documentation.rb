# Test : service commun "edit-documentation" ("Éditer la documentation")
# Source : demande explicite (2026-07-13).
#
# Params (frontend/js/ServiceData.js, groupe "Documentation") :
#   - docu-folder (type 'path', absolute:true) : dossier sélectionné dans le
#     Finder au moment de la définition -> backend/scripts/EditDocumentation.rb
#     reçoit [dossier, nom_dossier] (un param 'path' s'étend toujours en 2
#     valeurs backend, cf. ServiceDefiner#getPathOfFinderSelection)
#   - documentation-editor (type 'app') : PAS de dialogue — valeur déjà
#     présente dans appdata.json (ServiceDefiner#defineByType, case 'app' :
#     App.getData([param.id])), donc réglée ici via write_app_data avant
#     launch_app.
#
# Éditeur de test choisi : "Finder" (et non un vrai éditeur de texte/IDE) —
# le script fait `open -a "#{EDITOR_NAME}" "#{DOCU_FOLDER}"` : avec Finder
# comme "éditeur", ça ouvre juste une fenêtre Finder sur le dossier, ce qui
# donne un effet observable fiable (finder_front_window_name) sans dépendre
# d'un éditeur/IDE précis installé sur la machine de test.
#
# Second passage (après rechargement) : même service, common_services_data déjà en carte
# projet -> exécution directe, aucun dialogue.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'edit-documentation'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)

    app_data = read_app_data
    app_data['documentation-editor'] = 'Finder'
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

      # → le dossier doit s'ouvrir dans le Finder (éditeur de test = Finder)
      wait_until(desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
        finder_front_window_name == expected_name
      end
    end

    # → common_services_data enregistrée : [dossier, éditeur]
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      common_services_data = read_project_card(id).dig('common_services_data', 'edit-documentation')
      common_services_data.is_a?(Array) && common_services_data[1] == 'Finder'
    end

    finder_close_all_windows

    # - recharger l'application : re-sélection, nouveau clic sur le service
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois, aucun dialogue : le dossier s'ouvre direct dans le Finder
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le clic sur #{SERVICE_DOM_ID}" unless board_running?
    wait_until(desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
      finder_front_window_name == expected_name
    end
  end
ensure
  remove_fixture_project(id) if id
  finder_close_all_windows rescue nil
end

board_test("service commun 'éditer la documentation' : définition au premier clic, exécution directe ensuite") { run_test }
