# Test : Tools.js#toolGitInit — parcours complet de définition d'un dépôt
# Github pour un projet (compte -> nom -> visibilité -> DESCRIPTION -> labels),
# vérifie que la description est demandée entre la visibilité et les labels,
# et bien transmise.
#
# Le dépôt cible (compte/nom fictifs) n'existe pas sur Github — check_remote_repo
# (réseau réel, lecture seule, `gh api repos/...` -> 404 attendu) déclenche
# donc la branche "à créer" (visibilité puis description demandées). Pour ne
# JAMAIS créer un vrai dépôt Github (pas de scope delete_repo sur le token,
# cf. git_init_creation_repo_distant.rb), Tools.execGitInitialisation est
# court-circuitée AVANT le test : elle capture ses arguments au lieu
# d'envoyer réellement 'init_for_project' au backend.

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

    # Court-circuite l'envoi réel au backend : capture visibilité/description/
    # labels au lieu de les envoyer (jamais de vrai `gh repo create`).
    bridge_eval(<<~JS)
      (function(){
        window.__capturedGitArgs = null
        Tools.execGitInitialisation = function(labels){
          window.__capturedGitArgs = {
              labels: labels
            , visibility: this._gitInitVisibility
            , description: this._gitInitDescription
          }
        }
        Tools.toolGitInit()
        return ''
      })()
    JS

    account = 'board-test-nonexistent-account-xyz'
    name    = "test-repo-#{Time.now.to_i}"

    wait_for('__github-account__', 5)
    set_value('__github-account__', account)
    click_suffix('btn-oui')

    wait_for('__github-name__', 5)
    set_value('__github-name__', name)
    click_suffix('btn-oui')

    # -> vérification réseau réelle (lecture seule, gh api repos/…) du dépôt
    #    fictif : 404 attendu -> branche "à créer" -> dialogue de visibilité
    wait_for_suffix('btn-oui', 15)
    click_suffix('btn-oui') # "Private"

    # -> description, entre visibilité et labels
    wait_for('__github-repo-description__', 5)
    set_value('__github-repo-description__', 'Description de test')
    click_suffix('btn-oui')

    # -> labels (aucun sélectionné, cas valide — cf. commentaire execGitInitialisation)
    wait_for_suffix('btn-oui', 5)
    click_suffix('btn-oui')

    wait_until(5, desc: -> { "__capturedGitArgs = #{bridge_eval('JSON.stringify(window.__capturedGitArgs)')}" }) do
      bridge_eval('window.__capturedGitArgs ? "1" : ""') == '1'
    end

    captured = JSON.parse(bridge_eval('JSON.stringify(window.__capturedGitArgs)'))
    raise "visibilité attendue 'private', obtenu #{captured.inspect}" unless captured['visibility'] == 'private'
    raise "description attendue 'Description de test', obtenu #{captured.inspect}" unless captured['description'] == 'Description de test'
    raise "labels attendus vides, obtenu #{captured.inspect}" unless Array(captured['labels']).empty?
  end
ensure
  remove_fixture_project(id) if id
end

board_test("Tools.toolGitInit : la description du repo est demandée entre visibilité et labels, puis transmise") { run_test }
