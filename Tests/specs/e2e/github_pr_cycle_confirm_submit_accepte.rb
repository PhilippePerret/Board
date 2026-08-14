# Test : dynParam 'confirm_submit' (github-pr-cycle-submit), clic sur "Oui"
# -> le service doit CONTINUER et appeler réellement le backend. Vérifié via
# l'erreur backend 'git-bad-branch' (le dossier fixture n'est pas un dépôt
# git, donc GIT.on_branch? renvoie false) — preuve que le backend a bien
# été atteint, sans réseau ni dépôt GitHub réel nécessaires pour ce test.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'github-pr-cycle-submit'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet PR Cycle Submit', path: fixture_dir,
                                 git_pr_cycle_branche: 'ma-branche')
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    click(SERVICE_DOM_ID)

    wait_for_suffix('btn-oui')
    click_suffix('btn-oui') # confirm_submit accepté

    wait_until(desc: -> { "popup erreur = #{(errors_dialog_text rescue '(aucune)').inspect}" }) do
      (errors_dialog_text rescue '') =~ /mauvaise branch Git/
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-submit : confirm_submit accepté, le service continue jusqu'au backend") { run_test }
