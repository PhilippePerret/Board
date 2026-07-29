# Tests DateUtils.parseAsIso8601 (frontend/js/DateUtils.js) : conversion
# UTC (suffixe Z) vs heure locale (sans Z), et cas invalide → null.
# Via bridge_eval (moteur "pont") : DateUtils est une classe frontend pure,
# pas de pendant Ruby à requérir directement.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  utc_ok = bridge_eval(<<~JS)
    (function(){
      var d = DateUtils.parseAsIso8601('2026-07-29T09:15:30Z');
      var expected = Date.UTC(2026, 6, 29, 9, 15, 30);
      return (d.getTime() === expected).toString();
    })()
  JS
  raise "parseAsIso8601 avec 'Z' : conversion UTC incorrecte (obtenu #{utc_ok.inspect})" unless utc_ok == 'true'

  local_ok = bridge_eval(<<~JS)
    (function(){
      var d = DateUtils.parseAsIso8601('2026-07-29T09:15:30');
      var expected = new Date(2026, 6, 29, 9, 15, 30).getTime();
      return (d.getTime() === expected).toString();
    })()
  JS
  raise "parseAsIso8601 sans 'Z' : interprétation locale incorrecte (obtenu #{local_ok.inspect})" unless local_ok == 'true'

  invalid_ok = bridge_eval("(DateUtils.parseAsIso8601('pas une date') === null).toString()")
  raise "parseAsIso8601 sur chaîne invalide : null attendu (obtenu #{invalid_ok.inspect})" unless invalid_ok == 'true'
end

board_test("DateUtils.parseAsIso8601 : UTC ('Z'), heure locale (sans 'Z'), et chaîne invalide") { run_test }
