# Test : bouton d'aide contextuel inline (Aide.link/aide(), frontend/js/
# Aide.js) — ex. à côté du libellé du service personnalisé
# "run-script-service" (ServiceData.js: aide('scripts-services')). Rendu en
# HTML réel dans le libellé du bouton de service (DCreate met `text:` en
# innerHTML, frontend/js/Dom.js), pas de simple texte : un vrai <button
# class="aide"> cliquable, sans id propre (repéré par sélecteur CSS).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section F point 20). lien_aide.rb ne couvre que le lien générique
# "#help-link" du header, jamais ces boutons d'aide contextuels.
#
# Même mécanique native que lien_aide.rb (Aide.open -> postMessage
# 'openHelp' -> HelpWindowController.swift) : vérifiée par comptage de
# fenêtres Board, pas de dépendance à un id de fenêtre spécifique à l'ancre.

require_relative '../../support/helpers'

include BoardTest

def click_aide_button(selector)
  bridge_eval(<<~JS)
    (function(){
      var btn = document.querySelector(#{selector.to_json});
      if (!btn) throw new Error('bouton aide introuvable: ' + #{selector.to_json});
      ['mousedown','mouseup','click'].forEach(function(type){
        btn.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, view:window}));
      });
      return '';
    })()
  JS
end

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for('common-services-panel-toggle')
    click('common-services-panel-toggle')
    wait_for('run-script-service')

    selector = '#run-script-service button.aide[data-anchor="scripts-services"]'
    raise "bouton d'aide contextuel introuvable (#{selector})" if
      bridge_eval("!!document.querySelector(#{selector.to_json})") != 'true'

    base_count = board_window_count
    click_aide_button(selector)
    wait_until(desc: -> { "nombre de fenêtres Board = #{board_window_count}" }) { board_window_count == base_count + 1 }
    raise "fermeture de la fenêtre d'aide échouée" unless close_board_window_named('Aide')
    wait_until(desc: -> { "nombre de fenêtres Board = #{board_window_count}" }) { board_window_count == base_count }
  end
ensure
  close_board_window_named('Aide') rescue nil
  remove_fixture_project(id) if id
end

board_test("aide contextuelle inline : bouton '?' à côté d'un libellé de service ouvre la fenêtre d'aide") { run_test }
