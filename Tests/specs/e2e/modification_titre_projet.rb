# Test : modification du titre d'un projet
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec un projet, créée directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets.

require_relative '../../support/helpers'

include BoardTest

NEW_TITLE = 'Titre modifié par le test'

def run_test
  project_id = create_fixture_project(title: 'Titre original')
  launch_app

  title_id = "project-#{project_id}-title"

  # - Cliquer sur le titre
  wait_for(title_id)
  click(title_id)

  # - modifier le titre dans le champ qui s'ouvre
  wait_for_prefix('__panel-')
  set_value_prefix('__panel-', NEW_TITLE)

  # - enregistrer
  click('btn-oui')

  # → titre modifié sur l'interface
  wait_until(5) { get_text(title_id) == NEW_TITLE }

  # → titre modifié dans la fiche dans project-cards
  wait_until(5) { read_project_card(project_id)['title'] == NEW_TITLE }
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("modification du titre d'un projet") { run_test }
