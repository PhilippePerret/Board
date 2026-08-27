# Test : mécanisme générique :validIf (ParamDefiner#onPrompted) appliqué à
# un paramètre de type 'url' (pas 'string') — preuve qu'il ne dépend PAS du
# type de dialogue. Construit un ParamsDefiner isolé (pas un vrai service),
# via bridge_eval, avec validIf: url doit commencer par 'https://'.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  bridge_eval(<<~JS)
    window.__testResult = undefined;
    new ParamsDefiner(
      [{id: 'test_url', type: 'url', q: 'URL de test', validIf: (v, dict, callback) => callback(v.startsWith('https://') ? null : 'Valeur invalide')}],
      (definers) => { window.__testResult = definers ? definers[0].value : null }
    ).define();
    '';
  JS

  # - valeur invalide (http, pas https) : dialogue réaffiché avec erreur
  wait_for('__test_url__')
  set_value('__test_url__', 'http://exemple.com')
  click_suffix('btn-oui')

  wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
    (dialog_error_text rescue '') =~ /invalide/i
  end
  raise "le champ url devrait être encore là après une valeur invalide" unless exists?('__test_url__')
  raise "__testResult ne devrait pas encore être défini" unless bridge_eval("String(window.__testResult)") == 'undefined'

  # - valeur valide : continue, callback appelé avec la bonne valeur
  set_value('__test_url__', 'https://exemple.com')
  click_suffix('btn-oui')

  wait_until(desc: -> { "__testResult = #{bridge_eval('String(window.__testResult)')}" }) do
    bridge_eval("String(window.__testResult)") == 'https://exemple.com'
  end
end

board_test("validIf générique : type 'url', rejette http://, accepte https://") { run_test }
