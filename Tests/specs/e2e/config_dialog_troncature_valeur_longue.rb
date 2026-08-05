# Test : ConfigDialog#onShow — une valeur de type 'path'/'url' trop longue
# pour tenir dans sa colonne est raccourcie caractère par caractère jusqu'à
# tenir, puis préfixée d'une ellipse "…" (frontend/js/Dialogs.js:315-333).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section B point 8).
#
# Dialogue construit directement en JS (bridge_eval) avec une valeur assez
# longue pour déborder de la colonne (span.config-data-value, largeur fixe
# 340px en CSS, cf. frontend/css/dialogs.css) de façon déterministe, plutôt
# que de dépendre de la longueur — variable selon la machine — d'un vrai
# chemin de projet fixture.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var longValue  = '/a/very/long/path/that/should/definitely/overflow/the/dialog/column/width/for/sure/1234567890';
      var shortValue = 'short.txt';
      var d = new ConfigDialog({
        id: 'test-troncature',
        title: 'Test',
        props: [
            {id: 'longpath',  type: 'path', name: 'Long',  value: longValue}
          , {id: 'shortpath', type: 'path', name: 'Court', value: shortValue}
        ],
        ouiBtn: {name: 'OK', onclick: function(){}}
      });
      d.show();
      var elLong  = document.getElementById('test-troncature-longpath-value');
      var elShort = document.getElementById('test-troncature-shortpath-value');
      return JSON.stringify({
          longText: elLong.textContent
        , longOverflows: elLong.scrollWidth > elLong.clientWidth
        , shortText: elShort.textContent
      });
    })()
  JS
  data = JSON.parse(result)

  raise "valeur longue pas raccourcie (#{data['longText'].inspect})" unless data['longText'].length < 90
  raise "valeur longue pas préfixée d'une ellipse (#{data['longText'].inspect})" unless data['longText'].start_with?('…')
  raise "valeur longue encore en débordement après troncature (#{data['longText'].inspect})" if data['longOverflows']
  raise "valeur courte modifiée alors qu'elle ne déborde pas (#{data['shortText'].inspect})" unless data['shortText'] == 'short.txt'
end

board_test("ConfigDialog : troncature+ellipse d'une valeur path/url trop longue, valeur courte inchangée") { run_test }
