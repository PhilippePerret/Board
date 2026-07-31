# Test : quand un projet a déjà une couleur de fond définie, rouvrir sa
# ligne "background" dans le ConfigDialog doit proposer cette couleur en
# valeur par défaut du champ, pas une valeur vide.
#
# Passe désormais par ConfigDialog (Project.js#editData) : chaque ligne
# ouvre un ParamsDefiner avec `default: dprop.value` (Dialogs.js#buildConfig)
# — le prefill est donc générique (ParamDefiner#currentOrDefault), plus
# spécifique à un ColorDialog. `background` est déclaré type 'string' dans
# PROJECT_DATA (ProjectData.js), donc un simple champ texte, pas un picker.

require_relative '../../support/helpers'

include BoardTest

def run_test
  existing_color = '#336699'
  project_id = create_fixture_project(title: 'Projet Fond', background: existing_color)
  launch_app

  card = "project-#{project_id}"
  panel_id = "project-#{project_id}-panel-data"
  wait_for(card)
  click(card)

  wait_for('btn-deal-project-data')
  click('btn-deal-project-data')
  wait_for("#{panel_id}-background-value")
  click("#{panel_id}-background-value")

  wait_for('__background__')
  prefilled = get_value('__background__')
  raise "champ prérempli à #{prefilled.inspect} au lieu de la couleur déjà définie (#{existing_color.inspect})" unless
    prefilled == existing_color
ensure
  remove_fixture_project(project_id) if project_id
end

board_test('panneau extra-data : picker de couleur pré-rempli avec la couleur de fond déjà définie') { run_test }
