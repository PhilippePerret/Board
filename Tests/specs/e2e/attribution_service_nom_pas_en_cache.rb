# Test : le nom personnalisé donné à un service commun glissé sur un projet
# ne doit pas "fuiter" sur le glissé suivant du MÊME service abstrait sur un
# AUTRE projet.
# Source : Tests/_tests_a_faire.adoc, "[BUG] ... je glisse le service commun
# 'iTerm au dossier' sur le projet B → BUG c'est le nom 'iTerm Claude' qui
# apparaît (donc mis en cache avant.)".
#
# Mécanisme (frontend/js/ServicePanel.js#buildContent, frontend/js/Service.js,
# frontend/js/ServiceDefiner.js) : les boutons du panneau sont des instances
# Service UNIQUES construites une seule fois par session, sur le MÊME objet
# `data` que celui de COMMON_SERVICES_DATA/CUSTOM_SERVICES_DATA (pas de
# copie). ServiceDefiner#onDefined fait `this.service.data.name =
# definer.value` — si ce n'est pas fait sur une copie, ça mute
# irrémédiablement le nom par défaut de CE service abstrait pour tout le
# reste de la session, y compris son prochain glissé sur un AUTRE projet.
#
# Utilise 'open-terminal-at-folder' (service commun, groupe 'Consoles') —
# même mécanisme que le "iTerm au dossier" du .adoc, sans dépendre d'iTerm.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'open-terminal-at-folder'
DEFAULT_NAME   = 'Terminal au dossier' # frontend/js/ServiceData.js
CUSTOM_NAME_A  = 'Terminal Claude'

def run_test
  id_a = nil
  id_b = nil
  Dir.mktmpdir('board-test-project-a-') do |dir_a|
    Dir.mktmpdir('board-test-project-b-') do |dir_b|
      id_a = create_fixture_project(title: 'Projet A', path: dir_a)
      id_b = create_fixture_project(title: 'Projet B', path: dir_b)
      launch_app

      card_a = "project-#{id_a}"
      card_b = "project-#{id_b}"
      others_field_a = "project-#{id_a}-others-field"

      # - glisser "Terminal au dossier" sur le projet A, avec un nom personnalisé
      wait_for(card_a)
      click(card_a)
      wait_for(SERVICE_DOM_ID)
      drag(SERVICE_DOM_ID, others_field_a)

      wait_for('__service-name__')
      set_value('__service-name__', CUSTOM_NAME_A)
      click('btn-oui')

      wait_for('__code__')
      set_value('__code__', 'ls')
      click('btn-oui')

      # → le service doit être attaché au projet A avec le nom personnalisé
      wait_until(desc: -> { "carte projet A = #{read_project_card(id_a).inspect}" }) do
        list = read_project_card(id_a)['services']['others']
        list.is_a?(Array) && list.any? { |s| s['name'] == CUSTOM_NAME_A }
      end

      # - glisser le MÊME service abstrait sur le projet B
      wait_for(card_b)
      click(card_b)
      wait_for(SERVICE_DOM_ID)
      drag(SERVICE_DOM_ID, "project-#{id_b}-others-field")

      # → le nom proposé par défaut doit être celui d'origine, PAS celui
      #   personnalisé donné pour le projet A
      wait_for('__service-name__')
      wait_until(desc: -> { "nom prérempli = #{get_value('__service-name__').inspect}" }) do
        get_value('__service-name__') == DEFAULT_NAME
      end
      click('btn-non')
    end
  end
ensure
  remove_fixture_project(id_a) if id_a
  remove_fixture_project(id_b) if id_b
end

board_test("le nom personnalisé d'un service commun glissé sur un projet ne reste pas en cache pour le glissé suivant sur un autre projet") { run_test }
