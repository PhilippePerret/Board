# Test : retrait de services au démarrage par glissement hors de la carte
# projet, avec le cycle complet demandé (2026-07-11) :
#   - 2 services au démarrage → bouton GO! présent
#   - retrait d'un des deux → GO! toujours présent, un seul service restant
#   - retrait du second (dernier) → GO! disparaît
#
# Particularité par rapport à Tests/specs/e2e/retrait_service_glissement.rb
# (qui teste la même mécanique pour "Autres services") : les cartes des
# services au démarrage vivent dans un conteneur "display:none" tant qu'on ne
# survole pas (Project.js, classe "hidden" retirée par un mouseenter + 1s) —
# un élément display:none n'a AUCUNE représentation dans l'arbre
# d'accessibilité, donc il faut d'abord un vrai survol souris
# (BoardTest#hover, Tests/support/hover.js) avant de pouvoir cibler la carte
# par domId pour la glisser.
#
# AVERTISSEMENT : mécanique non vérifiée en conditions réelles — en
# particulier, le survol du conteneur se termine (mouseleave → classe
# "hidden" remise) PENDANT le trajet du glisser vers le titre du projet (hors
# du conteneur) ; possible que ça interrompe le drag HTML5 en cours si le
# navigateur réagit au display:none de l'élément survolé en plein glissement.
# À corriger si le test échoue pour cette raison précise.
#
# Setup : 2 services "open-folder-project" déjà attachés en "startup"
# (BoardTest#fixture_open_folder_service, type: 'startup') — le
# glisser-déposer D'ATTRIBUTION est testé ailleurs.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    service1 = fixture_open_folder_service(fixture_dir, name: 'Service 1', type: 'startup')
    service2 = fixture_open_folder_service(fixture_dir, name: 'Service 2', type: 'startup')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [service1, service2], 'others' => [] })
    launch_app

    card1 = "service-#{service1['uuid']}"
    card2 = "service-#{service2['uuid']}"
    btn_startup = "project-#{id}-btn-startup"
    startup_container = "project-#{id}-startup-container"
    title_target = "project-#{id}-title"

    wait_for("project-#{id}")

    # → le bouton GO! doit exister (2 services au démarrage dès le chargement)
    wait_until(desc: -> { 'bouton GO! absent alors que 2 services au démarrage sont attachés' }) { exists?(btn_startup) }

    # - survoler pour révéler les cartes (display:none tant qu'on ne survole pas)
    hover(startup_container)
    wait_until(desc: -> { 'carte du 1er service startup jamais révélée après survol' }) { exists?(card1) }

    # - glisser le 1er service en dehors de la carte projet
    drag(card1, title_target)

    # → ce service a disparu, mais le bouton GO! doit toujours exister (il en reste un)
    wait_until(desc: -> { 'carte du 1er service startup encore présente après glissement hors carte' }) { !exists?(card1) }
    wait_until(desc: -> { "bouton GO! disparu alors qu'il reste un service au démarrage" }) { exists?(btn_startup) }
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      startup = read_project_card(id)['services']['startup']
      startup.is_a?(Array) && startup.size == 1 && startup.first['uuid'] == service2['uuid']
    end

    # - re-survoler (le conteneur a pu se re-masquer après le mouseleave du
    #   glissement précédent)
    hover(startup_container)
    wait_until(desc: -> { '2e carte de service startup jamais révélée après nouveau survol' }) { exists?(card2) }

    # - glisser le 2e (dernier) service en dehors de la carte projet
    drag(card2, title_target)

    # → plus aucun service au démarrage : le bouton GO! doit avoir disparu
    wait_until(desc: -> { 'carte du 2e service startup encore présente après glissement hors carte' }) { !exists?(card2) }
    wait_until(desc: -> { 'bouton GO! encore présent alors que plus aucun service au démarrage' }) { !exists?(btn_startup) }
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      startup = read_project_card(id)['services']['startup']
      startup.nil? || startup.empty?
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("retrait des services au démarrage (GO! disparaît quand il n'en reste plus)") { run_test }
