# Test : touche Escape sur un dialogue équivaut à cliquer "Non" (Dialog.js,
# HANDLED_KEYS: {Escape: {nokey: 'onNon'}}) — appelle nonBtn.onclick et
# referme le dialogue, comme Enter appelle onOui (cf.
# dialog_enter_appelle_onclick_une_fois.rb, même mécanique côté "Oui").
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section B point 7).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      window.__testNonCount = 0;
      var d = new ConfirmDialog({
        title: 'Test',
        message: 'Test',
        nonBtn: { name: 'Non', onclick: function(){ window.__testNonCount++; } }
      });
      d.show();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return JSON.stringify({ count: window.__testNonCount, stillInDom: document.body.contains(d.obj) });
    })()
  JS
  data = JSON.parse(result)

  raise "onclick de 'Non' attendu 1 appel après un seul Escape, obtenu #{data['count']}" unless data['count'] == 1
  raise 'le dialogue devrait avoir été retiré du DOM après Escape' if data['stillInDom']
end

board_test("Dialog : Escape appelle onNon (ferme le dialogue, comme un clic sur Non)") { run_test }
