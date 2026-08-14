# Test : dynParam 'confirm_init' (github-pr-cycle-init), clic sur "Non" ->
# doit abandonner PROPREMENT tout le service (message "Opération abandonnée"
# en footer), jamais atteindre le dialogue du nom de branche, aucune donnée
# enregistrée sur le projet.

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

    # → dialogue de confirmation d'initialisation
    wait_for_suffix('btn-non')
    click_suffix('btn-non')

    wait_until(desc: -> { "#message = #{footer_message_text.inspect}" }) do
      footer_message_text.include?('abandonnée')
    end

    raise "le dialogue du nom de branche ne devrait jamais apparaître (non pas propagé)" \
      if exists?('__branche-name__')

    stored = read_project_card(id)
    raise "git_pr_cycle_branche ne devrait pas être enregistrée, obtenu #{stored.inspect}" \
      if stored['git_pr_cycle_branche']
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-init : confirm_init refusé, annulation propre") { run_test }
