# Test : clic sur le service commun 'github-pr-cycle-submit' SANS avoir fait
# 'github-pr-cycle-init' avant -> même garde (if_undefined: type 'cancel')
# que pour 'github-pr-cycle-commit' : doit annuler proprement, jamais
# atteindre le dialogue de confirmation (confirm_submit) ni le réseau.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'github-pr-cycle-submit'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet PR Cycle', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    click(SERVICE_DOM_ID)

    wait_for_suffix('btn-oui')
    click_suffix('btn-oui')

    wait_until(desc: -> { "#message = #{footer_message_text.inspect}" }) do
      footer_message_text.include?('abandonnée')
    end

    stored = read_project_card(id)['common_services_data']
    raise "aucune donnée 'github-pr-cycle-submit' ne devrait être enregistrée, obtenu #{stored.inspect}" \
      if stored && stored['github-pr-cycle-submit']
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-submit sans init préalable : annulation propre (pas de blocage silencieux)") { run_test }
