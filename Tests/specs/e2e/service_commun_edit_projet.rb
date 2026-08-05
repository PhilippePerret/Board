# Test : service commun "edit-projet" ("Éditer les données du projet",
# groupe "Prudence") — édition directe du fichier YAML de la carte projet.
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section A point 2).
#
# Service à un seul paramètre (card_path, type 'project', résolu
# silencieusement — Project#card_path se calcule tout seul si absent,
# frontend/js/Project.js). Un `bypassExec` affiche un avertissement
# ("Attention, données sensibles…") puis attend 3s avant d'exécuter
# réellement backend/scripts/OpenAFile.rb, qui fait "open <card_path>"
# (ouvre le YAML avec l'app par défaut du système — non prédictible, donc
# non vérifiée ici, comme pour le choix "(par défaut)" des tests
# attribution_service_ouvrir_fichier_par_defaut.rb).
#
# Repérage des deux messages (avertissement puis succès) via le DIV
# .exergue-message éphémère (Messagerie.js#message(true, …)),
# jamais #message (footer) — cf. assert_service_message_ok!/exergue_message_text
# dans Tests/support/helpers_base.rb.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'edit-projet'

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

    # → avertissement immédiat, avant les 3s d'attente de bypassExec
    wait_until(desc: -> { "message en exergue = #{(exergue_message_text rescue '(erreur)').inspect}" }) do
      (exergue_message_text rescue '') =~ /données sensibles/i
    end

    # → après le délai, exécution réelle (le fichier s'ouvre dans l'app par
    #   défaut du système, non vérifiée ici)
    assert_service_message_ok!(timeout: 8)
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'éditer les données du projet' : avertissement puis exécution après délai") { run_test }
