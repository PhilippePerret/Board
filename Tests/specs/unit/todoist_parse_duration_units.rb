require_relative '../../support/todoist_stub'
include BoardTest

CASES = {
  '3 jours'    => [3, 'day'],
  '1 jour'     => [1, 'day'],
  '45 minutes' => [45, 'minute'],
  '1 minute'   => [1, 'minute'],
  '10 mn'      => [10, 'minute'],
  '4 heures'   => [240, 'minute'],
  '1 heure'    => [60, 'minute'],
  '2 semaines' => [14, 'day'],
  '1 mois'     => [31, 'day'],
}.freeze

def run_test
  CASES.each do |str, expected|
    result = Todoist._parse_duration(str, 'fr')
    raise "#{str.inspect} : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected
  end
end

board_test("Todoist._parse_duration : toutes les unités valides (jour/minute/heure/semaine/mois)") { run_test }
