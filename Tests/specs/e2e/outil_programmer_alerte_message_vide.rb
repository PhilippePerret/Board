# Test : outil "Programmer une alerte", step 'string' (message) — valider
# avec un champ VIDE.
#
# ServStep#onPrompted (ScriptService.js) : `if (value === null) return
# this.setValue(':abort:')` — seul null (bouton Annuler/Renoncer) abandonne.
# Une chaîne vide "" n'est PAS null : elle avance normalement, comme
# n'importe quelle valeur (this.setValue("")). Le rappel est donc bien
# programmé, avec un message vide.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  datetime_str = (Time.now + 600).strftime('%H:%M')

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  # - step 'date-time', valeur correcte
  wait_for('__date-time__')
  set_value('__date-time__', datetime_str)
  click_suffix('btn-oui')

  # - step 'string', valeur VIDE
  wait_for('__message__')
  set_value('__message__', '')
  click_suffix('btn-oui')

  # → avance quand même : l'OKDialog final apparaît
  wait_for_suffix('btn-oui')

  # → le rappel a été programmé avec un message vide
  count = bridge_eval('String(Reminder.count)').to_i
  raise "1 Reminder attendu même avec un message vide, obtenu #{count}" unless count == 1
  registered_message = bridge_eval('Reminder.asArray()[0].message')
  raise "message du Reminder attendu '' (vide), obtenu #{registered_message.inspect}" unless registered_message == ''

  click_suffix('btn-oui') # ferme l'OKDialog final
ensure
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("outil 'Programmer une alerte' : message vide n'abandonne pas, programme avec un message vide") { run_test }
