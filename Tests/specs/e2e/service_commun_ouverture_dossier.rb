# Test : service commun "open-folder-project" ("Ouvrir dossier du projet")
# Source : demande explicite (2026-07-12).
#
# Le projet connaît déjà son dossier (obligatoire à sa création) : le service
# commun ne demande donc PAS de sélectionner quoi que ce soit dans le Finder,
# juste de positionner/dimensionner une fenêtre Finder quelconque (au premier
# plan au moment de valider) pour en récupérer le bounds — cf.
# Puis de définir la taille de la sidebar (à 0 par défaut, donc non visible)
# frontend/js/ServiceData.js (COMMON_SERVICES_DATA, param "window-bounds",
# type "finder-window") et frontend/js/ServiceDefiner.js#onDefined, case
# 'finder-window'.
#
# Déroulé attendu :
#   - sélection du projet → le panneau des services communs s'ouvre seul
#     (Project.js#affProjectButtons -> Service.showCommonPanel)
#   - clic sur "Ouvrir dossier du projet"
#   - dialogue de positionnement de fenêtre Finder → une VRAIE fenêtre est
#     ouverte et réglée au bounds voulu (with_finder_window, pas un simple
#     reveal/select : le backend a besoin d'une fenêtre réelle, avec un
#     bounds réel, pas juste d'un élément sélectionné) → OK
#   - dialogue de taille de sidebar (3e param, "sidebar", type "integer",
#     défaut 0) → OK (valeur par défaut acceptée)
#   → le dossier du projet doit s'ouvrir dans le Finder
#   - rechargement de l'app, re-sélection du projet, nouveau clic sur le
#     service
#   → le dossier doit s'ouvrir directement, sans plus rien redemander
#     (bounds + sidebar déjà enregistrés côté projet)

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-folder-project'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    expected_name = File.basename(fixture_dir)

    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → dialogue de positionnement (finder-window) : ouvre une VRAIE fenêtre
    #   Finder ciblée sur fixture_dir (pas un reveal), avec un bounds réel à
    #   lire. Le clic sur OK ne fait que lancer un aller-retour ASYNCHRONE
    #   (bridge -> backend -> getInfoFinderWindow.scpt, qui a besoin de
    #   cette fenêtre au premier plan) : la refermer trop tôt la fermerait
    #   AVANT que l'aller-retour soit terminé -> AppleScript échoue (pas de
    #   front window) -> erreur JS silencieuse côté ServiceDefiner ->
    #   exec-service jamais appelé. On garde donc la fenêtre ouverte jusqu'à
    #   l'apparition du dialogue suivant (sidebar), preuve que l'aller-retour
    #   est bien terminé.
    wait_for_suffix('btn-oui')
    finder_activate
    sleep 0.3
    expected_window_name = finder_open_window(Dir.home)
    sleep 0.3
    finder_set_front_window_bounds(100, 100, 400, 300)
    sleep 3
    sleep 0.3
    click_suffix('btn-oui')

    # → dialogue de taille de la sidebar (nouveau 3e param, valeur par défaut acceptée)
    wait_for('__sidebar__')
    finder_close_front_window_if_named(expected_window_name)
    sleep 0.3
    click_suffix('btn-oui')

    # → le dossier du projet doit s'ouvrir dans le Finder (activation Finder +
    #   "delay 1" du script AppleScript lui-même + overhead System Events :
    #   4s par défaut trop juste, déjà vu en timeout alors que la fenêtre
    #   finissait par apparaître)
    wait_until(8, desc: -> { "nom de la fenêtre Finder au premier plan = #{(finder_front_window_name rescue '(erreur)').inspect} (attendu #{expected_name.inspect})" }) do
      finder_front_window_name == expected_name
    end

    # → le service doit avoir réussi côté backend, pas planté en silence
    #   après avoir ouvert la fenêtre (cf. #message qui affiche "undefined"
    #   quand exec-service échoue — xbridge.js#error appelé sans
    #   response.error exploitable, exec_script rescue Exception dans
    #   backend/lib/usefull.rb)
    assert_service_message_ok!

    # Ferme SEULEMENT la fenêtre ouverte par ce test (par son nom), jamais
    # toutes les fenêtres Finder — un balayage total fermerait aussi les
    # fenêtres Finder ouvertes par ailleurs sur cette machine, sans les
    # rouvrir ensuite.
    finder_close_front_window_if_named(expected_name)

    # - recharger l'application
    launch_app
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    # → cette fois le dossier doit s'ouvrir directement, sans redemander
    click_service_and_wait_folder(SERVICE_DOM_ID, fixture_dir)
    assert_service_message_ok!
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'ouvrir dossier du projet' : définition du bounds de la fenêtre au premier clic, exécution directe ensuite") { run_test }
