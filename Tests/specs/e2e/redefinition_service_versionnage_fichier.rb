# Test : redéfinition d'un service "file-versioning" — couvre le type
# 'path-or-null' (bouton "Préserver" à côté de "Aucun", format groupé
# normal). Le type 'path' est déjà couvert par
# redefinition_service_ouvrir_fichier.rb, réutilisé ici juste pour attacher
# le service sans le réévaluer en détail.
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    Dir.mktmpdir('board-test-archives-') do |archive_dir|
      uuid = "fixture-service-#{Time.now.to_i}redef3"
      service = {
        'id' => 'file-versioning', 'uuid' => uuid, 'type' => 'others', 'scType' => '.rb',
        'name' => 'Nom initial', 'params' => [[fixture_dir], [archive_dir]], 'projectId' => nil
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

      # → path : Préserver
      wait_for('btn-mid')
      click('btn-mid')

      # → archive-folder (path-or-null) : Préserver DISTINCT de "Aucun"
      wait_for('btn-mid')
      raise "pas de bouton Préserver pour path-or-null" unless get_text('btn-mid') == 'Préserver'
      raise 'bouton "Aucun" absent (path-or-null doit garder ses 2 options)' unless get_text('btn-non') == 'Aucun'
      click('btn-mid')

      wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
        found = read_project_card(id)['services']['others'].find { |s| s['uuid'] == uuid }
        next false unless found
        vals = found['params'].flatten
        File.realpath(vals[0]) == File.realpath(fixture_dir) && File.realpath(vals[1]) == File.realpath(archive_dir)
      end
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("redéfinition d'un service 'file-versioning' : path-or-null propose Préserver ET Aucun") { run_test }
