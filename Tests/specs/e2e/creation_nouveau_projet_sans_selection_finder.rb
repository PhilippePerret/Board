# Test : création d'un nouveau projet SANS SÉLECTION FINDER
# Source : Tests/_tests_a_faire.adoc
#
# Setup : dossier support inexistant (garanti par Tests/run_tests.sh, qui
# déplace ~/Library/Application Support/Board avant de lancer les specs).

require_relative '../../support/helpers'

include BoardTest

def run_test
  expected_error = loc_error('project-folder-not-selected')

  launch_app

  with_finder_deselected do
    # - Click sur le bouton "add project"
    click('btn-add-project')

    # → Une fenêtre s'ouvre, demandant de choisir le dossier dans le Finder
    wait_for_suffix('btn-oui')

    # - on click sur le bouton "OK" (sans sélection Finder)
    click_suffix('btn-oui')

    # ==| Erreur : aucune sélection finder
    wait_until(desc: -> { "texte ErrorsDialog = #{(errors_dialog_text rescue '(erreur)').inspect}" }) { (errors_dialog_text rescue '').include?(expected_error) }
  end
end

board_test("création d'un nouveau projet SANS SÉLECTION FINDER") { run_test }
