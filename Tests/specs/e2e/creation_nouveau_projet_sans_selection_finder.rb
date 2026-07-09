# Test : création d'un nouveau projet SANS SÉLECTION FINDER
# Source : Tests/_tests_a_faire.adoc
#
# Setup : dossier support inexistant (garanti par Tests/run_tests.sh, qui
# déplace ~/Library/Application Support/Board avant de lancer les specs).

require_relative '../../support/helpers'

include BoardTest

def run_test
  expected_error = loc_error('project-folder-not-selected')
  finder_deselect

  # - Click sur le bouton "add project"
  click('btn-add-project')

  # → Une fenêtre s'ouvre, demandant de choisir le dossier dans le Finder
  wait_for('btn-oui')

  # - on click sur le bouton "OK" (sans sélection Finder)
  click('btn-oui')

  # ==| Erreur : aucune sélection finder
  wait_until(5) { get_text('message').include?(expected_error) }
rescue RuntimeError => e
  raise "#{e.message} — message affiché : #{get_text('message').inspect}" if e.message.start_with?('Timeout')
  raise
end

board_test("création d'un nouveau projet SANS SÉLECTION FINDER") { run_test }
