# Test : attribution d'un service à un projet (glisser-déposer)
# Source : Tests/_tests_a_faire.adoc, "test d'attribution d'un service"
# (description du .adoc simplifiée — le vrai déroulé, avec ses 3 boîtes de
# dialogue après le drop, est documenté et implémenté dans
# BoardTest#attach_service_to_project, Tests/support/helpers_base.rb —
# réutilisé aussi par Tests/specs/e2e/execution_double_service.rb)
#
# Setup : fixture avec un projet, sur un DOSSIER RÉEL (nécessaire : l'étape
# "fenêtre Finder" du déroulé lit la fenêtre Finder au premier plan).
#
# Le drop cible du drag-and-drop (fieldset "Autres services") n'avait pas de
# domId propre — ajouté pour ce test : frontend/js/Project.js,
# `this.othersField = DCreate('FIELDSET', {id: `${divId}-others-field`, ...})`.
#
# Le drag-and-drop lui-même est du HTML5 natif (dataTransfer +
# dragstart/dragover/drop) : un simple click() (AXPress) ne suffit pas, il
# faut un vrai geste souris (Tests/support/drag.js, CoreGraphics/CGEvent).

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'open-finder-window'
CUSTOM_NAME = 'Ouvrir projet A'

def run_test
  id = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"

    attach_service_to_project(SERVICE_ID, id, fixture_dir, custom_name: CUSTOM_NAME)

    # → le badge du service doit s'afficher
    wait_until(5, desc: -> { "texte affiché = #{get_text(others_field).inspect}" }) do
      get_text(others_field).include?(CUSTOM_NAME)
    end

    # - recharger l'application
    launch_app

    # → le badge doit toujours s'afficher après rechargement
    wait_for(card)
    wait_until(5, desc: -> { "texte affiché après rechargement = #{get_text(others_field).inspect}" }) do
      get_text(others_field).include?(CUSTOM_NAME)
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("attribution d'un service à un projet") { run_test }
