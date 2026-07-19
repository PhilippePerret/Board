# Test : attribution du service custom "open-file" (Ouvrir le fichier…,
# frontend/js/ServiceData.js) — choix d'un logiciel PARMI LA LISTE lue dans
# /Applications (type 'logiciel', ParamDefiner.js#onLogiciel).
# Source : demande explicite (2026-07-19).
#
# Déroulé du clic "common-services-panel-toggle" avant le drag : même
# mécanisme que BoardTest#attach_service_to_project (helpers_base.rb),
# réutilisable ici seulement en partie (params différents : 'path' simple,
# pas 'finder-window').

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
    click('btn-oui') # nom par défaut

    # → param 'path' : sélection réelle dans le Finder
    wait_for('btn-oui')
    with_finder_selection(file_path) do
      click('btn-oui')
    end

    # → param 'app' (type 'logiciel') : choix dans la liste (Safari est
    #   dans /Applications sur toute machine — Finder, lui, n'y est PAS :
    #   /System/Library/CoreServices/Finder.app, hors du périmètre scanné
    #   par l'action backend 'list-applications')
    wait_for('__app__')
    set_value('__app__', 'Safari')
    click('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| s['id'] == 'open-file' }
      next false unless found
      File.realpath(found['params'][0][0]) == File.realpath(file_path) && found['params'][1] == ['Safari']
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service 'Ouvrir le fichier…' : attribution avec un logiciel choisi dans la liste") { run_test }
