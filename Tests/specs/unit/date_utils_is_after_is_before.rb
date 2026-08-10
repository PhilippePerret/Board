# Tests DateUtils.isAfter / DateUtils.isBefore (frontend/js/DateUtils.js) :
# les deux étaient cassées (pas de `return`, donc toujours `undefined`), et
# isBefore utilisait le même comparateur qu'isAfter (`>` au lieu de `<`).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  # DateUtils.isAfter(dateRef, dateAfter) : true si dateRef > dateAfter
  result = bridge_eval(<<~JS)
    (function(){
      var early = new Date(2026, 0, 1);
      var late  = new Date(2026, 0, 10);
      return JSON.stringify({
        after_true:  DateUtils.isAfter(late, early),
        after_false: DateUtils.isAfter(early, late),
        before_true: DateUtils.isBefore(early, late),
        before_false: DateUtils.isBefore(late, early),
      });
    })()
  JS
  data = JSON.parse(result)
  raise "isAfter(late, early) : attendu true, obtenu #{data['after_true'].inspect}" unless data['after_true'] == true
  raise "isAfter(early, late) : attendu false, obtenu #{data['after_false'].inspect}" unless data['after_false'] == false
  raise "isBefore(early, late) : attendu true, obtenu #{data['before_true'].inspect}" unless data['before_true'] == true
  raise "isBefore(late, early) : attendu false, obtenu #{data['before_false'].inspect}" unless data['before_false'] == false
end

board_test("DateUtils.isAfter / isBefore : comparaisons correctes dans les deux sens") { run_test }
