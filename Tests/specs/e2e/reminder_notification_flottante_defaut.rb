# Test : notification flottante par défaut (Reminder SANS tâche liée —
# this.buttons/realButtons restent undefined -> Notifier applique ses 2
# boutons par défaut "C'est noté"/"Rappelle-moi plus tard", valeurs
# ':remove:'/':remindme:', frontend/js/Notifier.js:160-165). Ces valeurs
# reviennent du natif SANS onclick propre par bouton (Notifier#dataButtons
# reste vide pour ce cas — rempli seulement quand data.buttons est fourni
# explicitement, cf. Notifier.js:110-119, AVANT l'ajout des boutons par
# défaut) : elles retombent donc sur Reminder#onClickNotification
# (frontend/js/Reminder.js:271-286), jamais exercé par
# reminder_notifier_boutons_tache.rb (qui teste le cas AVEC tâche, onclick
# par bouton bindé directement sur Reminder.remove).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section G point 21).
#
# Appel direct de onClickNotification (comme
# reminder_notifier_boutons_tache.rb appelle realButtons[0].onclick()),
# pas d'interaction avec la vraie fenêtre de notification native.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var r = new Reminder({ time: new Date(Date.now() + 60000), message: 'test notification par défaut' });
      var hasRealButtons = !!(r.realButtons && r.realButtons.length);

      var timeBefore = r.time.getTime();
      r.onClickNotification(':remindme:');
      var deltaMinutes = Math.round((r.time.getTime() - timeBefore) / 60000);

      var countBeforeRemove = Reminder.count;
      r.onClickNotification(':remove:');
      var countAfterRemove = Reminder.count;

      return JSON.stringify({
          hasRealButtons: hasRealButtons
        , deltaMinutes: deltaMinutes
        , countBeforeRemove: countBeforeRemove
        , countAfterRemove: countAfterRemove
      });
    })()
  JS
  data = JSON.parse(result)

  raise "un rappel sans tâche ne devrait PAS avoir de boutons custom (realButtons), obtenu #{data.inspect}" if data['hasRealButtons']
  raise "':remindme:' devrait reporter le rappel de 10 minutes, obtenu #{data.inspect}" unless data['deltaMinutes'] == 10
  raise "':remove:' devrait retirer le rappel, obtenu #{data.inspect}" unless data['countAfterRemove'] == data['countBeforeRemove'] - 1
end

board_test("notification flottante par défaut : 'Rappelle-moi plus tard' reporte de 10 minutes, 'C'est noté' retire le rappel") { run_test }
