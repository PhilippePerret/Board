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
# 2e clic (même projet, sans rechargement) : sdata déjà en carte projet ->
# le script est rejoué avec le même dossier -> tombe sur son propre garde-fou
# ("Le dossier existe déjà...", table[:ok] = false côté script) -> vérifie
# que Board ne plante pas et que les fichiers déjà créés ne sont pas altérés.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'init-documentation'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    docu_folder    = File.join(fixture_dir, 'Documentation')
    main_docu_file = File.join(docu_folder, 'docu.adoc')
    first_adoc     = File.join(docu_folder, 'adocs', 'introduction.adoc')

    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de sélection du dossier CONTENEUR (le service crée
    #   lui-même le sous-dossier "Documentation" dedans)
    wait_for('btn-oui')
    with_finder_selection(fixture_dir) do
      click('btn-oui')
    end

    # → arborescence créée
    wait_until(desc: -> { "docu.adoc existe ? #{File.exist?(main_docu_file)}" }) { File.exist?(main_docu_file) }
    raise "adocs/introduction.adoc pas créé" unless File.exist?(first_adoc)

    main_content = File.read(main_docu_file)
    raise "docu.adoc sans titre '= Documentation =' : #{main_content.inspect}" unless main_content.start_with?('= Documentation =')
    raise "docu.adoc n'inclut pas adocs/introduction.adoc : #{main_content.inspect}" unless main_content.include?('include::adocs/introduction.adoc[]')

    intro_content = File.read(first_adoc)
    raise "introduction.adoc sans titre '== Introduction ==' : #{intro_content.inspect}" unless intro_content.start_with?('== Introduction ==')

    # → sdata enregistrée : [dossier_conteneur, nom_dossier_conteneur]
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      sdata = read_project_card(id).dig('sdata', 'init-documentation')
      sdata.is_a?(Array) && sdata[1] == File.basename(fixture_dir)
    end

    # - recharger l'application : re-sélection, nouveau clic sur le service
    #   -> sdata déjà présente -> pas de redialogue, le script retombe sur
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
end

board_test("service commun 'initier documentation' : crée l'arborescence, garde-fou au 2e clic") { run_test }
