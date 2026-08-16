# Test : bouton Debug du header (#debug-button -> D.toggle(), App.js:91) —
# ouvre/ferme le panneau #debug-panel (Debug.js).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section E point 19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  raise 'debug-panel visible avant tout clic sur le bouton Debug' if visible?('debug-panel')

  wait_for('debug-button')
  click('debug-button')
  wait_until(5, desc: -> { 'debug-panel pas apparu après clic' }) { visible?('debug-panel') }

  click('debug-button')
  wait_until(5, desc: -> { 'debug-panel encore visible après un 2e clic' }) { !visible?('debug-panel') }
end

board_test("bouton Debug : ouvre/ferme le panneau de logs") { run_test }
