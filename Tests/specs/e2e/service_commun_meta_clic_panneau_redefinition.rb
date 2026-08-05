# Test : meta+clic sur le bouton d'un service COMMUN dans le panneau (pas
# encore une carte attachée à un projet) — Service#execCommonServiceOn :
#   if (ev?.metaKey) return this.defineCommonServiceParameters(projet)
# force la redéfinition même si le service est déjà défini pour ce projet
# (common_services_data[id] déjà présent), au lieu d'exécuter directement
# (ensureServiceData). Source : plan de tests
# Tests/_plan_tests_fonctionnalites.adoc (2026-08-05, section C point 14).
#
# DIFFÉRENT de la redéfinition d'un service ATTACHÉ (meta-clic sur une
# carte de service, Service#redefine, déjà couverte par
# redefinition_service_*.rb) : #redefine réinjecte les valeurs actuelles
# (`actual`) dans le schéma avant d'ouvrir le dialogue, #defineCommonServiceParameters
# NE LE FAIT PAS — le dialogue rouvert depuis le panneau est donc VIERGE,
# pas préreamplie avec la valeur en cache. C'est la distinction vérifiée ici
# (type 'integer', qui ne se résout jamais silencieusement, contrairement à
# 'project').

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-folder-project'

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

    # - 1re définition (clic normal) : sidebar = 5
    click(SERVICE_DOM_ID)
    wait_for_suffix('btn-oui')
    with_finder_window(fixture_dir) do
      click_suffix('btn-oui')
      wait_for_suffix('btn-oui')
    end
    wait_for('__sidebar__')
    set_value('__sidebar__', '5')
    click_suffix('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      stored = read_project_card(id).dig('common_services_data', SERVICE_DOM_ID)
      stored.is_a?(Array) && stored[1].is_a?(Array) && stored[1][4] == 5
    end

    # - meta+clic sur le MÊME bouton du panneau (service déjà défini) :
    #   redéfinition forcée, dialogue VIERGE (pas de "5" préreampli)
    meta_click(SERVICE_DOM_ID)
    wait_for_suffix('btn-oui')
    with_finder_window(fixture_dir) do
      click_suffix('btn-oui')
      wait_for_suffix('btn-oui')
    end
    wait_for('__sidebar__')
    raise "sidebar préreamplie avec la valeur en cache (#{get_value('__sidebar__').inspect}) alors que la redéfinition depuis le panneau ne doit PAS préreamplir" if
      get_value('__sidebar__') == '5'

    set_value('__sidebar__', '9')
    click_suffix('btn-oui')

    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      stored = read_project_card(id).dig('common_services_data', SERVICE_DOM_ID)
      stored.is_a?(Array) && stored[1].is_a?(Array) && stored[1][4] == 9
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("meta+clic sur un service commun du panneau : redéfinition forcée sans préremplissage") { run_test }
