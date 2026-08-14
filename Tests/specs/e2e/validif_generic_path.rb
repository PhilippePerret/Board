# Test : mécanisme générique :validIf (ParamDefiner#onPrompted) appliqué à
# un paramètre de type 'path' — dont la valeur ne vient PAS d'une saisie
# clavier mais d'une sélection Finder réelle (Prompter#_getPathOfFinderSelection).
# Scénario concret : n'accepter que des chemins "propres" (a-z0-9/-_), comme
# si l'app exigeait des chemins de projet sans espace ni caractère spécial.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  Dir.mktmpdir('board-test-validif-path-') do |base|
    dossier_sale   = File.join(base, 'Dossier Sale')
    dossier_propre = File.join(base, 'dossier-propre')
    FileUtils.mkdir_p(dossier_sale)
    FileUtils.mkdir_p(dossier_propre)

    bridge_eval(<<~JS)
      window.__testResult = undefined;
      new ParamsDefiner(
        [{id: 'test_path', type: 'path', q: 'Chemin de test', validIf: (v) => /^[a-z0-9\\/_-]+$/.test(v)}],
        (definers) => { window.__testResult = definers ? definers[0].value : null }
      ).define();
      '';
    JS

    # - sélection d'un dossier "sale" (espace + majuscule) : rejeté
    wait_for_suffix('btn-oui')
    with_finder_selection(dossier_sale) do
      click_suffix('btn-oui')
    end

    wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
      (dialog_error_text rescue '') =~ /invalide/i
    end
    raise "__testResult ne devrait pas encore être défini" unless bridge_eval("String(window.__testResult)") == 'undefined'

    # - sélection d'un dossier "propre" : accepté, continue
    wait_for_suffix('btn-oui')
    with_finder_selection(dossier_propre) do
      click_suffix('btn-oui')
    end

    wait_until(desc: -> { "__testResult = #{bridge_eval('String(window.__testResult)')}" }) do
      result = bridge_eval("String(window.__testResult)")
      result != 'undefined' && File.realpath(result) == File.realpath(dossier_propre)
    end
  end
end

board_test("validIf générique : type 'path' (sélection Finder réelle), rejette espace/majuscule") { run_test }
