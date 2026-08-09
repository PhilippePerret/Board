# Test : outil "Position et taille de fenêtre" (panneau Outils, Tools.js)
# — cas où l'application choisie A une fenêtre au premier plan.
# Cf. tool_window_bounds_sans_fenetre.rb pour le cas inverse (2 issues
# distinctes, jamais mélangées dans un seul test tolérant les deux).
#
# App choisie : "Board" lui-même — a toujours exactement sa fenêtre
# principale ouverte pendant un test, aucun effet de bord (contrairement à
# manipuler de vraies fenêtres Finder).
#
# - clic sur le 1er outil -> SelectDialog des applications visibles
# - sélection explicite de "Board" (pas le 1er de la liste par défaut,
#   non déterministe selon la machine) -> validation
# - -> TextareaDialog (id: 'window-infos') avec top/left/width/height

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  click('tools-button')
  wait_for('tools-panel')

  wait_for('tool-app-window-bounds')
  click('tool-app-window-bounds')
  wait_for('__tools_app_window_bounds__', 4)

  set_value('__tools_app_window_bounds__', 'Board')
  click_suffix('btn-oui')

  wait_for('__window-infos__', 4)
  infos = get_value('__window-infos__').to_s
  raise "infos de fenêtre incomplètes : #{infos.inspect}" unless %w[top left width height].all? { |k| infos =~ /#{k}/i }

  click_suffix('btn-oui')
end

board_test("outil 'Position et taille de fenêtre' : application avec une fenêtre ouverte") { run_test }
