# Test : Spinner.start → continue → stop(message) affiche bien le message
# final. Aurait attrapé le bug réel du 13/08/2026 : start() remettait
# _count à 1 (au lieu de l'incrémenter), continue() l'incrémentait (au lieu
# de ne pas y toucher) — stop() sortait alors avant même d'afficher le
# message final.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  # App.init lance son propre cycle Spinner (start → continue → stop) au
  # démarrage — attendre qu'il soit retombé avant de lancer le cycle du
  # test, sinon les deux s'entremêlent sur le même Spinner global.
  wait_until(5, desc: -> { "classe #spinner-message = #{(bridge_eval(%q{document.querySelector("#spinner-message")?.className}) rescue '(erreur)').inspect}" }) do
    bridge_eval(%q{document.querySelector("#spinner-message")?.classList.contains("visible")}) != 'true'
  end

  bridge_eval(<<~JS)
    (function(){
      window.__spinnerTrace = []
      Spinner.start('un', function(){
        window.__spinnerTrace.push('un-affiche')
        Spinner.continue('deux', function(){
          window.__spinnerTrace.push('deux-affiche')
          Spinner.stop('trois')
        })
      })
      return ''
    })()
  JS

  wait_until(5, desc: -> { "trace = #{bridge_eval('JSON.stringify(window.__spinnerTrace || [])')}" }) do
    bridge_eval('JSON.stringify(window.__spinnerTrace || [])') == '["un-affiche","deux-affiche"]'
  end

  wait_until(5, desc: -> { "texte affiché = #{(bridge_eval('document.querySelector("#spinner-message")?.textContent') rescue '(erreur)').inspect}" }) do
    bridge_eval('document.querySelector("#spinner-message")?.textContent') == 'trois'
  end
end

board_test("Spinner : start → continue → stop(message) affiche bien le message final") { run_test }
