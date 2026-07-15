# Test : exécution réelle des services au démarrage via le bouton "GO !"
# (pas juste attachement/apparition/retrait, testés ailleurs), avec 3
# services différents, vérifiée deux fois : tout de suite après attachement,
# puis à nouveau après rechargement de l'app (Project.js#startStartupServices
# les exécute l'un après l'autre, dès que chacun est achevé — sans délai fixe
# entre eux).
#
# Demande explicite (2026-07-11) :
#   - attacher open-folder-project + open-finder-window (dossier quelconque,
#     pas celui du projet) + run-script (script simple, effet vérifiable)
#   - GO!
#   - fermer toutes les fenêtres Finder
#   - recharger l'app
#   - GO! à nouveau
#   (vérifier l'état à chaque fois, les deux fois)
#
# Attachement fait via fixtures (pas glisser-déposer réel — déjà testé dans
# attribution_service.rb/ajout_service_startup.rb, pas l'objet ici).
#
# Ce qui est vérifié pour chaque service, c'est son EFFET réel, pas un
# message affiché à l'écran (transitoire, plus de fenêtre de temps garantie
# depuis que les services s'enchaînent sans délai) :
#   - open-folder-project / open-finder-window -> fenêtre Finder ouverte
#   - run-script (backend/scripts/RunScript.rb) -> écrit un fichier
#     (create_fixture_run_script), on vérifie son contenu
# Seul le message final "Fin de démarrage" (stable, pas transitoire) est
# attendu à l'écran, comme confirmation de fin de traitement.

require_relative '../../support/helpers'

include BoardTest

MARKER_VALUE = 'valeur-de-test-run-script'

def check_finder_window_open_on(dir)
  expected = File.realpath(dir)
  targets = finder_snapshot_windows.lines.map { |l| l.split("\t").first }
  found = targets.any? { |t| (File.realpath(t) rescue nil) == expected }
  raise "aucune fenêtre Finder ouverte sur #{dir.inspect} (fenêtres : #{targets.inspect})" unless found
end

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    Dir.mktmpdir('board-test-otherfolder-') do |other_dir|
      Dir.mktmpdir('board-test-script-') do |script_dir|
        script_path = create_fixture_run_script(script_dir, MARKER_VALUE)
        output_path = fixture_run_script_output_path(script_path)

        service1 = fixture_open_folder_service(fixture_dir, name: 'Ouvrir projet', type: 'startup')
        service2 = fixture_open_finder_window_service(other_dir, name: 'Ouvrir dossier quelconque', type: 'startup')
        service3 = fixture_run_script_service(script_path, name: 'Jouer script', type: 'startup')

        id = create_fixture_project(
          title: 'Projet A', path: fixture_dir,
          services: { 'startup' => [service1, service2, service3], 'others' => [] }
        )
        launch_app

        btn_startup = "project-#{id}-btn-startup"
        wait_for("project-#{id}")
        wait_until(desc: -> { 'bouton GO! absent alors que 3 services au démarrage sont attachés' }) { exists?(btn_startup) }

        go_and_verify = lambda do
          File.delete(output_path) if File.exist?(output_path)
          click(btn_startup)

          # → confirmation de fin de traitement (message stable, pas transitoire)
          wait_until(10, desc: -> { "message = #{get_text('message').inspect}" }) do
            get_text('message').include?('Fin de démarrage')
          end

          # → open-folder-project et open-finder-window ont chacun ouvert
          #   leur propre fenêtre Finder (pas la même, dossiers différents)
          check_finder_window_open_on(fixture_dir)
          check_finder_window_open_on(other_dir)

          # → run-script a bien été exécuté (effet persistant, pas un message à l'écran)
          raise "#{output_path} pas créé par run-script" unless File.exist?(output_path)
          raise "#{output_path} contenu inattendu : #{File.read(output_path).inspect}" unless File.read(output_path) == MARKER_VALUE
        end

        go_and_verify.call

        # - fermer toutes les fenêtres Finder
        finder_close_all_windows

        # - recharger l'application
        launch_app
        wait_for("project-#{id}")
        wait_until(desc: -> { 'bouton GO! absent après rechargement' }) { exists?(btn_startup) }

        # - GO! à nouveau, mêmes vérifications
        go_and_verify.call
      end
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("exécution des services au démarrage (GO!, deux fois, avant/après rechargement)") { run_test }
