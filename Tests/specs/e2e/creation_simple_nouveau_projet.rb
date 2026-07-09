# Test : création simple d'un nouveau projet
# Source : Tests/_tests_a_faire.adoc
#
# Setup : dossier support inexistant (garanti par Tests/run_tests.sh, qui
# déplace ~/Library/Application Support/Board avant de lancer les specs).

require_relative '../../support/helpers'

include BoardTest

def run_test
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    # - Click sur le bouton "add project"
    click('btn-add-project')

    # → Une fenêtre s'ouvre, demandant de choisir le dossier dans le Finder
    wait_for('btn-oui')

    # - on choisit un dossier dans le Finder
    finder_select(fixture_dir)

    # - on click sur le bouton "OK"
    click('btn-oui')

    # → Une fenêtre s'ouvre, pour entrer le titre à donner au projet
    wait_for_prefix('__panel-')

    # - on écrit "Tout premier projet"
    set_value_prefix('__panel-', 'Tout premier projet')

    # - on clique sur le bouton "Appliquer"
    click('btn-oui')

    # → confirmation de l'import
    wait_for('btn-oui')

    # - on confirme l'import en cliquant sur "Importer"
    click('btn-oui')

    # Vérification : une carte projet a été écrite sur disque
    sleep 0.5
    cards = Dir[File.join(BoardTest::PROJECT_CARD_FOLDER, '*')]
    raise "Aucune carte projet créée dans #{BoardTest::PROJECT_CARD_FOLDER}" if cards.empty?
    raise "Plusieurs cartes projet trouvées : #{cards.inspect}" if cards.size > 1

    data = YAML.safe_load(File.read(cards.first))
    unless data['title'] == 'Tout premier projet'
      raise "Titre attendu 'Tout premier projet', trouvé #{data['title'].inspect}"
    end
    unless File.realpath(data['path']) == File.realpath(fixture_dir)
      raise "Path attendu #{fixture_dir.inspect}, trouvé #{data['path'].inspect}"
    end
  end
end

board_test("création simple d'un nouveau projet") { run_test }
