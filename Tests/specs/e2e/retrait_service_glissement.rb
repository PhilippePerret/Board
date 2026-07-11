# Test : retrait d'un service en le glissant EN DEHORS de la carte du projet
# Source : demande explicite (2026-07-11), en complément de
# Tests/_tests_a_faire.adoc "Ajout d'un service au startup"
#
# Mécanisme (frontend/js/Services.js, observeServiceCard) : "dragend" sur la
# carte du service appelle projet.removeServiceFromListe() SEULEMENT si
# e.dataTransfer.dropEffect == "none" — c'est-à-dire seulement si le drop
# n'a atterri sur AUCUNE zone avec un handler "drop" (othersField/
# startupField). On glisse donc vers le titre du projet
# (`project-#{id}-title`), qui n'a aucun listener drag/drop — dropEffect
# reste "none" par défaut du navigateur.
#
# Setup : service "open-folder-project" déjà attaché (BoardTest#
# fixture_open_folder_service), comme execution_double_service.rb — le
# glisser-déposer D'ATTRIBUTION est testé ailleurs (attribution_service.rb),
# pas l'objet de ce test.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-service-') do |fixture_dir|
    service = fixture_open_folder_service(fixture_dir)
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    service_card = "service-#{service['uuid']}"
    title_target = "project-#{id}-title"

    wait_for("project-#{id}")
    wait_for(service_card)

    drag(service_card, title_target)

    # → la carte du service doit disparaître du DOM tout de suite
    wait_until(5, desc: -> { 'carte du service encore présente après glissement hors de la carte projet' }) { !exists?(service_card) }

    # → et le service doit avoir disparu des données persistées
    wait_until(5, desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      others = read_project_card(id)['services']['others']
      !(others.is_a?(Array) && others.any? { |s| s['uuid'] == service['uuid'] })
    end

    # - recharger l'application
    launch_app

    # → toujours absent après rechargement
    wait_for("project-#{id}")
    raise 'carte du service réapparue après rechargement' if exists?(service_card)
  end
ensure
  remove_fixture_project(id) if id
end

board_test("retrait d'un service par glissement hors de la carte projet") { run_test }
