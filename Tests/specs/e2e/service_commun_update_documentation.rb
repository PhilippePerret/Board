# Test : service commun "update-documentation" ("Actualiser la documentation")
# Source : demande explicite (2026-07-13).
#
# Param (frontend/js/ServiceData.js, groupe "Documentation") :
#   - docu-main-file-adoc (type 'project', if_undefined 'path') : fichier
#     .adoc principal sélectionné dans le Finder -> backend/scripts/
#     UpdateDocumentation.rb reçoit [chemin_fichier] (chemin seul) ; le nom
#     de fichier est déduit du chemin par le script lui-même (File.basename).
#
# UpdateDocumentation.rb fait seulement `cd <dossier> && asciidoctor <nom>`
# (PAS d'`open .` — jamais voulu, comportement retiré volontairement) : la
# vérification porte donc sur l'enregistrement de common_services_data et
# sur le message de résultat, pas sur une fenêtre Finder.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'update-documentation'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    main_file = File.join(fixture_dir, 'docu.adoc')
    File.write(main_file, "= Documentation =\n\nContenu de test.\n")

    card = "project-#{id}"

    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du fichier .adoc principal dans le Finder
    wait_for_suffix('btn-oui')
    with_finder_selection(main_file) do
      click_suffix('btn-oui')
      # → common_services_data enregistrée groupée par param : [[chemin_fichier]]
      wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
        common_services_data = read_project_card(id).dig('common_services_data', 'update-documentation')
        common_services_data.is_a?(Array) && File.realpath(common_services_data[0][0]) == File.realpath(main_file)
      end
    end
    assert_service_message_ok!

    # - recharger l'application : re-sélection, nouveau clic sur le service
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois, aucun dialogue : le service se rejoue direct
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le clic sur #{SERVICE_DOM_ID}" unless board_running?
    assert_service_message_ok!
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'actualiser la documentation' : définition au premier clic, exécution directe ensuite") { run_test }
