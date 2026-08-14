# Test : clic sur le service commun 'github-pr-cycle-commit' SANS avoir fait
# 'github-pr-cycle-init' avant (propriété projet git_pr_cycle_branche non
# définie) -> Prompter#promptProject (if_undefined: type 'cancel') doit
# afficher le dialogue d'alerte puis, au clic sur son bouton, annuler
# PROPREMENT tout le service (message "Opération abandonnée" en footer,
# jamais de dialogue commit-title/commit-body après).
#
# Couvre le fix Prompter.js (promptCancel + promptProject) : avant ce fix,
# le clic sur le bouton du dialogue ne faisait RIEN (service bloqué en
# silence, jamais annulé).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'github-pr-cycle-commit'

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

    # → dialogue d'alerte (type 'cancel') affiché
    wait_for_suffix('btn-oui')
    click_suffix('btn-oui')

    # → annulation propre : message "Opération abandonnée" en footer
    wait_until(desc: -> { "#message = #{footer_message_text.inspect}" }) do
      footer_message_text.include?('abandonnée')
    end

    # → le service ne doit PAS avoir continué vers les dynParams du commit
    raise "le dialogue de titre de commit ne devrait jamais apparaître (service non annulé)" \
      if exists?('__commit-title__')

    # → aucune donnée de commit n'a été enregistrée sur le projet
    stored = read_project_card(id)['common_services_data']
    raise "aucune donnée 'github-pr-cycle-commit' ne devrait être enregistrée, obtenu #{stored.inspect}" \
      if stored && stored['github-pr-cycle-commit']
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-commit sans init préalable : annulation propre (pas de blocage silencieux)") { run_test }
