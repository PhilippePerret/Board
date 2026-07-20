# Test : glissés de souris sur Stop et Close (mousedown ailleurs, mouseup
# sur le bouton) — Clock.js. Stop réagit à tout mouseup qui l'atteint, sans
# vérification de cible (on peut glisser jusqu'à lui) ; Close, plus
# prudent, exige que mousedown ET mouseup aient la même cible (un glissé qui
# se termine dessus, sans y avoir commencé, ne doit RIEN faire).
# Source : demande explicite (2026-07-20).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'work-clock'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(
      title: 'Projet A', path: fixture_dir,
      'common_services_data' => { 'work-clock' => [[20], [15]] }
    )
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)
    wait_for('clock-dial', 10)

    # - Start, pour amener l'horloge dans un état où Stop a un sens
    click('clock-dial')
    wait_for('btn-clock-stop', 5)

    # → glissé démarré sur les chiffres (aucune cible mémorisée pour
    #   Stop/Close), terminé sur Stop : doit déclencher Stop (mouseup sans
    #   vérification de cible)
    drag('clock-digits', 'btn-clock-stop')
    wait_for('__clock_changelog__', 10)
    click('btn-non') # on annule juste pour ne pas aller plus loin

    wait_until(5, desc: -> { '__clock_changelog__ encore présent après Annuler' }) { !exists?('__clock_changelog__') }
    raise "l'horloge a disparu après ce Stop (elle ne devrait être que mise en pause)" unless exists?('clock-dial')

    # → glissé démarré sur les chiffres, terminé sur Close : ne doit RIEN
    #   faire (mousedown de Close jamais posé -> cible mémorisée absente ->
    #   pas de close(), et la propagation vers le toggle du panneau est
    #   coupée aussi -> pas de start/pause non plus)
    drag('clock-digits', 'clock-close')
    sleep 0.5
    raise "l'horloge s'est fermée après un glissé (mousedown ailleurs) terminé sur Close" unless exists?('clock-dial')

    # → Close fonctionne normalement pour un vrai clic (mousedown ET
    #   mouseup sur lui)
    click('clock-close')
    wait_until(5, desc: -> { "clock-dial encore présent ? #{exists?('clock-dial')}" }) { !exists?('clock-dial') }
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'horloge' : glissés souris sur Stop (marche) et Close (ne marche pas)") { run_test }
