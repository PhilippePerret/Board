# Test : déplacer un projet ACTIF ne doit jamais faire disparaître de
# 'projects-in' (appdata.yaml) les projets en STANDBY.
# Source : demande explicite (2026-07-31) — perte réelle constatée en live
# (appdata.yaml de Phil réduit de 6 à 2 ids après un déplacement).
#
# Cause suspectée : Project.getProjectsOrder() lit uniquement
# #project-cards-container (Project.js#container), qui ne contient QUE les
# projets actifs — les projets en standby (#standby-project-container) ne
# sont jamais recensés, donc écrasés hors de 'projects-in' au prochain
# déplacement d'un projet actif (App.updateData('projects-in')).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id_actif_a = create_fixture_project(title: 'Actif A')
  id_actif_b = create_fixture_project(title: 'Actif B')
  id_standby = create_fixture_project(title: 'En standby', collapsed: true)
  launch_app

  card_a = "project-#{id_actif_a}"
  card_b = "project-#{id_actif_b}"

  ids_avant = read_app_data['projects-in']
  raise "setup : le standby n'est pas dans projects-in au départ (#{ids_avant.inspect})" unless
    ids_avant.include?(id_standby)

  # - sélectionner un projet actif et le déplacer (à droite)
  wait_for(card_a)
  click(card_a)
  wait_until(desc: -> { 'btn-move-project-to-right pas apparu après sélection' }) { exists?('btn-move-project-to-right') }
  click('btn-move-project-to-right')

  # - attendre le débounce de sauvegarde
  sleep 1

  ids_apres = read_app_data['projects-in']
  raise "le projet en standby a disparu de projects-in après déplacement d'un projet actif (avant : #{ids_avant.inspect}, après : #{ids_apres.inspect})" unless
    ids_apres.include?(id_standby)
  raise "des projets ont disparu de projects-in après déplacement (avant : #{ids_avant.inspect}, après : #{ids_apres.inspect})" unless
    (ids_avant - ids_apres).empty?

  # Tue/relance Board avant le nettoyage : sans ça, le saveData debounced
  # (1s) peut retomber APRÈS remove_fixture_project (suppression directe des
  # fichiers côté Ruby) et réécrire appdata.yaml avec une référence à un
  # projet déjà supprimé — cassant tous les tests suivants du même run.
  launch_app
ensure
  [id_actif_a, id_actif_b, id_standby].each { |id| remove_fixture_project(id) if id }
end

board_test("déplacement d'un projet actif : conserve les projets en standby dans projects-in") { run_test }
