# Test : Reminder#dataNotifierByType('warning') (Reminder.js) — couleurs
# correctes. La notification réelle est une fenêtre native séparée (pas
# dans le DOM de la WKWebView principale, cf. Notifier.js#notify ->
# window.server.send) : on vérifie les DONNÉES construites, pas le rendu
# (inaccessible au pont de test).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var r = new Reminder({ time: new Date(Date.now() + 60000), message: 'test warning' });
      var data = r.dataNotifierByType('warning');
      return JSON.stringify({ background: data.background, font_color: data.font_color });
    })()
  JS
  data = JSON.parse(result)

  raise "background 'warning' attendu #ffc400, obtenu #{data['background'].inspect}" unless data['background'] == '#ffc400'
  raise "font_color 'warning' attendu black, obtenu #{data['font_color'].inspect}" unless data['font_color'] == 'black'
end

board_test("Reminder#dataNotifierByType('warning') : couleurs correctes") { run_test }
