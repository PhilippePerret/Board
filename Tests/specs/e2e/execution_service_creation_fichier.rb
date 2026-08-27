# Test : exécution réelle du service commun "create-file" (Créer un
# fichier…, backend/scripts/FileCreate.rb).
# Contenu volontairement "complexe" (retours à la ligne, guillemets,
# apostrophe, $, backtick) : le script backend reçoit ses arguments via
# Open3.popen3(*argv), jamais réinterprétés par un shell — donc aucun
# échappement requis côté frontend, contrairement à ExecCommand.sh.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'create-file'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    relative_path = 'sous-dossier/fichier-test.txt'
    content = "Ligne 1\nLigne \"deux\" avec 'quotes', $HOME et `cmd`\nLigne 3"
    full_path = File.join(fixture_dir, relative_path)

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → panneau des services communs déjà ouvert à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dynParams dans l'ordre déclaré : file_path puis file_content
    wait_for('__file_path__')
    set_value('__file_path__', relative_path)
    click_suffix('btn-oui')

    wait_for('__file_content__')
    set_value('__file_content__', content)
    click_suffix('btn-oui')

    wait_until(desc: -> { "fichier #{full_path.inspect} absent ou contenu différent" }) do
      File.exist?(full_path) && File.read(full_path) == content
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'créer un fichier' : exécution réelle avec contenu complexe") { run_test }
