# Test : basculer entre le panneau des services communs et celui des
# services personnalisés (bouton "Services communs"/"Services personnalisés")
# doit ouvrir l'autre panneau À LA MÊME POSITION que celui qu'il remplace
# (position posée par Draggable, cf. SidePanel#toggleOpposites).
# Source : demande explicite (2026-07-31).

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

    # - on simule un déplacement (pas besoin d'un vrai glissé écran ici :
    #   le comportement testé est la synchronisation de position, pas le
    #   glissé lui-même, déjà couvert ailleurs — Clock notamment)
    bridge_eval("document.getElementById('common-services-panel').style.left='123px'")
    bridge_eval("document.getElementById('common-services-panel').style.top='45px'")

    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')

    # → le panneau personnalisé apparaît exactement là où était le commun
    wait_for('custom-services-panel')
    raise "custom-services-panel pas à la position du commun (left)" unless
      bridge_eval("document.getElementById('custom-services-panel').style.left") == '123px'
    raise "custom-services-panel pas à la position du commun (top)" unless
      bridge_eval("document.getElementById('custom-services-panel').style.top") == '45px'

    # - même vérification dans l'autre sens
    bridge_eval("document.getElementById('custom-services-panel').style.left='222px'")
    bridge_eval("document.getElementById('custom-services-panel').style.top='77px'")

    wait_for('custom-services-panel-toggle')
    click('custom-services-panel-toggle')

    wait_for('common-services-panel')
    raise "common-services-panel pas à la position du personnalisé (left)" unless
      bridge_eval("document.getElementById('common-services-panel').style.left") == '222px'
    raise "common-services-panel pas à la position du personnalisé (top)" unless
      bridge_eval("document.getElementById('common-services-panel').style.top") == '77px'
  end
ensure
  remove_fixture_project(id) if id
end

board_test("bascule services communs <-> personnalisés : conserve la position du panneau") { run_test }
