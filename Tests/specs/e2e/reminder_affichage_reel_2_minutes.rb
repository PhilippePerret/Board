# @long — test BOUT EN BOUT réel (aucune simulation) : un rappel programmé
# via l'outil "Programmer une alerte" pour aujourd'hui + 2 minutes doit
# réellement s'afficher (Notifier.notify -> action 'notify' interceptée
# par Sources/Board/Bridge.swift -> NativeNotifier.swift, une vraie fenêtre
# native macOS, PAS dans le DOM de la WKWebView principale — donc pas
# accessible via document.getElementById depuis le pont de test).
#
# Détection par comptage de fenêtres natives du process Board
# (board_window_count, System Events — même mécanisme que lien_aide.rb),
# pas par une inspection DOM.
#
# Timing réel (Reminder.js#run) : l'armement se cale sur la PROCHAINE
# minute pleine avant même de démarrer le poll (jusqu'à 60s d'attente),
# puis poll toutes les 60s (setInterval) — d'où un timeout large
# (~5 minutes) pour ce test, marqué @long (exclu par défaut, cf.
# Tests/version-pont/run_tests.sh, inclus avec --long).

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  baseline_windows = board_window_count

  datetime_str = (Time.now + 120).strftime('%H:%M') # +2 min, aujourd'hui

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  wait_for_prefix('__panel-')
  set_value_prefix('__panel-', datetime_str)
  click_suffix('btn-oui')

  wait_for_prefix('__panel-')
  set_value_prefix('__panel-', 'Rappel réel 2 minutes')
  click_suffix('btn-oui')

  wait_for_suffix('btn-oui') # OKDialog final
  click_suffix('btn-oui')

  # → attente réelle : alignement minute (jusqu'à 60s) + délai (2 min) +
  #   marge de poll (jusqu'à 60s) + marge — pas de simulation d'horloge.
  wait_until(300, 5, desc: -> { "nombre de fenêtres Board = #{board_window_count} (baseline #{baseline_windows})" }) do
    board_window_count > baseline_windows
  end
ensure
  (bridge_eval("Reminder.asArray().filter(function(r){ return r.message === 'Rappel réel 2 minutes'; }).forEach(function(r){ Reminder.remove(r); })") rescue nil)
end

board_test("outil 'Programmer une alerte' : rappel à +2 minutes réellement affiché (bout en bout)") { run_test }
