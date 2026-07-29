# Tests DateUtils.hasHour (frontend/js/DateUtils.js) : vrai pour une
# chaîne ISO 8601, vrai pour une chaîne "date à heure", faux pour une
# date seule (sans heure).

require_relative '../../support/helpers'
include BoardTest

CASES = {
  '2026-07-29T09:00:00Z'    => 'true',
  '29/07/2026 à 9h00'       => 'true',
  '29/07/2026'              => 'false',
}.freeze

def run_test
  launch_app

  CASES.each do |input, expected|
    result = bridge_eval("DateUtils.hasHour(#{input.to_json}).toString()")
    raise "hasHour(#{input.inspect}) : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected
  end
end

board_test("DateUtils.hasHour : ISO 8601, format 'à', et date seule") { run_test }
