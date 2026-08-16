# Test : App.js#awakeReminders — un rappel d'un autre jour, persisté dans
# appdata.yaml['reminders'] (Reminder.js#register, saveReminders
# inconditionnel), est bien RECHARGÉ (Reminder.register re-appelé) au
# lancement suivant de l'app.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app
  # launch_app garantit seulement que le socket de test répond (page
  # chargée), pas que App.init() a fini (App.data assigné, Reminder.init()
  # tourné) — sans cette attente, Reminder.register() plus bas peut
  # s'exécuter trop tôt : soit il plante (this.remindedTasks undefined),
  # soit App.setData('reminders',...) no-op silencieusement (garde
  # `if (!this.data) return`, App.js) et rien n'est persisté.
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  tomorrow_iso = (Time.now + 24 * 3600).strftime('%Y-%m-%dT%H:%M:%S')
  bridge_eval(<<~JS)
    (function(){
      Reminder.register({ time: new Date(#{tomorrow_iso.to_json}), message: 'persisté autre jour' });
      return '';
    })()
  JS
  sleep 1.2 # debounce App.js#saveData avant de tuer/relancer Board

  launch_app # App.init -> awakeReminders() relit appdata.yaml['reminders']
  # Même attente qu'au premier launch_app : sans elle, la lecture de
  # Reminder.count juste après peut arriver AVANT que awakeReminders() (donc
  # le rechargement depuis le disque) n'ait tourné.
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  # String(...) : un bridge_eval numérique nu peut renvoyer un résultat vide
  # côté Swift, masqué en 0 par .to_i sans rapport avec l'état réel.
  count = bridge_eval('String(Reminder.count)').to_i
  raise "1 Reminder attendu après rechargement, obtenu #{count}" unless count == 1
  message = bridge_eval('Reminder.asArray()[0].message')
  raise "message attendu 'persisté autre jour', obtenu #{message.inspect}" unless message == 'persisté autre jour'
ensure
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("App.awakeReminders : rappel d'un autre jour rechargé après relance") { run_test }
