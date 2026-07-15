# Test : exécution réelle des services au démarrage via le bouton "GO !"
# (pas juste attachement/apparition/retrait, testés ailleurs), avec 3
# services différents, vérifiée deux fois : tout de suite après attachement,
# puis à nouveau après rechargement de l'app (Project.js#startStartupServices
# les exécute l'un après l'autre, dans l'ordre, avec 2s entre chaque).
#
# Demande explicite (2026-07-11) :
#   - attacher open-folder-project + open-finder-window (dossier quelconque,
#     pas celui du projet) + run-script (script simple, valeur testable)
#   - GO!
#   - fermer toutes les fenêtres Finder
#   - recharger l'app
#   - GO! à nouveau
#   (vérifier l'état à chaque fois, les deux fois)
#
# Attachement fait via fixtures (pas glisser-déposer réel — déjà testé dans
# attribution_service.rb/ajout_service_startup.rb, pas l'objet ici).
#
# run-script (backend/scripts/RunScript.rb) exécute réellement le script .rb
# donné et capture sa sortie comme "message" affiché — un simple "puts"
# suffit, rien n'est ouvert (ni Terminal, ni fichier à nettoyer). Le message
# est remplacé (pas accumulé) à chaque étape : run-script étant le DERNIER
# service de la liste (ordre confirmé par Project.js#startStartupServices),
# son message reste affiché ~2s avant d'être remplacé par "Fin de
# démarrage." — on le vérifie donc AVANT ce dernier message, pas après.

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
          click(btn_startup)

          # → run-script (dernier de la liste) a bien été exécuté et sa
          #   sortie capturée — à vérifier AVANT que "Fin de démarrage" ne
          #   remplace ce message
          wait_until(desc: -> { "message = #{get_text('message').inspect}" }) do
            get_text('message').include?(MARKER_VALUE)
          end

          # → les 3 services doivent s'exécuter jusqu'au bout
          wait_until(desc: -> { "message = #{get_text('message').inspect}" }) do
            get_text('message').include?('Fin de démarrage')
          end

          # → open-folder-project et open-finder-window ont chacun ouvert
          #   leur propre fenêtre Finder (pas la même, dossiers différents)
          check_finder_window_open_on(fixture_dir)
          check_finder_window_open_on(other_dir)
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
