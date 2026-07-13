# Test : service commun "update-documentation" ("Actualiser la documentation")
# Source : demande explicite (2026-07-13).
#
# Param (frontend/js/ServiceData.js, groupe "Documentation") :
#   - docu-main-file (type 'path', PAS absolute) : fichier .adoc principal
#     sélectionné dans le Finder -> backend/scripts/UpdateDocumentation.rb
#     reçoit [chemin_fichier, nom_fichier].
#
# UpdateDocumentation.rb fait `cd <dossier> && open . && asciidoctor <nom>` :
# le `&&` place `open .` AVANT `asciidoctor`, donc la fenêtre Finder
# s'ouvre sur le dossier du fichier même si `asciidoctor` n'est pas
# installé/échoue (le script capture toute exception dans son propre
# rescue et renvoie ok:false sans jamais remonter jusqu'à Board) — la
# vérification porte donc sur l'ouverture Finder, pas sur le rendu
# AsciiDoctor lui-même (non garanti présent sur la machine de test).

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
    expected_name = File.basename(fixture_dir)

    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du fichier .adoc principal dans le Finder
    wait_for('btn-oui', 10)
    with_finder_selection(main_file) do
      click('btn-oui')

      # → le dossier contenant le fichier doit s'ouvrir dans le Finder
      #   (`open .` du script, avant l'appel à asciidoctor)
      wait_until(10, desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
        finder_front_window_name == expected_name
      end
    end

    # → sdata enregistrée : [chemin_fichier, nom_fichier]
    wait_until(5, desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      sdata = read_project_card(id).dig('sdata', 'update-documentation')
      sdata.is_a?(Array) && sdata[1] == 'docu.adoc'
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
    wait_until(10, desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
      finder_front_window_name == expected_name
    end
  end
ensure
  remove_fixture_project(id) if id
  finder_close_all_windows rescue nil
end

board_test("service commun 'actualiser la documentation' : définition au premier clic, exécution directe ensuite") { run_test }
