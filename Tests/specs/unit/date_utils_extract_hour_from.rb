# Tests DateUtils.extractHourFrom (frontend/js/DateUtils.js) : extraction
# de l'heure depuis une chaîne ISO 8601, depuis une chaîne "date à heure",
# et null quand la chaîne ne définit pas d'heure.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  iso = bridge_eval(<<~JS)
    (function(){
      var r = DateUtils.extractHourFrom('2026-07-29T09:15:00');
      return r.hour + ':' + r.minute;
    })()
  JS
  raise "extractHourFrom (ISO) : attendu '9:15', obtenu #{iso.inspect}" unless iso == '9:15'

  at_format = bridge_eval(<<~JS)
    (function(){
      var r = DateUtils.extractHourFrom('29/07/2026 à 9h05');
      return r.hour + ':' + r.minute;
    })()
  JS
  raise "extractHourFrom (format 'à') : attendu '9:05', obtenu #{at_format.inspect}" unless at_format == '9:05'

  no_hour = bridge_eval("(DateUtils.extractHourFrom('29/07/2026') === null).toString()")
  raise "extractHourFrom (sans heure) : null attendu, obtenu #{no_hour.inspect}" unless no_hour == 'true'
end

board_test("DateUtils.extractHourFrom : ISO 8601, format 'à', et chaîne sans heure") { run_test }
