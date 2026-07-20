# Test : panneau "Outils" (ToolsPanel.js/ToolsData.js/Tools.js), ouvert via
# le lien "Outils" du header (à côté de "Aide").
# Source : demande explicite (2026-07-20).
#
# Pas de projet nécessaire : panneau global, indépendant de tout projet
# (même famille que AppDataPanel).
#
# - clic sur "Outils" -> ouvre le panneau
# - reclic immédiat -> le referme (SidePanel#toggleOpenClose, cf.
#   SidePanel.js — même mécanique que "Tableau de bord"/AppDataPanel)
# - clic sur le 1er outil ("Position et taille de fenêtre") -> ouvre le
#   SelectDialog listant les applications visibles, la 1re déjà
#   sélectionnée par défaut -> validation -> un message apparaît en pied de
#   page (position/taille copiées, ou message d'erreur gracieux si l'app
#   par défaut n'a pas de fenêtre — pas d'assertion sur le contenu précis,
#   dépend des apps ouvertes sur la machine au moment du test)

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  # → construit à la volée, pas encore dans le DOM avant le 1er clic
  raise 'tools-panel présent dans le DOM avant tout clic sur "Outils"' if exists?('tools-panel')

  click('tools-button')
  wait_for('tools-panel')
  raise 'tools-panel pas ouvert après clic sur "Outils"' unless panel_open?('tools-panel')

  # → reclic immédiat : referme
  click('tools-button')
  wait_until(5, desc: -> { 'tools-panel encore ouvert après le 2e clic' }) { !panel_open?('tools-panel') }

  # → on rouvre pour la suite
  click('tools-button')
  wait_until(5, desc: -> { 'tools-panel pas réouvert' }) { panel_open?('tools-panel') }

  # → clic sur le 1er outil : l'active (ouvre le dialogue de choix d'appli)
  wait_for('tool-app-window-bounds')
  click('tool-app-window-bounds')
  wait_for('__tools_app_window_bounds__', 5)

  default_app = get_value('__tools_app_window_bounds__')
  raise 'aucune application proposée dans la liste' if default_app.nil? || default_app.empty?

  click('btn-oui')

  wait_until(10, desc: -> { "#message = #{(get_text('message') rescue '(erreur)').inspect}" }) do
    (get_text('message') rescue '') != 'Message footer'
  end
  msg = get_text('message').to_s
  raise "message inattendu après validation de l'outil : #{msg.inspect}" unless
    msg =~ /Position\/taille copiées dans le presse-papier/ ||
    msg =~ /Application introuvable ou fermée/ ||
    msg =~ /Aucune fenêtre ouverte/
end

board_test("panneau 'Outils' : ouverture/fermeture, 1er outil (position/taille de fenêtre) activé") { run_test }
