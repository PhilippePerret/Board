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

  card1 = "project-#{id1}"
  card2 = "project-#{id2}"
  card3 = "project-#{id3}"

  # - sélectionner le second projet
  wait_for(card2)
  click(card2)

  # → les boutons projets s'affichent
  wait_until(desc: -> { 'btn-remove-project pas apparu après sélection' }) { exists?('btn-remove-project') }

  # - le déplacer à gauche (flèche "←")
  click('btn-move-project-to-left')

  # → la carte doit avoir bougé dans la fenêtre tout de suite (réordonnancement
  #   DOM synchrone au click, pas lié au débounce de sauvegarde)
  wait_until(desc: -> { "ordre affiché = #{order_of(card1, card2, card3).inspect}" }) do
    order_of(card1, card2, card3) == [card2, card1, card3]
  end

  # - attendre un peu (débounce)
  sleep 1

  # - la donnée 'projects-in' de appdata.json doit avoir été actualisée (projet bougé en premier)
  wait_until(desc: -> { "projects-in = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id2, id1, id3]
  end

  # - le déplacer deux fois à droite (flèche "→" x 2)
  click('btn-move-project-to-right')
  click('btn-move-project-to-right')

  # - attendre un peu (débounce)
  sleep 1

  # - la donnée 'projects-in' de appdata.json doit avoir été actualisée (projet bougé en 3e)
  wait_until(desc: -> { "projects-in = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id1, id3, id2]
  end

  # - recharger l'application
  launch_app

  # → le projet doit bien être en 3e position, à la fois dans les données...
  wait_until(desc: -> { "projects-in après rechargement = #{read_app_data['projects-in'].inspect}" }) do
    read_app_data['projects-in'] == [id1, id3, id2]
  end

  # ... et affiché dans la fenêtre (l'ordre au rechargement dépend de la
  # lecture d'appdata.json, pas d'un état DOM qui aurait survécu au restart)
  wait_until(desc: -> { "ordre affiché après rechargement = #{order_of(card1, card2, card3).inspect}" }) do
    order_of(card1, card2, card3) == [card1, card3, card2]
  end
ensure
  [id1, id2, id3].each { |id| remove_fixture_project(id) if id }
end

board_test('déplacement du projet') { run_test }
