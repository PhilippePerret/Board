# Tests DateUtils._parseHour (frontend/js/DateUtils.js) : les formats
# d'heure supportés ("10:30", "10h30", "10 heures 30", "10h" sans minutes...)
# doivent renvoyer les vraies minutes, pas le séparateur (bug corrigé : la
# destructuration du résultat de la regex prenait le mauvais groupe capturé).
#
# hour/minute sont maintenant de vrais entiers (avant : strings issues du
# match regex) — donc '9h05' donne minute=5 (pas '05', plus de zéro
# décoratif) et le format sans minutes ("10h") est accepté (minute=0).

require_relative '../../support/helpers'
include BoardTest

CASES = {
  '10:30'         => '10:30',
  '10h30'         => '10:30',
  '10 h 30'       => '10:30',
  '10 heures 30'  => '10:30',
  '9h05'          => '9:5',
  '10h'           => '10:0',
}.freeze

def run_test
  launch_app

  CASES.each do |input, expected|
    result = bridge_eval(<<~JS)
      (function(){
        var r = DateUtils._parseHour(#{input.to_json});
        if (!r) return 'null';
        if (typeof r.hour != 'number' || typeof r.minute != 'number') return 'not-a-number';
        return r.hour + ':' + r.minute;
      })()
    JS
    raise "_parseHour(#{input.inspect}) : attendu #{expected.inspect}, obtenu #{result.inspect}" unless result == expected
  end
end

board_test("DateUtils._parseHour : formats ':'/'h'/'heures', avec ou sans minutes, hour/minute en entiers") { run_test }
