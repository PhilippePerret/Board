# Test : bouton de fermeture de l'horloge (croix, id 'clock-close') —
# frontend/js/Clock.js, listeners mousedown/mouseup sur la MÊME cible
# (this._closeClickedTarget) pour n'appeler close() que sur un clic net,
# pas un glissé relâché par erreur sur la croix.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section D point 15). service_commun_horloge.rb couvre déjà la fermeture
# via re-clic sur le bouton de service, pas via cette croix dédiée.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'work-clock'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    wait_for('__session-duration__', 10)
    set_value('__session-duration__', '20')
    click_suffix('btn-oui')
    wait_for('__work-duration__', 10)
    click_suffix('btn-oui')

    wait_for('clock-dial', 10)
    wait_for('clock-close', 5)

    click('clock-close')
    wait_until(5, desc: -> { "clock-dial encore visible après clic sur la croix" }) { !visible?('clock-dial') }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("horloge : le bouton de fermeture (croix) referme le panneau") { run_test }
