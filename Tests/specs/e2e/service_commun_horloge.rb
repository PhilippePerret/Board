# Test : service commun "work-clock" ("Démarrer l'horloge")
# Source : demande explicite (2026-07-12), UI horloge revue (2026-07-13),
# refonte poignées/boutons/listeners (2026-07-20).
#
# Déroulé : sélection projet -> clic "Démarrer l'horloge" -> 1re définition
# (durée de session puis durée de tranche, préremplie avec la session,
# ServiceDefiner#defineByType case 'integer') -> common_services_data['work-clock'] enregistrée
# en tableau positionnel [session, work] (PAS un objet nommé) -> horloge
# affichée (Clock.js) -> clic sur le rond (#clock-dial) = start -> pause ->
# restart -> bouton Stop séparé -> Stop enchaîne 2 TextareaDialog (changelog
# puis todo) -> backend 'update-project-notes' écrit CHANGELOG.md/TODO.md à
# la racine du projet -> workTime incrémenté.
#
# Second passage (après rechargement) : même service, sans redemander
# session/work (déjà en common_services_data) -> clic sur les chiffres (même
# bascule que le rond) -> le bouton service referme l'horloge si elle est
# déjà ouverte -> séquence Stop puis Annuler : l'horloge doit rester dans un
# état cohérent (pas de saut de temps absurde à la reprise — bug corrigé :
# onClickStop ne posait jamais pauseStart).

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

    # → common_services_data enregistrée groupée par param : [[session], [work]]
    wait_until(5, desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      read_project_card(id).dig('common_services_data', 'work-clock') == [[20], [15]]
    end

    # → l'horloge s'affiche, rond cliquable, bouton toggle déjà visible
    #   (start/pause/restart), bouton Stop pas encore visible
    wait_for('clock-dial', 10)
    wait_for('btn-clock-toggle', 5)
    raise 'bouton Stop visible avant démarrage' if visible?('btn-clock-stop')

    # - Start (clic sur le rond)
    click('clock-dial')
    wait_for('btn-clock-stop', 5)

    # - Pause (2e clic sur le rond)
    click('clock-dial')

    # - Restart (3e clic sur le rond)
    click('clock-dial')

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
    wait_for('clock-dial', 10)
    raise 'dialogue de définition réapparu après rechargement' if exists?('__session-duration__')

    # → clic sur les chiffres = même bascule que le rond (start)
    click('clock-digits')
    wait_for('btn-clock-stop', 5)

    # → le bouton du service referme l'horloge si elle est déjà ouverte
    click(SERVICE_DOM_ID)
    wait_until(5, desc: -> { "clock-dial encore visible ? #{visible?('clock-dial')}" }) { !visible?('clock-dial') }

    # → on la rouvre pour la suite (toujours pas de dialogue de définition)
    click(SERVICE_DOM_ID)
    wait_for('clock-dial', 10)

    # → séquence Start, Stop, Annuler : le temps affiché avant Stop et après
    #   reprise (clic sur le toggle) doit rester cohérent — pas de saut
    #   massif dû à pauseStart jamais posé par onClickStop (bug corrigé)
    click('clock-digits')
    wait_for('btn-clock-stop', 5)
    sleep 1.5
    before_digits = get_text('clock-digits')
    raise "format de temps inattendu avant Stop : #{before_digits.inspect}" unless before_digits =~ /\A\d{2}:\d{2}\z/

    click('btn-clock-stop')
    wait_for('__clock_changelog__', 10)
    click('btn-non')
    wait_until(5, desc: -> { '__clock_changelog__ encore présent après Annuler' }) { !exists?('__clock_changelog__') }

    # → reprise : même bouton (toggle), doit reprendre là où c'était
    click('btn-clock-toggle')
    sleep 0.5
    after_digits = get_text('clock-digits')
    raise "temps absurde après reprise post-Annuler : #{after_digits.inspect}" unless after_digits =~ /\A\d{2}:\d{2}\z/

    to_seconds = ->(txt) { m, s = txt.split(':').map(&:to_i); m * 60 + s }
    delta = (to_seconds.call(before_digits) - to_seconds.call(after_digits)).abs
    raise "le temps n'a pas repris correctement (avant=#{before_digits}, après=#{after_digits})" if delta > 8
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'horloge' : définition, Start/Pause/Restart/Stop, changelog+todo, rejeu") { run_test }
