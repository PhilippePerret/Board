# Test : mécanisme `dynParams` générique — paramètres redemandés à CHAQUE
# exécution du service, distincts des params fixes définis une fois pour
# toutes à l'attribution (frontend/js/ServiceExecuter.js). Seul cas non-git
# actuel : `file-versioning`/`nature-version` (type 'select', patch/minor/
# major, backend/scripts/FileVersioning.rb).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section B point 11). redefinition_service_versionnage_fichier.rb ne
# couvre que la redéfinition des params FIXES (path, archive-folder),
# jamais l'exécution réelle ni le dynParam nature-version.
#
# Preuve du "redemandé à chaque fois" : le dialogue de sélection réapparaît
# à un DEUXIÈME clic sur le MÊME service déjà attaché (pas de dialogue au
# 1er clic sur un service fixe une fois défini => ici il réapparaît quand
# même), et un choix différent (minor puis major) produit un résultat
# différent — s'il était mis en cache, le 2e clic n'ouvrirait aucun
# dialogue et rejouerait aveuglément le premier choix.

require_relative '../../support/helpers'

include BoardTest

SERVICE_ID = 'file-versioning'
CUSTOM_NAME = 'Versionner mes notes'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    original_path = File.join(fixture_dir, 'notes-1.0.0.txt')
    File.write(original_path, 'contenu de test')
    launch_app

    card = "project-#{id}"
    others_field = "project-#{id}-others-field"

    wait_for(card)
    click(card)
    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')
    wait_for(SERVICE_ID)

    drag(SERVICE_ID, others_field)

    wait_for('__service-name__')
    set_value('__service-name__', CUSTOM_NAME)
    click_suffix('btn-oui')

    # → param fixe 'path' : sélection Finder
    wait_for_suffix('btn-oui')
    with_finder_selection(original_path) do
      click_suffix('btn-oui')
    end

    # → param fixe 'archive-folder' (path-or-null), 1re définition : "Aucun"
    wait_for_suffix('btn-non')
    click_suffix('btn-non')

    uuid = nil
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      list = read_project_card(id)['services']['others']
      found = list.is_a?(Array) && list.find { |s| Array(s['name']).include?(CUSTOM_NAME) }
      uuid = found['uuid'] if found
      !!found
    end
    service_card = "service-#{uuid}"

    # → 1er clic : dynParam nature-version demandé
    click(service_card)
    wait_for('__nature-version__', 8)
    set_value('__nature-version__', 'minor')
    click_suffix('btn-oui')

    minor_path = File.join(fixture_dir, 'notes-1.1.0.txt')
    wait_until(8, desc: -> { "#{minor_path} pas créé après bump minor (dossier = #{Dir.children(fixture_dir).inspect})" }) { File.exist?(minor_path) }
    raise "fichier d'origine encore présent après bump minor" if File.exist?(original_path)

    # → on remet un fichier à l'emplacement/nom d'origine (chemin toujours
    #   celui enregistré dans le param fixe du service) pour un 2e cycle
    File.write(original_path, 'contenu de test')

    # → 2e clic : le dialogue doit RÉAPPARAÎTRE (pas mis en cache) ; choix
    #   différent (major) -> résultat différent
    click(service_card)
    wait_for('__nature-version__', 8)
    set_value('__nature-version__', 'major')
    click_suffix('btn-oui')

    major_path = File.join(fixture_dir, 'notes-2.0.0.txt')
    wait_until(8, desc: -> { "#{major_path} pas créé après bump major (dossier = #{Dir.children(fixture_dir).inspect})" }) { File.exist?(major_path) }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("mécanisme dynParams : nature-version (file-versioning) redemandé à chaque exécution") { run_test }
