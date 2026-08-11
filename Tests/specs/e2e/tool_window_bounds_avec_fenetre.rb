# Test : outil "Position et taille de fenêtre" (panneau Outils, Tools.js)
# — cas où l'application choisie A une fenêtre au premier plan.
# Cf. tool_window_bounds_sans_fenetre.rb pour le cas inverse (2 issues
# distinctes, jamais mélangées dans un seul test tolérant les deux).
#
# App choisie : "Finder" (fenêtre ouverte de force, snapshot/restore comme
# tool_window_bounds_sans_fenetre.rb en sens inverse) — PAS "Board" : Board
# interroge System Events sur ses propres fenêtres via un aller-retour
# synchrone (Backend.swift#run, readDataToEndOfFile bloquant sur le thread
# principal pendant l'appel) — le thread principal de Board est donc bloqué
# au moment même où System Events tente de lister ses fenêtres, qui
# remontent alors vides à chaque fois (pas un flake, structurel).
#
# - clic sur le 1er outil -> SelectDialog des applications visibles
# - sélection explicite de "Finder" -> validation
# - -> TextareaDialog (id: 'window-infos') avec top/left/width/height

require_relative '../../support/helpers'

include BoardTest

def run_test
  snapshot = finder_snapshot_windows
  finder_close_all_windows
  finder_open_window(Dir.home)

  launch_app

  click('tools-button')
  wait_for('tools-panel')

  wait_for('tool-app-window-bounds')
  click('tool-app-window-bounds')
  wait_for('__tools_app_window_bounds__', 4)

  set_value('__tools_app_window_bounds__', 'Finder')
  selected = get_value('__tools_app_window_bounds__')
  raise "sélection 'Finder' pas prise (valeur = #{selected.inspect})" unless selected == 'Finder'
  click_suffix('btn-oui')

  wait_until(4, desc: -> { "ni '__window-infos__' ni ErrorsDialog (errors_dialog_text = #{(errors_dialog_text rescue '(erreur)').inspect})" }) do
    exists?('__window-infos__') || !((errors_dialog_text rescue '').empty?)
  end
  raise "ErrorsDialog ouverte au lieu de window-infos : #{errors_dialog_text.inspect}" unless exists?('__window-infos__')
  infos = get_value('__window-infos__').to_s
  raise "infos de fenêtre incomplètes : #{infos.inspect}" unless %w[top left width height].all? { |k| infos =~ /#{k}/i }

  click_suffix('btn-oui')
ensure
  finder_restore_windows(snapshot) if snapshot
end

board_test("outil 'Position et taille de fenêtre' : application avec une fenêtre ouverte") { run_test }
