# Test : panneau de réglages de l'application (AppDataPanel, frontend/js/
# AppDataPanel.js + AppData.js + SidePanel.js).
# Source : demande explicite (2026-07-13).
#
# Pas de projet nécessaire : réglages globaux (appdata.json), indépendants
# de tout projet.
#
# Le panneau est construit à la volée (SidePanel#build, au premier
# open()/toggle()) : #app-data-panel n'existe dans le DOM qu'après le
# premier clic sur "Tableau de bord" (#app-name) — vérifié explicitement.
#
# Édition testée pour les 2 types de propriété :
#   - type 'string' (ex. changelog-file)      -> TextFieldDialog
#   - type 'app'    (ex. code-editor, valeurs
#     fixes dans une liste)                   -> SelectDialog (<select>)
#
# Point non garanti par un précédent dans cette suite : `set_value` sur un
# <select> HTML (ax.applescript fait juste "set value of el to extraArg" —
# jamais exercé sur un <select> ailleurs dans specs/e2e/, seulement sur des
# <input type=text>/<textarea>). Si WebKit expose le <select> autrement
# qu'en AXValue directement réglable, cette partie du test échouera au
# set_value plutôt qu'à l'assertion — à surveiller au premier lancement.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  original = read_app_data.slice('changelog-file', 'code-editor')

  # → construit à la volée, pas encore dans le DOM avant le 1er clic
  raise 'app-data-panel présent dans le DOM avant tout clic sur "Tableau de bord"' if exists?('app-data-panel')

  click('app-name')
  wait_for('app-data-panel', 5)

  # - édition d'une valeur simple (type 'string')
  click('app-data-changelog-file')
  wait_for('btn-oui', 10)
  set_value('__changelog-file__', 'HISTORIQUE.md')
  click('btn-oui')

  wait_until(5, desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    read_app_data['changelog-file'] == 'HISTORIQUE.md'
  end
  wait_until(5, desc: -> { "texte de la ligne = #{get_text('app-data-changelog-file').inspect}" }) do
    get_text('app-data-changelog-file').include?('HISTORIQUE.md')
  end

  # - édition d'une valeur choisie dans une liste fixe (type 'app')
  click('app-data-code-editor')
  wait_for('btn-oui', 10)
  set_value('__code-editor__', 'Sublime Text')
  click('btn-oui')

  wait_until(5, desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    read_app_data['code-editor'] == 'Sublime Text'
  end
  wait_until(5, desc: -> { "texte de la ligne = #{get_text('app-data-code-editor').inspect}" }) do
    get_text('app-data-code-editor').include?('Sublime Text')
  end

  # → persistance après rechargement (App.init relit appdata.json)
  launch_app
  click('app-name')
  wait_for('app-data-panel', 5)
  wait_until(5, desc: -> { "texte de la ligne = #{get_text('app-data-changelog-file').inspect}" }) do
    get_text('app-data-changelog-file').include?('HISTORIQUE.md')
  end

  # → un 2e clic sur "Tableau de bord" (fermeture) ne casse rien
  click('app-name')
  raise "Board a quitté juste après la fermeture du panneau" unless board_running?
ensure
  app_data = read_app_data
  app_data.merge!(original) if original
  write_app_data(app_data)
end

board_test("panneau de réglages de l'application : édition string + app, persistance après rechargement") { run_test }
