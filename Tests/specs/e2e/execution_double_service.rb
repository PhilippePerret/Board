# Test : exécuter un service déjà attaché deux fois de suite (dossier fermé
# entre les deux clics)
# Source : Tests/_tests_a_faire.adoc, "[BUG] On peut cliquer deux fois sur
# le même service" (nom du test sans le "[BUG]", par convention du fichier)
#
# Ce test documente un bug connu (pas encore corrigé au moment de l'écriture
# de ce test) : le service fonctionne au premier clic, mais pas au second,
# même en refermant le dossier entre les deux — ce test doit donc échouer
# tant que le bug n'est pas corrigé, et confirmer la correction une fois
# fait.
#
# Setup : projet fixture avec le service "open-folder-project" DÉJÀ
# attaché (BoardTest#fixture_open_folder_service) — l'attribution elle-même
# est testée séparément (Tests/specs/e2e/attribution_service.rb), pas
# l'objet de ce test.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  dir = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    dir = fixture_dir
    service = fixture_open_folder_service(fixture_dir)
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    wait_for("project-#{id}")
    service_card = "service-#{service['uuid']}"

    # - premier clic → le dossier s'ouvre
    click(service_card)
    sleep 0.5
    err1 = (errors_dialog_text rescue nil)
    raise "[DIAG] ErrorsDialog ouverte après le 1er clic : #{err1}" if err1 && !err1.empty?
    expected_name1 = File.basename(fixture_dir)
    t0 = Time.now
    wait_until(5, desc: -> { "[DIAG #{(Time.now - t0).round(1)}s] nom fenêtre Finder = #{finder_front_window_name.inspect} (attendu #{expected_name1.inspect})" }) do
      finder_front_window_name == expected_name1
    end

    # - on referme le dossier
    close_folder_and_wait(fixture_dir)

    # - attendre 2 secondes
    sleep 2

    # - second clic → le dossier doit se rouvrir
    click(service_card)
    sleep 0.5
    err = (errors_dialog_text rescue nil)
    raise "[DIAG] ErrorsDialog ouverte après le 2e clic : #{err}" if err && !err.empty?
    expected_name = File.basename(fixture_dir)
    wait_until(3, desc: -> { "nom de la fenêtre Finder au premier plan = #{finder_front_window_name.inspect} (attendu #{expected_name.inspect})" }) do
      finder_front_window_name == expected_name
    end
  end
ensure
  (finder_close_front_window_if_named(File.basename(dir)) rescue nil) if dir
  remove_fixture_project(id) if id
end

board_test('exécuter un service attaché deux fois de suite (dossier fermé entre les deux)') { run_test }
