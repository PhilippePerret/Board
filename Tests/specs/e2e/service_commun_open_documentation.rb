# Test : service commun "open-a-file" ("Ouvrir la documentation")
# Source : demande explicite (2026-07-13).
#
# Param (frontend/js/ServiceData.js, groupe "Documentation") :
#   - docu-main-file (type 'path', PAS absolute) : fichier sélectionné dans
#     le Finder -> backend/scripts/OpenAFile.rb fait juste `open "#{PATH}"`.
#
# Pas de scType déclaré -> Service.js#scType défaut '.scpt', absent du
# dossier scripts/ : backend/lib/usefull.rb#run_script retrouve le vrai
# script par nom de base (search_real_scriptname) -> OpenAFile.rb. Pas un
# bug, comportement voulu (cf. commentaire de run_script).
#
# Limite assumée de cette spec : `open <fichier>` délègue à l'app par
# défaut du système pour ce type de fichier (variable selon la machine),
# donc pas de vérification fiable de LA fenêtre/app qui s'ouvre (pas de
# helper générique pour ça dans l'infra de test, contrairement à Finder).
# Vérifié à la place : la sdata est bien enregistrée (donc le clic a
# déclenché la définition + l'exécution), et Board ne plante pas suite à
# l'appel backend. OpenAFile.rb ne renseigne d'ailleurs jamais
# table[:message] (reste nil dans les 2 cas, succès ou échec) : le toast
# ne permet donc pas non plus de distinguer les deux côté test.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-a-file'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    main_file = File.join(fixture_dir, 'manuel.txt')
    File.write(main_file, "Manuel de test.\n")

    card = "project-#{id}"

    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du fichier dans le Finder
    wait_for('btn-oui')
    with_finder_selection(main_file) do
      click('btn-oui')
    end

    # → sdata enregistrée : [chemin_fichier, nom_fichier]
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      sdata = read_project_card(id).dig('sdata', 'open-a-file')
      sdata.is_a?(Array) && sdata[1] == 'manuel.txt'
    end

    raise "Board a quitté après exécution du service" unless board_running?

    # - recharger l'application : re-sélection, nouveau clic sur le service
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois, aucun dialogue : exécution directe, sdata inchangée
    click(SERVICE_DOM_ID)
    raise "Board a quitté juste après le 2e clic sur #{SERVICE_DOM_ID}" unless board_running?
    sleep 1
    sdata = read_project_card(id).dig('sdata', 'open-a-file')
    raise "sdata modifiée par le 2e clic (rechargement) : #{sdata.inspect}" unless sdata[1] == 'manuel.txt'
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'ouvrir la documentation' : définition au premier clic, exécution directe ensuite") { run_test }
