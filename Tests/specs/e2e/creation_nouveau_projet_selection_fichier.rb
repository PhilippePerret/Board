# Test : création d'un nouveau projet, SÉLECTION FINDER = un fichier (pas un dossier)
# Source : Tests/_tests_a_faire.adoc
#
# Setup : dossier support inexistant (garanti par Tests/run_tests.sh, qui
# déplace ~/Library/Application Support/Board avant de lancer les specs).

require_relative '../../support/helpers'
require 'tempfile'

include BoardTest

def run_test
  expected_error = loc_error('folder-required')
  fixture_file = Tempfile.new('board-test-file-')
  fixture_path = fixture_file.path

  # - Click sur le bouton "add project"
  click('btn-add-project')

  # → Une fenêtre s'ouvre, demandant de choisir le dossier dans le Finder
  wait_for('btn-oui')

  # - la sélection Finder est un fichier (pas un dossier)
  with_finder_selection(fixture_path) do
    # - on click sur le bouton "OK"
    click('btn-oui')

    # ==| Erreur : la sélection doit être un dossier
    wait_until(5, desc: -> { "message affiché : #{get_text('message').inspect}" }) { get_text('message').include?(expected_error) }
  end
ensure
  fixture_file&.close
  fixture_file&.unlink
end

board_test("création d'un nouveau projet, sélection Finder = un fichier") { run_test }
