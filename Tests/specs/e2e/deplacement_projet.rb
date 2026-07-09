# Test : déplacement du projet
# Source : Tests/_tests_a_faire.adoc
#
# Setup : fixture avec 3 projets, créés directement sur disque puis l'app
# relancée pour qu'elle recharge sa liste de projets, dans cet ordre.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id1 = create_fixture_project(title: 'Projet A')
  id2 = create_fixture_project(title: 'Projet B')
  id3 = create_fixture_project(title: 'Projet C')
  launch_app

  card2 = "project-#{id2}"

  # - sélectionner le second projet
  wait_for(card2)
  click(card2)

  # → les boutons projets s'affichent
  wait_until(5, desc: -> { 'btn-remove-project pas apparu après sélection' }) { exists?('btn-remove-project') }

  # - le déplacer à gauche (flèche "←")
  click('btn-move-project-to-left')

  # - attendre un peu (débounce)
  sleep 1

  # - la donnée 'projects-in' de appdata.json doit avoir été actualisée (projet bougé en premier)
  wait_until(5, desc: -> { "projects-in = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id2, id1, id3]
  end

  # - le déplacer deux fois à droite (flèche "→" x 2)
  click('btn-move-project-to-right')
  click('btn-move-project-to-right')

  # - attendre un peu (débounce)
  sleep 1

  # - la donnée 'projects-in' de appdata.json doit avoir été actualisée (projet bougé en 3e)
  wait_until(5, desc: -> { "projects-in = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id1, id3, id2]
  end

  # - recharger l'application
  launch_app

  # → le projet doit bien être en 3e position
  wait_until(5, desc: -> { "projects-in après rechargement = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id1, id3, id2]
  end
ensure
  [id1, id2, id3].each { |id| remove_fixture_project(id) if id }
end

board_test('déplacement du projet') { run_test }
