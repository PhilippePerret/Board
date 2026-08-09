# Test : réordonnement de services au sein d'une même carte projet par
# glisser réel (mousedown/move/up CoreGraphics, cf. drag.js) — pas le
# glisser d'ATTRIBUTION depuis le panneau (attribution_service.rb), ni le
# glisser de RETRAIT hors de la carte (retrait_service_glissement.rb).
#
# Mécanisme : Service.js#observeServiceCard (dragover déplace le nœud DOM
# du service glissé en direct, avant même le drop) + Project.js#
# persistServiceOrder (appelée au dragend, resynchronise
# projet.services[where] sur l'ordre DOM final).
#
# 3 services A, B, C (dans cet ordre) dans "others" — on glisse A vers C :
# le chemin du glissé réel passe forcément par-dessus B (services empilés
# verticalement), donc A doit se retrouver après B dans l'ordre final,
# quel que soit le point exact d'atterrissage sur C (avant ou après).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-reorder-') do |fixture_dir|
    service_a = fixture_open_folder_service(fixture_dir, name: 'Service A')
    service_b = fixture_open_folder_service(fixture_dir, name: 'Service B')
    service_c = fixture_open_folder_service(fixture_dir, name: 'Service C')
    id = create_fixture_project(
      title: 'Projet réorder', path: fixture_dir,
      services: { 'startup' => [], 'others' => [service_a, service_b, service_c] }
    )
    launch_app

    card_a = "service-#{service_a['uuid']}"
    card_b = "service-#{service_b['uuid']}"
    card_c = "service-#{service_c['uuid']}"

    wait_for("project-#{id}")
    wait_for(card_a)
    wait_for(card_b)
    wait_for(card_c)

    # → ordre initial : A, B, C
    initial = read_project_card(id)['services']['others'].map { |s| s['uuid'] }
    raise "ordre initial inattendu : #{initial.inspect}" unless
      initial == [service_a['uuid'], service_b['uuid'], service_c['uuid']]

    drag(card_a, card_c)

    # → A doit maintenant se trouver APRÈS B (glissé réel passant par-dessus
    #   B avant d'atteindre C) — persisté (Project.js#persistServiceOrder)
    wait_until(desc: -> { "ordre others = #{(read_project_card(id)['services']['others'] || []).map { |s| s['uuid'] }.inspect}" }) do
      order = (read_project_card(id)['services']['others'] || []).map { |s| s['uuid'] }
      order.length == 3 && order.index(service_a['uuid']) && order.index(service_b['uuid']) &&
        order.index(service_a['uuid']) > order.index(service_b['uuid'])
    end

    # → aucune perte/duplication de service
    final_order = read_project_card(id)['services']['others'].map { |s| s['uuid'] }
    raise "services perdus ou dupliqués, obtenu #{final_order.inspect}" unless
      final_order.sort == initial.sort

    # → l'ordre DOM (après le drag, sans recharger) correspond à l'ordre persisté
    dom_order = bridge_eval(<<~JS).split(',')
      Array.from(document.getElementById(#{"project-#{id}-others-field".to_json}).querySelectorAll('.service'))
        .map(function(el){ return el.id.replace('service-', '') })
        .join(',')
    JS
    raise "ordre DOM (#{dom_order.inspect}) ne correspond pas à l'ordre persisté (#{final_order.inspect})" unless
      dom_order == final_order
  end
ensure
  remove_fixture_project(id) if id
end

board_test("réordonnement de services par glissé réel au sein d'une même carte projet") { run_test }
