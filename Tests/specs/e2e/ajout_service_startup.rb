# Test : ajout d'un service "au démarrage" (fieldset "Services au démarrage",
# pas "Autres services")
# Source : Tests/_tests_a_faire.adoc, "Ajout d'un service au startup"
#
# Même déroulé que Tests/specs/e2e/attribution_service.rb (glisser-déposer
# réel + les 3 boîtes de dialogue), mais la cible du glisser est le fieldset
# "Services au démarrage" (BoardTest#attach_service_to_project, where:
# 'startup') — a nécessité l'ajout d'un domId sur ce fieldset
# (frontend/js/Project.js, `this.startupField = DCreate('FIELDSET', {id:
# `${divId}-startup-field`, ...})`), sur le même principe que celui déjà
# ajouté pour "Autres services".
#
# Exigence explicite (2026-07-11) : le bouton "GO !" doit apparaître DÈS
# L'AJOUT du tout premier service au démarrage — pas seulement après
# rechargement (c'était le cas avant : buildCard() ne le construisait que si
# des services au démarrage existaient déjà AU CHARGEMENT). Corrigé via
# Project#buildStartupContainer(), appelée aussi bien par buildCard() que par
# addService() lors d'un ajout en direct.
#
# Setup : fixture avec un projet, sur un DOSSIER RÉEL (nécessaire : l'étape
# "fenêtre Finder" du déroulé lit la fenêtre Finder au premier plan).

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'open-folder-project'
CUSTOM_NAME = 'Ouvrir au démarrage'

def run_test
  id = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    uuid = attach_service_to_project(SERVICE_ID, id, fixture_dir, custom_name: CUSTOM_NAME, where: 'startup')
    service_card = "service-#{uuid}"
    btn_startup = "project-#{id}-btn-startup"

    # → le bouton "GO !" doit apparaître TOUT DE SUITE (pas seulement après
    #   rechargement)
    wait_until(5, desc: -> { 'bouton GO! pas apparu tout de suite après le premier ajout' }) { exists?(btn_startup) }

    # → la carte du service doit exister dans le DOM (même masquée derrière
    #   le survol du bouton "GO !" — exists? teste la présence DOM, pas la
    #   visibilité)
    wait_until(5, desc: -> { 'carte du service startup pas trouvée dans le DOM' }) { exists?(service_card) }

    # - recharger l'application
    launch_app

    # → le service doit toujours être là après rechargement, à la fois dans
    #   les données ET dans le DOM
    wait_for("project-#{id}")
    data = read_project_card(id)
    startup = data['services']['startup']
    found = startup.is_a?(Array) && startup.find { |s| Array(s['name']).include?(CUSTOM_NAME) }
    raise "service startup absent de la carte projet après rechargement : #{data.inspect}" unless found
    wait_until(5, desc: -> { 'carte du service startup absente du DOM après rechargement' }) { exists?(service_card) }
    wait_until(5, desc: -> { 'bouton GO! absent après rechargement' }) { exists?(btn_startup) }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("ajout d'un service au démarrage") { run_test }
