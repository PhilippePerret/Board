# Test : service commun "work-clock" ("Démarrer l'horloge")
# Source : demande explicite (2026-07-12).
#
# Déroulé : sélection projet -> clic "Démarrer l'horloge" -> 1re définition
# (durée de session puis durée de tranche, préremplie avec la session,
# ServiceDefiner#defineByType case 'integer') -> sdata['work-clock'] enregistrée
# en tableau positionnel [session, work] (PAS un objet nommé) -> horloge
# affichée (Clock.js) -> Start/Pause/Restart/Stop -> Stop enchaîne 2
# TextareaDialog (changelog puis todo) -> backend 'update-project-notes' écrit
# CHANGELOG.md/TODO.md à la racine du projet -> workTime incrémenté.
#
# Second passage (après rechargement) : même service, sans redemander
# session/work (déjà en sdata).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'work-clock'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → 1re définition : durée de session puis durée de tranche (préremplie
    #   avec la session qui vient d'être saisie)
    wait_for('__session-duration__', 10)
    set_value('__session-duration__', '20')
    click('btn-oui')

    wait_for('__work-duration__', 10)
    prefill = get_value('__work-duration__')
    raise "work-duration pas préremplie avec la session (#{prefill.inspect})" unless prefill == '20'
    set_value('__work-duration__', '15')
    click('btn-oui')

    # → sdata enregistrée en tableau positionnel [session, work]
    wait_until(5, desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      read_project_card(id).dig('sdata', 'work-clock') == [20, 15]
    end

    # → l'horloge s'affiche, bouton Start visible
    wait_for('btn-clock-start', 10)

    # - Start
    click('btn-clock-start')
    wait_for('btn-clock-pause', 5)
    wait_for('btn-clock-stop', 5)

    # - Pause
    click('btn-clock-pause')
    wait_until(5, desc: -> { "texte bouton pause = #{get_text('btn-clock-pause').inspect}" }) do
      get_text('btn-clock-pause') == 'Restart'
    end

    # - Restart
    click('btn-clock-pause')
    wait_until(5, desc: -> { "texte bouton pause = #{get_text('btn-clock-pause').inspect}" }) do
      get_text('btn-clock-pause') == 'Pause'
    end

    # - Stop → changelog puis todo
    click('btn-clock-stop')
    wait_for('__clock_changelog__', 10)
    set_value('__clock_changelog__', 'Ecriture des tests de l’horloge.')
    click('btn-oui')

    wait_for('__clock_todo__', 10)
    set_value('__clock_todo__', 'Relire les tests')
    click('btn-oui')

    # → CHANGELOG.md / TODO.md créés à la racine du projet
    changelog_path = File.join(fixture_dir, 'CHANGELOG.md')
    todo_path      = File.join(fixture_dir, 'TODO.md')
    wait_until(10, desc: -> { "CHANGELOG.md existe ? #{File.exist?(changelog_path)}" }) { File.exist?(changelog_path) }
    wait_until(5,  desc: -> { "TODO.md existe ? #{File.exist?(todo_path)}" })         { File.exist?(todo_path) }

    changelog_content = File.read(changelog_path)
    raise "CHANGELOG.md sans titre '# Changelog' : #{changelog_content.inspect}" unless changelog_content.start_with?('# Changelog')
    raise "CHANGELOG.md sans le texte saisi : #{changelog_content.inspect}" unless changelog_content.include?('Ecriture des tests de l’horloge.')

    todo_content = File.read(todo_path)
    raise "TODO.md sans titre '# Todo list' : #{todo_content.inspect}" unless todo_content.start_with?('# Todo list')
    raise "TODO.md sans case à cocher '- [ ] ...' : #{todo_content.inspect}" unless todo_content.include?('- [ ] Relire les tests')

    # → horloge refermée, workTime enregistré (carte projet)
    wait_until(5, desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      read_project_card(id)['workTime'].is_a?(Integer)
    end

    # - recharger l'application : re-sélection, nouveau clic sur le service
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → cette fois, aucun dialogue de définition : l'horloge s'affiche direct
    wait_for('btn-clock-start', 10)
    raise 'dialogue de définition réapparu après rechargement' if exists?('__session-duration__')
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'horloge' : définition, Start/Pause/Restart/Stop, changelog+todo, rejeu") { run_test }
