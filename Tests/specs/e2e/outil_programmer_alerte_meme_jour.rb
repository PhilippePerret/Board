# Test : outil "Programmer une alerte", date/heure AUJOURD'HUI (même jour).
#
# Reminder.js#register : App.saveReminders() est appelé INCONDITIONNELLEMENT
# ("on enregistre TOUJOURS le rappel... dans le cas où l'on doive
# redémarrer l'application") — même pour un rappel du jour même, il est
# donc persisté dans appdata.yaml['reminders'] (debounce 1s, App.js#saveData).
#
# Reminder.js#register : si PAS onOtherDay et PAS déjà this.running, appelle
# this.run() -> arme this.startRunningTimer (setTimeout aligné sur la
# PROCHAINE minute pleine, jusqu'à 60s d'attente avant que this.running
# passe réellement à true) — on vérifie ici l'armement immédiat, pas le
# passage effectif à running=true (trop long pour ce test, cf.
# reminder_affichage_reel_2_minutes.rb pour le test bout-en-bout marqué
# "long", exclu par défaut de la suite).

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  datetime_str = (Time.now + 600).strftime('%H:%M') # +10 min, aujourd'hui

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  wait_for('__date-time__')
  set_value('__date-time__', datetime_str)
  click_suffix('btn-oui')

  wait_for('__message__')
  set_value('__message__', 'Alerte du jour même')
  click_suffix('btn-oui')

  wait_for_suffix('btn-oui') # OKDialog final

  # → timer armé (this.run() appelé, pas onOtherDay)
  armed = bridge_eval('!!Reminder.startRunningTimer')
  raise 'le timer du Reminder devrait être armé (this.run() appelé) pour une alerte du jour même' unless armed == 'true'

  # → persisté quand même dans appdata.yaml (saveReminders inconditionnel)
  sleep 1.2 # laisser le debounce (App.js#saveData, 1000ms) écrire le fichier
  app_data = read_app_data
  reminders = app_data['reminders'] || []
  raise "le rappel du jour même devrait être persisté (saveReminders inconditionnel), obtenu #{reminders.inspect}" unless
    reminders.any? { |r| r['message'] == 'Alerte du jour même' }

  click_suffix('btn-oui') # ferme l'OKDialog final
ensure
  # Reminder.remove -> App.saveReminders -> setData(..., true) -> saveData
  # est debounced 1s (App.js) : nettoyage fait EXCLUSIVEMENT via l'app
  # vivante (jamais d'écriture directe d'appdata.yaml pendant que Board
  # tourne encore — c'est exactement la course déjà rencontrée cette
  # session sur projects-in), puis on laisse le temps au flush avant que
  # le test suivant ne tue Board.
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("outil 'Programmer une alerte' : date/heure aujourd'hui, timer armé, persisté quand même") { run_test }
