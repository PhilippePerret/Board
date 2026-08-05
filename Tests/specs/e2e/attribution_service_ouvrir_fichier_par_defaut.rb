# Test : attribution du service custom "open-file" (Ouvrir le fichier…) —
# choix "(par défaut)" (valeur 'none') : pas d'application précisée,
# backend/scripts/OpenFile.sh fera "open path" sans "-a".
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-file'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    file_path = File.join(fixture_dir, 'note.txt')
    File.write(file_path, 'contenu de test')
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"

    wait_for(card)
    click(card)
    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')
    wait_for(SERVICE_DOM_ID)

    drag(SERVICE_DOM_ID, others_field)

    wait_for('__service-name__')
    click_suffix('btn-oui') # nom par défaut

    # Le clic ne fait que déclencher l'aller-retour ASYNCHRONE de lecture de
    # la sélection Finder (bridge -> backend -> getInfoFinderSelection.scpt) :
    # refermer la fenêtre trop tôt la fermerait avant la fin de cet
    # aller-retour, qui lirait alors une autre fenêtre Finder déjà ouverte.
    wait_for_suffix('btn-oui')
    with_finder_selection(file_path) do
      click_suffix('btn-oui')
      wait_for('__app__')
    end

    # → param 'app' : choisir "(par défaut)" dans la liste (valeur 'none')
    set_value('__app__', 'none')
    click_suffix('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| s['id'] == 'open-file' }
      next false unless found
      File.realpath(found['params'][0][0]) == File.realpath(file_path) && found['params'][1] == ['none']
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service 'Ouvrir le fichier…' : attribution avec le choix « par défaut » (aucune application précisée)") { run_test }
