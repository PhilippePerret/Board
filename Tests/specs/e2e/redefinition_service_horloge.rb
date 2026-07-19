# Test : redéfinition d'un service "work-clock" (attaché, pas depuis le
# panneau) — couvre le type 'integer', y compris son interaction avec
# useLastAsDefault (work-duration reprend la valeur de session-duration
# tout juste saisie, pas sa propre valeur actuelle — comportement déjà en
# place avant ce chantier, pas une régression à vérifier ici).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef6"
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'work-clock', 'uuid' => uuid, 'type' => 'others',
      'name' => 'Nom initial', 'params' => [[90], [30]], 'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    wait_for('__service-name__')
    click('btn-oui') # nom inchangé

    # → session-duration : valeur actuelle préremplie
    wait_for('__session-duration__')
    raise "session-duration pas préremplie = #{get_value('__session-duration__').inspect}" unless get_value('__session-duration__') == '90'
    set_value('__session-duration__', '100')
    click('btn-oui')

    # → work-duration : useLastAsDefault reprend la valeur tout juste saisie (100)
    wait_for('__work-duration__')
    raise "work-duration ne reprend pas la valeur juste saisie = #{get_value('__work-duration__').inspect}" unless get_value('__work-duration__') == '100'
    click('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && found['params'].flatten == [100, 100]
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'work-clock' : integer préremplis (session-duration + useLastAsDefault)") { run_test }
