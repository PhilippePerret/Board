# Test : mécanisme générique :validIf (ParamDefiner#onPrompted) appliqué à
# un paramètre de type 'integer' — preuve qu'il fonctionne aussi sur une
# valeur CONVERTIE (toRealValue: parseInt), pas seulement sur une chaîne
# brute comme pour 'string'/'url'. Borne testée : 5 <= v <= 10.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  bridge_eval(<<~JS)
    window.__testResult = undefined;
    new ParamsDefiner(
      [{id: 'test_int', type: 'integer', q: 'Entier de test', default: 7, validIf: (v) => v >= 5 && v <= 10}],
      (definers) => { window.__testResult = definers ? definers[0].value : null }
    ).define();
    '';
  JS

  # - valeur invalide (hors bornes) : dialogue réaffiché avec erreur
  wait_for('__test_int__')
  set_value('__test_int__', '15')
  click_suffix('btn-oui')

  wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
    (dialog_error_text rescue '') =~ /invalide/i
  end
  raise "le champ entier devrait être encore là après une valeur invalide" unless exists?('__test_int__')

  # - autre valeur invalide (en dessous de la borne basse)
  set_value('__test_int__', '2')
  click_suffix('btn-oui')

  wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
    (dialog_error_text rescue '') =~ /invalide/i
  end

  # - valeur valide : continue, callback appelé avec l'entier converti
  set_value('__test_int__', '8')
  click_suffix('btn-oui')

  wait_until(desc: -> { "__testResult = #{bridge_eval('String(window.__testResult)')}" }) do
    bridge_eval("String(window.__testResult)") == '8'
  end
end

board_test("validIf générique : type 'integer', rejette hors bornes [5,10], accepte dedans") { run_test }
