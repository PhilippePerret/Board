# Test : service commun "file-create" (backend/scripts/FileCreate.rb) —
# validIf async sur file_path (ParamDefiner.js) rejette un chemin déjà
# existant, réaffiche le dialogue AVEC le message 'file-already-exists-at'
# et la valeur tapée reprise en défaut (pas de retype complet). Une
# correction valide continue ensuite normalement.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'file-create'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    existing_relative = 'deja-la.txt'
    File.write(File.join(fixture_dir, existing_relative), 'contenu préexistant')

    new_relative = 'nouveau.txt'
    content = 'contenu du nouveau fichier'
    full_path = File.join(fixture_dir, new_relative)

    card = "project-#{id}"
    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    wait_for('__file_path__')
    set_value('__file_path__', existing_relative)
    click_suffix('btn-oui')

    wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
      (dialog_error_text rescue '') =~ /existe déjà/i
    end
    raise "le champ file_path devrait être encore là après un chemin existant" unless exists?('__file_path__')
    raise "la valeur tapée devrait être reprise en défaut" unless get_value('__file_path__') == existing_relative

    set_value('__file_path__', new_relative)
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

board_test("service commun 'créer un fichier' : chemin déjà existant rejeté, valeur reprise, correction acceptée") { run_test }
