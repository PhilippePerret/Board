# Test : lien "Aide" de l'entête (frontend/index.html #help-link) — ouvre
# une fenêtre native (HelpWindowController.swift), la referme, la rouvre.
# Le cycle fermeture -> réouverture est la régression exacte corrigée le
# 2026-07-19 (NSWindow créée sans NIB : isReleasedWhenClosed=true par
# défaut, fermer la fenêtre la libérait alors qu'une propriété Swift la
# référençait encore -> EXC_BAD_ACCESS au clic suivant).
# Source : demande explicite (2026-07-19).

require_relative '../../support/helpers'

include BoardTest

# Constaté (logs + diagnostic live) : ni le dispatch manuel
# mousedown+mouseup+click de click() (helpers.rb) ni .click() natif
# n'ouvrent la fenêtre "Aide", bien que l'élément et son listener soient
# sains. Cause exacte non identifiée — LOGS (window.LOGS, cf. logize()
# dans App.js/Aide.js) ajouté au diagnostic pour déterminer si le
# listener est seulement invoqué sans effet, ou jamais invoqué du tout.
def click_help_link
  bridge_eval(<<~JS)
    document.getElementById('help-link').click();
    '';
  JS
end

def run_test
  launch_app

  base_count = board_window_count

  # Nécessaire : le clic échoue silencieusement (listener jamais invoqué)
  # tant que le cycle App.init() n'est pas allé jusqu'au bout (backup
  # compris, cf. App.js#_afterAppBackup) — confirmé empiriquement.
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }
  click_help_link
  wait_until(desc: -> { "nombre de fenêtres Board = #{board_window_count} — LOGS = #{bridge_eval('JSON.stringify(window.LOGS || [])')}" }) { board_window_count == base_count + 1 }

  raise 'fermeture de la fenêtre "Aide" échouée' unless close_board_window_named('Aide')
  wait_until(desc: -> { "nombre de fenêtres Board = #{board_window_count}" }) { board_window_count == base_count }

  # → réouverture après fermeture : ne doit pas planter (régression EXC_BAD_ACCESS)
  click_help_link
  wait_until(desc: -> { "nombre de fenêtres Board = #{board_window_count}" }) { board_window_count == base_count + 1 }
  raise 'Board a quitté après une réouverture du lien Aide' unless board_running?
ensure
  close_board_window_named('Aide') rescue nil
end

board_test('lien "Aide" : ouverture, fermeture, réouverture sans planter') { run_test }
