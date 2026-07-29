# Tests DateUtils#add (via DateUtils.dateIn) : chaque unité déplace le bon
# champ. Couvre en particulier 'hour', absent du switch avant correction
# (silencieusement ignoré).

require_relative '../../support/helpers'
include BoardTest

# unit => [champ Date à décaler dans le JS généré, multiplicateur]
UNIT_FIELD = {
  'year'   => ['y',  1],
  'month'  => ['mo', 1],
  'day'    => ['d',  1],
  'week'   => ['d',  7],
  'hour'   => ['h',  1],
  'minute' => ['mi', 1],
  'second' => ['s',  1],
}.freeze
AMOUNT = 3

def run_test
  launch_app

  UNIT_FIELD.each do |unit, (field, mult)|
    ok = bridge_eval(<<~JS)
      (function(){
        var before = new Date();
        var after = DateUtils.dateIn(#{AMOUNT}, '#{unit}');
        var y = before.getFullYear(), mo = before.getMonth(), d = before.getDate(),
            h = before.getHours(), mi = before.getMinutes(), s = before.getSeconds();
        #{field} += #{AMOUNT * mult};
        var expected = new Date(y, mo, d, h, mi, s);
        return (Math.abs(after.getTime() - expected.getTime()) < 5000).toString();
      })()
    JS
    raise "dateIn(#{AMOUNT}, '#{unit}') : décalage incorrect (obtenu #{ok.inspect})" unless ok == 'true'
  end
end

board_test("DateUtils.dateIn : toutes les unités décalent le bon champ (year/month/day/week/hour/minute/second)") { run_test }
