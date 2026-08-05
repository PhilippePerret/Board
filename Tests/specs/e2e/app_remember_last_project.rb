# Test : "Se souvenir du dernier projet" (App.js, réglage appdata
# 'remember-last-project') — quand actif, sélectionner un projet enregistre
# son id dans appdata['last-project'] (App#rememberLastProjectIfRequired,
# appelé par Project.js:212), et le prochain lancement de l'app le
# re-sélectionne automatiquement (App#selectLastProjectIfRequired, appelé
# juste après le chargement de tous les projets, Project.js:26).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section E point 18).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id_a = nil
  id_b = nil
  original = read_app_data.slice('remember-last-project', 'last-project')
  Dir.mktmpdir('board-test-project-a-') do |dir_a|
    Dir.mktmpdir('board-test-project-b-') do |dir_b|
      id_a = create_fixture_project(title: 'Projet A', path: dir_a)
      id_b = create_fixture_project(title: 'Projet B', path: dir_b)

      app_data = read_app_data
      app_data['remember-last-project'] = true
      write_app_data(app_data)

      launch_app

      card_a = "project-#{id_a}"
      card_b = "project-#{id_b}"
      wait_for(card_a)
      wait_for(card_b)

      click(card_b)
      wait_until(5, desc: -> { "appdata['last-project'] = #{read_app_data['last-project'].inspect}" }) do
        read_app_data['last-project'] == id_b
      end

      # → rechargement complet : Projet B doit être re-sélectionné tout seul
      launch_app
      wait_for(card_a)
      wait_for(card_b)
      wait_until(5, desc: -> { "#current-project-mark = #{(get_text('current-project-mark') rescue '(erreur)').inspect}" }) do
        (get_text('current-project-mark') rescue '') == 'Projet B'
      end
    end
  end
ensure
  app_data = read_app_data
  app_data.delete('remember-last-project')
  app_data.delete('last-project')
  app_data.merge!(original) if original
  write_app_data(app_data)
  remove_fixture_project(id_a) if id_a
  remove_fixture_project(id_b) if id_b
end

board_test("App : 'Se souvenir du dernier projet' re-sélectionne automatiquement au relancement") { run_test }
