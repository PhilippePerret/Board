# Tests DateUtils._parseHour (frontend/js/DateUtils.js) : les formats
# d'heure supportés ("10:30", "10h30", "10 heures 30"...) doivent renvoyer
# les vraies minutes, pas le séparateur (bug corrigé : la destructuration
# du résultat de la regex prenait le mauvais groupe capturé).

require_relative '../../support/helpers'
include BoardTest

CASES = {
  '10:30'         => '10:30',
  '10h30'         => '10:30',
  '10 h 30'       => '10:30',
  '10 heures 30'  => '10:30',
  '9h05'          => '9:05',
}.freeze

def run_test
  launch_app

  CASES.each do |input, expected|
    result = bridge_eval(<<~JS)
      (function(){
        var r = DateUtils._parseHour(#{input.to_json});
        return r ? (r.hour + ':' + r.minute) : 'null';
      })()
    JS
    raise "_parseHour(#{input.inspect}) : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected
  end
end

board_test("DateUtils._parseHour : formats ':'/'h'/'heures' renvoient bien les minutes, pas le séparateur") { run_test }
