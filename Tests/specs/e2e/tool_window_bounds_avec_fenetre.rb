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
  selected = get_value('__tools_app_window_bounds__')
  raise "sélection 'Board' pas prise (valeur = #{selected.inspect})" unless selected == 'Board'
  click_suffix('btn-oui')

  wait_until(4, desc: -> { "ni '__window-infos__' ni ErrorsDialog (errors_dialog_text = #{(errors_dialog_text rescue '(erreur)').inspect})" }) do
    exists?('__window-infos__') || !((errors_dialog_text rescue '').empty?)
  end
  raise "ErrorsDialog ouverte au lieu de window-infos : #{errors_dialog_text.inspect}" unless exists?('__window-infos__')
  infos = get_value('__window-infos__').to_s
  raise "infos de fenêtre incomplètes : #{infos.inspect}" unless %w[top left width height].all? { |k| infos =~ /#{k}/i }

  click_suffix('btn-oui')
end

board_test("outil 'Position et taille de fenêtre' : application avec une fenêtre ouverte") { run_test }
