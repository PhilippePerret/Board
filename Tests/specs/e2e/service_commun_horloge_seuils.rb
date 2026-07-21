# @long — ~1 minute d'attente réelle, exclu par défaut (cf. Tests/version-pont/run_tests.sh, flag --long)
#
# Test : service commun "work-clock" — seuils d'alerte (orange à 10 min de
# l'échéance, rouge à l'échéance).
# Source : demande explicite (2026-07-13), suite à la revue de l'UI horloge.
#
# Durée de tranche réglée à 1 minute (minimum pratique) pour que le seuil
# "orange" soit déjà franchi dès le 1er tick après Start (remaining=60s <=
# 600s) — pas de fast-forward possible côté test (pas d'API d'évaluation JS
# dans l'infra AX), donc le seuil "rouge" (remaining<=0) est attendu en
# temps réel, ~1 minute après Start : cette spec est donc plus lente que les
# autres (timeout large sur ce wait_until, volontairement).
#
# La couleur elle-même (classes CSS clock-warning/clock-danger) n'est pas
# lisible depuis l'AX (pas d'accès aux classes CSS) : Clock.js expose donc
# un marqueur texte dédié aux tests, #clock-state-marker
# ('normal'/'warning'/'danger'), invisible mais présent dans l'arbre AX.
#
# La mise au premier plan de Board à l'échéance (Clock.js#alertForeground)
# a été retirée du code (2026-07-15, plantage app) : plus rien à vérifier
# de ce côté-là dans cette spec.

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'work-clock'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → durée de session puis durée de tranche : 1 minute pour les deux
    wait_for('__session-duration__', 10)
    set_value('__session-duration__', '1')
    click('btn-oui')

    wait_for('__work-duration__', 10)
    set_value('__work-duration__', '1')
    click('btn-oui')

    wait_for('clock-dial', 10)

    # - Start
    click('clock-dial')

    # → seuil orange : franchi dès le 1er tick (tranche de 60s <= 600s)
    wait_until(5, desc: -> { "marqueur d'état = #{get_text('clock-state-marker').inspect}" }) do
      get_text('clock-state-marker') == 'warning'
    end

    # → seuil rouge : atteint ~1 minute après Start (temps réel, pas de
    #   fast-forward possible)
    wait_until(70, desc: -> { "marqueur d'état = #{get_text('clock-state-marker').inspect}" }) do
      get_text('clock-state-marker') == 'danger'
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'horloge' : seuils d'alerte orange/rouge") { run_test }
