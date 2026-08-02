# Test de régression : bug Dialog.js corrigé cette session (2026-08-02).
#
# show() enregistrait le listener 'keydown' sur window DEUX FOIS (une fois
# dans show(), une fois dans observe() appelée par build()), et hide() ne le
# retirait jamais (unlisten avec un .bind() différent de celui posé par
# listen -> removeEventListener ne matchait rien, les listeners
# s'accumulaient indéfiniment sur window). Un seul Enter sur un dialogue
# appelait donc onOui() — et son onclick — deux fois, et le dialogue restait
# techniquement lié à des listeners fantômes. Symptôme observé : le fond
# s'assombrissait au lieu de se fermer sur Enter (empilement de scrims via
# les listeners fantômes d'anciens dialogues rappelant leur callback).
#
# Fix : Dialog.js garde une seule référence bindée (this._boundOnKeyDown),
# posée une seule fois (observe()), retirée avec cette même référence.
#
# ConfirmDialog (pas OKDialog) : OKDialog écrase TOUJOURS this.ouiData après
# super(data) (Dialogs.js : `this.ouiData = {name:'OK', onclick: null}`,
# inconditionnel) — il ignore tout ouiBtn custom transmis. ConfirmDialog
# n'a aucun override, seul moyen de tester la mécanique Enter de la classe
# Dialog de base avec un onclick personnalisé.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      window.__testOuiCount = 0;
      var d = new ConfirmDialog({
        title: 'Test',
        message: 'Test',
        ouiBtn: { name: 'OK', onclick: function(){ window.__testOuiCount++; } }
      });
      d.show();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      return JSON.stringify({ count: window.__testOuiCount, stillInDom: document.body.contains(d.obj) });
    })()
  JS
  data = JSON.parse(result)

  raise "onclick attendu 1 appel après un seul Enter, obtenu #{data['count']}" unless data['count'] == 1
  raise 'le dialogue devrait avoir été retiré du DOM après Enter' if data['stillInDom']
end

board_test("Dialog : un seul Enter appelle onclick une seule fois et ferme le dialogue") { run_test }
