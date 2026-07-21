# Test : quand un projet a déjà une couleur de fond définie, rouvrir le
# picker de couleur ("Fond de la carte du projet" -> "Couleur") doit
# proposer cette couleur, pas la valeur par défaut du picker.
# Bug signalé : _dev/Manuel/adocs/_TODO_.adoc, "quand on choisit la couleur
# de fond, s'il y en a déjà une, on doit l'appliquer au picker de couleurs".
#
# Cause (ParamDefiner.js#onColor) : contrairement aux autres on<Type> de la
# classe, ColorDialog est créé sans `defaultValue: this.currentOrDefault`
# (et sans `id: this.id`) — le picker retombe donc systématiquement sur
# '#ff0000' (Dialogs.js#ColorDialog#buildField).

require_relative '../../support/helpers'

include BoardTest

def run_test
  existing_color = '#336699'
  project_id = create_fixture_project(title: 'Projet Fond', background: existing_color)
  launch_app

  card = "project-#{project_id}"
  wait_for(card)
  click(card)

  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')
  wait_for('projet-extradata-panel')

  click('project-extradata-background')
  wait_for('btn-oui')
  click('btn-oui') # "Couleur"

  wait_until(desc: -> { 'picker de couleur jamais apparu' }) do
    bridge_eval("!!document.querySelector('input[type=color]')") == 'true'
  end

  picker_value = bridge_eval("document.querySelector('input[type=color]').value")
  raise "picker affiche #{picker_value.inspect} au lieu de la couleur déjà définie (#{existing_color.inspect})" unless
    picker_value == existing_color
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : picker de couleur pré-rempli avec la couleur de fond déjà définie') { run_test }
