# Test : service commun "open-folder-project" ("Ouvrir dossier du projet")
# Source : demande explicite (2026-07-12).
#
# Le projet connaît déjà son dossier (obligatoire à sa création) : le service
# commun ne demande donc PAS de sélectionner quoi que ce soit dans le Finder,
# juste de positionner/dimensionner une fenêtre Finder quelconque (au premier
# plan au moment de valider) pour en récupérer le bounds — cf.
# frontend/js/ServiceData.js (COMMON_SERVICES_DATA, param "window-bounds",
# type "bounds") et frontend/js/ServiceDefiner.js#defineByType, case 'bounds'.
#
# Déroulé attendu :
#   - sélection du projet → le panneau des services communs s'ouvre seul
#     (Project.js#affProjectButtons -> Service.showCommonPanel)
#   - clic sur "Ouvrir dossier du projet"
#   - PAS de dialogue de nommage : ServiceDefiner#unnamed vaut
#     `this.service.stype == 'custom'` (Service.js#stype), donc false pour un
#     service commun — contrairement à un service custom (cf.
#     attribution_service.rb, qui lui passe par ce dialogue)
#   - dialogue de positionnement de fenêtre Finder → OK
#   → le dossier du projet doit s'ouvrir dans le Finder
#   - rechargement de l'app, re-sélection du projet, nouveau clic sur le
#     service
#   → le dossier doit s'ouvrir directement, sans plus rien redemander
#     (bounds déjà enregistrés côté projet)

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-folder-project'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    expected_name = File.basename(fixture_dir)

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de positionnement (bounds) : nécessite une fenêtre Finder au
    #   premier plan au moment de valider — n'importe laquelle convient
    wait_for('btn-oui', 10)
    with_finder_selection(fixture_dir) do
      click('btn-oui')

      # → le dossier du projet doit s'ouvrir dans le Finder
      wait_until(10, desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
        finder_front_window_name == expected_name
      end
    end

    finder_close_all_windows

    # - recharger l'application
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois le dossier doit s'ouvrir directement, sans redemander
    click_service_and_wait_folder(SERVICE_DOM_ID, fixture_dir)
  end
ensure
  remove_fixture_project(id) if id
  finder_close_all_windows rescue nil
end

board_test("service commun 'ouvrir dossier du projet' : définition au premier clic, exécution directe ensuite") { run_test }
