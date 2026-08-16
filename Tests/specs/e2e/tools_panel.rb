# Test : panneau "Outils" (ToolsPanel.js/ToolsData.js), ouvert via le lien
# "Outils" du header (à côté de "Aide").
# Source : demande explicite (2026-07-20).
#
# Pas de projet nécessaire : panneau global, indépendant de tout projet
# (même famille que AppDataPanel).
#
# Mécanique d'ouverture/fermeture seulement — le 1er outil ("Position et
# taille de fenêtre") est testé à part, cf. tool_window_bounds_avec_fenetre.rb
# et tool_window_bounds_sans_fenetre.rb (2 issues distinctes, pas mélangeables
# dans un seul test).
#
# - clic sur "Outils" -> ouvre le panneau
# - reclic immédiat -> le referme (SidePanel#toggleOpenClose, cf.
#   SidePanel.js — même mécanique que "Tableau de bord"/AppDataPanel)

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  # → construit à la volée, pas encore dans le DOM avant le 1er clic
  raise 'tools-panel présent dans le DOM avant tout clic sur "Outils"' if exists?('tools-panel')

  click('tools-button')
  wait_for('tools-panel')
  raise 'tools-panel pas ouvert après clic sur "Outils"' unless panel_open?('tools-panel')

  # → reclic immédiat : referme
  click('tools-button')
  wait_until(4, desc: -> { 'tools-panel encore ouvert après le 2e clic' }) { !panel_open?('tools-panel') }

  # → on rouvre
  click('tools-button')
  wait_until(4, desc: -> { 'tools-panel pas réouvert' }) { panel_open?('tools-panel') }
end

board_test("panneau 'Outils' : ouverture/fermeture") { run_test }
