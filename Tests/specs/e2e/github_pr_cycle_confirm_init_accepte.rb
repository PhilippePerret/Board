# Test : dynParam 'confirm_init' (github-pr-cycle-init), clic sur "Oui" ->
# le service doit CONTINUER (dialogue du nom de branche affiché), puis
# atteindre réellement le backend — vérifié ici via l'erreur backend
# 'backend-not-a-git-repo' (le dossier fixture n'est pas un dépôt git),
# preuve que confirm_init ne bloque ni ne fausse rien côté script (cf.
# beforeExec qui retire confirm_init du tableau positionnel envoyé).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'github-pr-cycle-init'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet PR Cycle Init', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    click(SERVICE_DOM_ID)

    wait_for_suffix('btn-oui')
    click_suffix('btn-oui') # confirm_init accepté

    # → le service continue : dialogue du nom de branche
    wait_for('__branche-name__')
    set_value('__branche-name__', 'ma-branche-de-test')
    click_suffix('btn-oui')

    # → le backend a bien été appelé (dossier fixture pas un repo git) :
    #   la valeur de confirm_init (true) n'a PAS pollué les arguments
    #   positionnels envoyés au script (sinon l'erreur serait différente,
    #   voire un crash côté script).
    wait_until(desc: -> { "popup erreur = #{(errors_dialog_text rescue '(aucune)').inspect}" }) do
      (errors_dialog_text rescue '') =~ /pas un repo Git/
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-init : confirm_init accepté, le service continue jusqu'au backend") { run_test }
