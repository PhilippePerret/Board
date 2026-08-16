# Test : outil "Position et taille de fenêtre" (panneau Outils, Tools.js)
# — cas où l'application choisie N'A PAS de fenêtre (erreur régulière,
# Tools.js#onWindowBounds -> error() -> ErrorsDialog).
# Cf. tool_window_bounds_avec_fenetre.rb pour le cas inverse.
#
# App choisie : "Finder", forcé sans fenêtre via snapshot/close-all/restore
# (Tests/support/finder.applescript — la seule paire sûre pour ça,
# documentée pour cet usage précis) plutôt qu'une fermeture ciblée : il faut
# ZÉRO fenêtre Finder, pas juste une en moins. Restauration en ensure, jamais
# sautée même en cas d'échec du test.

require_relative '../../support/helpers'

include BoardTest

def run_test
  snapshot = finder_snapshot_windows
  finder_close_all_windows

  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  click('tools-button')
  wait_for('tools-panel')

  wait_for('tool-app-window-bounds')
  click('tool-app-window-bounds')
  wait_for('__tools_app_window_bounds__', 4)

  set_value('__tools_app_window_bounds__', 'Finder')
  click_suffix('btn-oui')

  wait_until(4, desc: -> {
    "ErrorsDialog absente ou inattendue (#{(errors_dialog_text rescue '(erreur)').inspect})" \
    " — LOGS = #{bridge_eval('JSON.stringify(window.LOGS || [])')}" \
    " — Board-debug.log (fin) :\n#{debug_log_tail}"
  }) do
    (errors_dialog_text rescue '') =~ /Aucune fenêtre ouverte/
  end
ensure
  finder_restore_windows(snapshot) if snapshot
end

board_test("outil 'Position et taille de fenêtre' : application sans fenêtre ouverte -> erreur") { run_test }
