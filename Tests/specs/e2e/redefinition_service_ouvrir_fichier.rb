# Test : redéfinition (cmd+clic) d'un service "open-file" déjà attaché —
# couvre les types 'path' et 'logiciel'. Format de stockage NORMAL (groupé,
# this.params = [[valeur],[valeur]] — cf. redefinition_service_run_script_
# format_ancien.rb pour le format à plat des anciens projets).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}redef1"
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    file_path = File.join(fixture_dir, 'note.txt')
    File.write(file_path, 'contenu de test')
    service = {
      'id' => 'open-file', 'uuid' => uuid, 'type' => 'others', 'scType' => '.sh',
      'name' => 'Nom initial', 'params' => [[file_path], ['Safari']], 'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    # → nom : valeur actuelle proposée, renommage possible
    wait_for('__service-name__')
    raise "nom pas préempli = #{get_value('__service-name__').inspect}" unless get_value('__service-name__') == 'Nom initial'
    set_value('__service-name__', 'Nom modifié')
    click('btn-oui')

    # → path : bouton "Préserver" présent (this.actual bien remonté), on le garde
    wait_for('btn-mid')
    raise "pas de bouton Préserver pour le path" unless get_text('btn-mid') == 'Préserver'
    click('btn-mid')

    # → logiciel : valeur actuelle préremplie dans le <select>, on la garde telle quelle
    wait_for('__app__')
    raise "logiciel pas préempli = #{get_value('__app__').inspect}" unless get_value('__app__') == 'Safari'
    click('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
      found && found['name'] == 'Nom modifié' && found['params'].flatten == [file_path, 'Safari']
    end

    # → carte affichée : le nom mis à jour tout de suite, pas seulement sur disque
    raise "nom affiché pas mis à jour = #{get_text(service_card).inspect}" unless get_text(service_card).include?('Nom modifié')

    # → pas d'exécution automatique après la redéfinition
    sleep 1
    raise 'le service a été exécuté après une simple redéfinition' if get_text('message').to_s.include?('joué avec succès')
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'open-file' : nom + path (Préserver) + logiciel préremplis, pas d'exécution auto") { run_test }
