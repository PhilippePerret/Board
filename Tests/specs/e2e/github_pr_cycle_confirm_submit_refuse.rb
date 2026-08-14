# Test : dynParam 'confirm_submit' (github-pr-cycle-submit), clic sur "Non"
# -> doit abandonner PROPREMENT (message "Opération abandonnée" en footer),
# sans jamais appeler le backend (donc sans toucher au réseau).
#
# git_pr_cycle_branche est pré-rempli directement sur la fiche projet pour
# court-circuiter le garde précédent (if_undefined) et arriver directement
# au dialogue de confirmation.

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

    # → dialogue de confirmation de soumission
    wait_for_suffix('btn-non')
    click_suffix('btn-non')

    wait_until(desc: -> { "#message = #{footer_message_text.inspect}" }) do
      footer_message_text.include?('abandonnée')
    end

    # → aucune popup d'erreur backend ne devrait être apparue (le backend
    #   n'a jamais été appelé) — le dossier fixture n'est pourtant pas un
    #   dépôt git, ce qui aurait produit une erreur bien différente.
    raise "aucune popup d'erreur ne devrait apparaître (backend jamais appelé), obtenu #{errors_dialog_text.inspect}" \
      unless errors_dialog_text.to_s.empty?
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-submit : confirm_submit refusé, annulation propre sans appel backend") { run_test }
