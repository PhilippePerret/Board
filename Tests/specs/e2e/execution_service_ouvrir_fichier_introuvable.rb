# Test : service custom "open-file" (Ouvrir le fichier…, backend/scripts/
# OpenFile.sh) exécuté sur un chemin qui n'existe pas (ou plus) → message
# d'erreur clair, pas de plantage.
# Bug signalé : clic sur "Settings de l'application…" (projet Proximity,
# service pointant sur un fichier renommé entretemps) → crash
# "unexpected character: 'The' at line 1 column 1" (`open` écrit un message
# d'erreur en anglais sur stderr, `usefull.rb#run_script` fait
# `JSON.parse(res)` dessus sans vérifier que c'est du JSON).

require_relative '../../support/helpers'
require 'tmpdir'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    missing_path = File.join(fixture_dir, 'inexistant.txt')
    service = fixture_open_file_service(missing_path, 'TextEdit')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    wait_for("project-#{id}")
    service_card = "service-#{service['uuid']}"
    click(service_card)

    expected = "Le fichier #{missing_path} est introuvable. Merci d'éditer le service."
    wait_until(desc: -> { "message affiché = #{(get_text('message') rescue '(erreur)').inspect}" }) do
      get_text('message') == expected
    end
    raise "Board a quitté après clic sur un service 'open-file' pointant sur un fichier introuvable" unless board_running?
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service 'Ouvrir le fichier…' : fichier introuvable -> message d'erreur clair") { run_test }
