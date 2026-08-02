# Test : outil "Programmer une alerte", date/heure un AUTRE jour (demain).
#
# Reminder.js#get onOtherDay : this.time > DateUtils.endOfDay() -> true pour
# une date de demain. register() : App.saveReminders() toujours appelé
# (persisté), mais this.run() N'EST PAS appelé (onOtherDay true) -> le
# timer de poll ne doit pas être armé.
#
# Format "JJ MM HH:MM" (Validator-fr.js, REG_DATETIME_JJ_MM_HH_MM) : mois
# sur 2 chiffres obligatoire. Ne gère pas le cas "demain = 1er janvier"
# (changement d'année, DateUtils#year reste l'année courante) — cas limite
# non couvert ici.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  tomorrow = Time.now + 24 * 3600
  datetime_str = format('%d %02d %02d:%02d', tomorrow.day, tomorrow.month, tomorrow.hour, tomorrow.min)

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  wait_for('__date-time__')
  set_value('__date-time__', datetime_str)
  click_suffix('btn-oui')

  wait_for('__message__')
  set_value('__message__', 'Alerte de demain')
  click_suffix('btn-oui')

  wait_for_suffix('btn-oui') # OKDialog final

  armed = bridge_eval('!!Reminder.startRunningTimer')
  raise "le timer ne devrait PAS être armé pour une alerte d'un autre jour, obtenu armed=#{armed}" if armed == 'true'

  running = bridge_eval('!!Reminder.running')
  raise "Reminder.running devrait rester false pour une alerte d'un autre jour, obtenu #{running}" if running == 'true'

  sleep 1.2 # debounce App.js#saveData
  app_data = read_app_data
  reminders = app_data['reminders'] || []
  raise "le rappel d'un autre jour devrait être persisté, obtenu #{reminders.inspect}" unless
    reminders.any? { |r| r['message'] == 'Alerte de demain' }

  click_suffix('btn-oui') # ferme l'OKDialog final
ensure
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("outil 'Programmer une alerte' : date/heure d'un autre jour, persisté, timer non armé") { run_test }
