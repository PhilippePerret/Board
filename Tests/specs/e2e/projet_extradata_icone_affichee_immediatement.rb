# Test : après sélection d'une icône via le panneau extra-data, la carte du
# projet doit l'afficher tout de suite (sans rechargement).
# Bug signalé : _dev/Manuel/adocs/_TODO_.adoc, "Quand on choisit une icône,
# elle devrait s'afficher tout de suite."
#
# Cause (ProjectExtraData.js#apply, case 'icon') : `this.divTitle` est lu sur
# le ProjectExtraDataPanel (qui n'a pas cette propriété — seul Project.js
# en a une, Project.js:424) au lieu de `this.project.divTitle`. `undefined`
# passé à insertBefore équivaut à un appendChild : l'image est ajoutée en
# toute fin de carte au lieu d'être placée juste avant le titre (ordre normal
# de Project.js#buildCard, qui insère l'icône avant le titre).

require_relative '../../support/helpers'
require 'tmpdir'
require 'fileutils'

include BoardTest

def run_test
  # → realpath : macOS résout /var en /private/var, la sélection Finder
  #   renvoie le chemin résolu, le transformer (Project.path + '/') ne
  #   matcherait pas sinon (cf. attribution_service_ouvrir_fichier_nom_explicite.rb).
  project_dir = File.realpath(Dir.mktmpdir('board-test-icon-'))
  icon_path = File.join(project_dir, 'icon.svg')
  File.write(icon_path, '<svg xmlns="http://www.w3.org/2000/svg"></svg>')

  project_id = create_fixture_project(title: 'Projet Icone', path: project_dir)
  launch_app

  card = "project-#{project_id}"
  wait_for(card)
  click(card)

  wait_for('btn-deal-project-extradata')
  click('btn-deal-project-extradata')
  wait_for('projet-extradata-panel')

  click('project-extradata-icon')
  wait_for('btn-oui')

  with_finder_selection(icon_path) do
    click('btn-oui')
  end

  wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
    read_project_card(project_id)['icon'] == 'icon.svg'
  end

  icon_before_title = bridge_eval(<<~JS) == 'true'
    (function(){
      var title = document.getElementById('#{card}-title');
      var prev = title && title.previousElementSibling;
      return !!(prev && prev.tagName === 'IMG' && prev.src.indexOf('icon.svg') !== -1);
    })()
  JS
  raise "icône pas affichée tout de suite (pas insérée avant le titre) dans la carte" unless icon_before_title
ensure
  remove_fixture_project(project_id) if project_id
  FileUtils.remove_entry(project_dir) if project_dir
end

board_test('panneau extra-data : icône choisie affichée tout de suite sur la carte') { run_test }
