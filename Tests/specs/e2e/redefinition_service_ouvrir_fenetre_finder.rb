# Test : redéfinition d'un service "open-finder-window" — couvre 'finder-
# window' (type composite : PAS de bouton Préserver, resélection Finder
# obligatoire) et 'boolean' (bouton par défaut mis en valeur selon la
# valeur actuelle, Dialog.js#defaultKey).
# Source : demande explicite (2026-07-19).
#
# Format des params : groupé normal (this.params = [[fenêtre…7 valeurs],
# [booléen]]) — PAS BoardTest#fixture_open_finder_window_service, dont le
# format à plat (8 valeurs dans un seul tableau, sans respecter les
# frontières des 2 params du schéma) fausserait ce test précis.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef4"
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'open-finder-window', 'uuid' => uuid, 'type' => 'others', 'scType' => '.scpt',
      'name' => 'Nom initial',
      'params' => [[fixture_dir, 100, 100, 600, 400, 200, 'list view'], [true]],
      'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    wait_for('__service-name__')
    click('btn-oui') # nom inchangé

    # → finder-window : composite, pas de "Préserver", resélection obligatoire
    wait_for('btn-oui')
    raise 'bouton Préserver présent pour un type composite (finder-window)' unless get_text('btn-mid') == ''
    with_finder_window(fixture_dir) do
      click('btn-oui') # confirme la fenêtre lue -> avance au param suivant (sidebar)
      wait_for('btn-oui') # dialogue booléen (sidebar) maintenant affiché
    end

    # → boolean : bouton par défaut mis en valeur (actual = true -> Oui)
    raise 'bouton par défaut absent/mauvais (actual=true doit mettre Oui en avant)' unless has_class?('btn-oui', 'default-btn')
    raise 'le bouton Non ne doit pas être mis en valeur' if has_class?('btn-non', 'default-btn')
    click('btn-oui') # garde "Oui"

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && found['params'][1] == [true]
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'open-finder-window' : pas de Préserver pour finder-window, bouton par défaut pour boolean") { run_test }
