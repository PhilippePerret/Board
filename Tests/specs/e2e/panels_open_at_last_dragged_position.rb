# Test : BUG #1 (_dev/Manuel/adocs/_TODO_.adoc) — "les panneaux doivent
# tous s'ouvrir là où on a placé le dernier".
#
# "Panneaux" = les SidePanel (frontend/js/SidePanel.js) : panneau des
# services communs, personnalisés, et Outils (ToolsPanel) — les 3 seules
# sous-classes. toggle_panels_conserve_position.rb couvre déjà le cas
# commun<->personnalisé via SidePanel#toggleOpposites (déjà implémenté,
# copie explicite de position). Ce test couvre le cas NON couvert : un
# panneau QUELCONQUE (ici Outils), ouvert normalement (pas via le bouton
# bascule), doit apparaître à la position du DERNIER panneau déplacé,
# même si ce dernier était d'une autre famille (ici : services communs).
# Rien dans SidePanel#build/#open ne fait ça aujourd'hui (aucun stockage
# ni relecture de position en dehors de toggleOpposites) — censé échouer
# (TDD rouge) tant que non corrigé.
#
# Position simulée directement (bridge_eval), pas de vrai glissé écran :
# le comportement testé est la réutilisation de la position par un panneau
# différent, pas le glissé lui-même (déjà couvert ailleurs).

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre seul à la sélection
    wait_for('common-services-panel')

    # - on simule un déplacement du panneau de services
    bridge_eval("document.getElementById('common-services-panel').style.left='150px'")
    bridge_eval("document.getElementById('common-services-panel').style.top='60px'")

    # - ouverture du panneau Outils PENDANT que le panneau services est
    #   encore ouvert (comme un vrai switch — App.currentPanel doit encore
    #   pointer dessus au moment du clic, sinon la position ne peut pas
    #   être reprise)
    wait_for('tools-button')
    click('tools-button')

    wait_for('tools-panel')
    raise "panneau Outils pas à la position du dernier panneau déplacé (left)" unless
      bridge_eval("document.getElementById('tools-panel').style.left") == '150px'
    raise "panneau Outils pas à la position du dernier panneau déplacé (top)" unless
      bridge_eval("document.getElementById('tools-panel').style.top") == '60px'
  end
ensure
  remove_fixture_project(id) if id
end

board_test("BUG #1 : tous les panneaux s'ouvrent à la position du dernier déplacé (services -> outils)") { run_test }
