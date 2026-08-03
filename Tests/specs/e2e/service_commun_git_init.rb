# Test : service commun "git-init" (Initier git pour le projet,
# frontend/js/ServiceData.js + backend/scripts/GitInit.rb).
#
# Aucun accès réseau réel à GitHub : le remote est redirigé vers un dépôt
# bare LOCAL (Tests/support/git_e2e_stub.rb, GITHUB_ACCOUNT/BOARD_TEST_GIT_REMOTE
# + APP_BOARD_TESTS_RUNNING posé par run_tests.sh). `git push` s'exécute
# réellement, juste vers ce dépôt local — preuve du succès : le commit est
# bien visible DANS le dépôt bare, pas seulement "le script n'a pas plané".

require_relative '../../support/helpers'
require_relative '../../support/git_e2e_stub'

include BoardTest

SERVICE_DOM_ID = 'git-init'

def run_test
  id = nil
  with_git_e2e_stub do |bare_repo|
    Dir.mktmpdir('board-test-project-') do |fixture_dir|
      id = create_fixture_project(title: 'Projet A', path: fixture_dir)
      launch_app

      card = "project-#{id}"
      wait_for(card)
      click(card)

      wait_for(SERVICE_DOM_ID)
      click(SERVICE_DOM_ID)

      # → premier clic : rien de persisté, tout est demandé (github_account
      #   via if_undefined, puis github_name)
      wait_for('__github_account__')
      set_value('__github_account__', 'un-compte-github')
      click_suffix('btn-oui')

      wait_for('__github_name__')
      set_value('__github_name__', 'un-nom-de-repo')
      click_suffix('btn-oui')

      # → arborescence git créée
      wait_until(desc: -> { ".git existe ? #{File.exist?(File.join(fixture_dir, '.git'))}" }) do
        File.exist?(File.join(fixture_dir, '.git'))
      end

      gitignore_path = File.join(fixture_dir, '.gitignore')
      raise ".gitignore pas créé" unless File.exist?(gitignore_path)
      gitignore_content = File.read(gitignore_path)
      raise ".gitignore sans .DS_Store : #{gitignore_content.inspect}" unless gitignore_content.include?('.DS_Store')

      # → preuve que le push a réellement atteint le dépôt bare (pas juste
      #   "le script n'a pas levé d'erreur")
      wait_until(desc: -> { "dernier commit du dépôt bare = #{git_bare_repo_last_commit_message(bare_repo).inspect}" }) do
        git_bare_repo_last_commit_message(bare_repo) == 'first commit'
      end

      # → common_services_data enregistrée (les 3 params, groupés)
      wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
        common_services_data = read_project_card(id).dig('common_services_data', 'git-init')
        common_services_data.is_a?(Array) &&
          common_services_data[1] == ['un-compte-github'] &&
          common_services_data[2] == ['un-nom-de-repo']
      end
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'git-init' : initialise le dépôt, gitignore, premier commit poussé") { run_test }
