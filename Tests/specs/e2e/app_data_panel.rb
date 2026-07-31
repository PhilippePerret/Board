# Test : dialogue de configuration de l'application (ConfigDialog,
# frontend/js/Dialogs.js + AppData.js), ouvert en cliquant sur "Tableau de
# bord" (#app-name, App.js#editConfigData). Remplace l'ancien AppDataPanel
# (SidePanel), retiré.
#
# Pas de projet nécessaire : réglages globaux (appdata.json), indépendants
# de tout projet.
#
# ConfigDialog est un Dialog modal (pas un panneau togglé) : construit et
# ajouté au DOM à chaque clic sur "Tableau de bord" (id fixe 'app-config',
# App.js:63), retiré du DOM à sa fermeture (Dialog#hide -> this.obj.remove()).
#
# Chaque ligne a pour id 'app-config-<prop-id>-value' (Dialogs.js#buildConfig).
# Cliquer une ligne ouvre un 2e Dialog imbriqué (ParamDefiner, id = l'id de la
# propriété) pour éditer sa valeur ; ses boutons sont donc '<prop-id>-btn-oui'
# / '<prop-id>-btn-non' (Dialog.js préfixe désormais btn-oui/non/mid par
# this.id, pour éviter la collision avec les boutons du ConfigDialog englobant
# qui reste ouvert pendant l'édition d'une ligne).
#
# Édition testée pour les 2 types de propriété :
#   - type 'string' (ex. changelog-file) -> TextFieldDialog
#   - type 'select' (ex. code-editor, valeurs fixes dans une liste)
#                                         -> SelectDialog (<select>)
#
# Important : éditer une ligne ne persiste PAS aussitôt dans appdata.json —
# seulement en mémoire (dprop.value + this.modos), affiché tout de suite dans
# la ligne. La persistance réelle (App.setData + saveData) n'a lieu qu'au
# clic sur le bouton Save du ConfigDialog lui-même ('app-config-btn-oui',
# App.js#onSaveConfig).
#
# Point non garanti par un précédent dans cette suite : `set_value` sur un
# <select> HTML (moteur "pont" : fait juste "el.value = X", cf.
# version-pont/support/helpers.rb — jamais exercé sur un <select> ailleurs
# dans specs/e2e/, seulement sur des <input type=text>/<textarea>). Si le
# frontend attend un évènement 'change' pour réagir à ce <select>, cette
# partie du test échouera au set_value plutôt qu'à l'assertion — à
# surveiller au premier lancement.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  original = read_app_data.slice('changelog-file', 'code-editor')

  # → pas dans le DOM avant tout clic sur "Tableau de bord"
  raise 'app-config présent dans le DOM avant tout clic sur "Tableau de bord"' if exists?('app-config')

  click('app-name')
  wait_for('app-config')

  # - édition d'une valeur simple (type 'string')
  click('app-config-changelog-file-value')
  wait_for('changelog-file-btn-oui')
  set_value('__changelog-file__', 'HISTORIQUE.md')
  click('changelog-file-btn-oui')

  # → affiché tout de suite dans la ligne (avant tout Save)
  wait_until(desc: -> { "texte de la ligne = #{get_text('app-config-changelog-file-value').inspect}" }) do
    get_text('app-config-changelog-file-value').include?('HISTORIQUE.md')
  end
  # → pas encore persisté (Save pas encore cliqué)
  raise "appdata.json déjà modifié avant Save : #{read_app_data.inspect}" if read_app_data['changelog-file'] == 'HISTORIQUE.md'

  # - édition d'une valeur choisie dans une liste fixe (type 'select')
  click('app-config-code-editor-value')
  wait_for('code-editor-btn-oui')
  set_value('__code-editor__', 'Sublime Text')
  click('code-editor-btn-oui')

  wait_until(desc: -> { "texte de la ligne = #{get_text('app-config-code-editor-value').inspect}" }) do
    get_text('app-config-code-editor-value').include?('Sublime Text')
  end

  # - Save du ConfigDialog : persiste réellement dans appdata.json
  click('app-config-btn-oui')

  wait_until(desc: -> { "appdata.json = #{read_app_data.inspect}" }) do
    read_app_data['changelog-file'] == 'HISTORIQUE.md' && read_app_data['code-editor'] == 'Sublime Text'
  end
  # → le dialogue se ferme après Save
  wait_until(desc: -> { 'app-config encore présent après Save' }) { !exists?('app-config') }

  # → persistance après rechargement (App.init relit appdata.json)
  launch_app
  click('app-name')
  wait_for('app-config')
  wait_until(desc: -> { "texte de la ligne = #{get_text('app-config-changelog-file-value').inspect}" }) do
    get_text('app-config-changelog-file-value').include?('HISTORIQUE.md')
  end

  # → Cancel ferme aussi le dialogue, sans casser l'app
  click('app-config-btn-non')
  raise "Board a quitté juste après la fermeture du dialogue" unless board_running?
  raise 'app-config encore présent après Cancel' if exists?('app-config')
ensure
  app_data = read_app_data
  app_data.delete('changelog-file')
  app_data.delete('code-editor')
  app_data.merge!(original) if original
  write_app_data(app_data)
end

board_test("dialogue de configuration de l'application : édition string + select, persistance après Save/rechargement") { run_test }
