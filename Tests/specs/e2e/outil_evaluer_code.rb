# Test de l'outil "Évaluer du code" (panneau Outils, Tools.js#toolEvalCode
# -> Dialogs.js#EvalCodeDialog) :
#  - cas de contrôle : code valide -> résultat affiché à gauche
#  - cas d'erreur : affiché DANS le panneau gauche du dialog, en rouge,
#    JAMAIS dans l'ErrorsDialog générique (RETOUR.ok doit rester true côté
#    backend, cf. backend/lib/code_eval.rb — sinon xbridge.js intercepte
#    et ouvre l'ErrorsDialog à la place du callback du dialog)
#  - le dialog reste ouvert après une erreur (pas de fermeture forcée)

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-eval-code')
  click('tool-eval-code')
  wait_for('tools_eval_code-input')

  # --- Cas de contrôle : code valide ---
  set_value('tools_eval_code-lang', 'ruby')
  set_value('tools_eval_code-input', 'puts 6 * 7')
  click('tools_eval_code-btn-oui')

  wait_until(desc: -> { "résultat = #{get_text('tools_eval_code-result').inspect}" }) do
    get_text('tools_eval_code-result') == '42'
  end
  raise "classe 'error' présente sur un résultat valide" if has_class?('tools_eval_code-result', 'error')

  # --- Cas d'erreur : affiché dans le dialog, pas dans une ErrorsDialog ---
  set_value('tools_eval_code-input', 'raise "boom test"')
  click('tools_eval_code-btn-oui')

  wait_until(desc: -> { "résultat = #{get_text('tools_eval_code-result').inspect}" }) do
    get_text('tools_eval_code-result').include?('boom test')
  end
  raise "classe 'error' absente sur une erreur" unless has_class?('tools_eval_code-result', 'error')
  # errors_dialog_text (.panel .message) est trop générique ici : il
  # matcherait aussi le contenu normal de CE dialog (options du select
  # concaténées dans le textContent) — on vise le marqueur réel d'une
  # vraie ErrorsDialog (Dialogs.js#buildContainerErrors, class 'error small').
  real_errors_dialog = bridge_eval("!!document.querySelector('.panel .message div.error.small')") == 'true'
  raise 'ErrorsDialog ouverte au lieu du panneau gauche' if real_errors_dialog
  raise "le dialog s'est refermé après une erreur" unless exists?('tools_eval_code-input')

  click('tools_eval_code-btn-non')
  wait_until(desc: -> { 'dialog toujours présent après Finir' }) { !exists?('tools_eval_code-input') }
end

board_test("outil 'Évaluer du code' : résultat valide, erreur inline (pas d'ErrorsDialog), dialog reste ouvert") { run_test }
