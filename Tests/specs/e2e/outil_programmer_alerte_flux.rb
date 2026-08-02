# Test : outil "Programmer une alerte" (ToolsData.js id 'alerte', joué comme
# script-service par Tools.js#execAsScriptService) — flux complet :
# date/heure -> message -> confirmation -> fermeture par clic sur OK.
#
# ServStep.exec() délègue à Prompter.prompt(spec, callback) (Prompter.js) :
# chaque step ouvre une TextFieldDialog avec un id EXPLICITE = l'id du step
# (spec.id = this.id, promptDateTime/promptString) -> __date-time__ et
# __message__ (pas de panel-N auto-généré, contrairement à l'ancien
# ScriptService.js#execDateTime/execString retiré).
#
# 'schedule' (alert) et 'conclusion' (set) sont synchrones (pas de dialogue) :
# après validation du message, on passe direct à l'OKDialog final
# (ScriptService.js#execNextStep, "Fin des opérations").
#
# bridge_eval sur une expression NUE renvoyant un nombre (ex. 'Reminder.count')
# peut renvoyer un résultat vide côté Swift (TestBridge.swift:73-81 : le "else
# if let r = result" ne couvre que les cas non nil ; un résultat nil tombe
# dans la branche `resultText = ""`) -> Ruby `.to_i` sur "" vaut 0 en
# silence, sans rapport avec l'état réel. Toujours passer par
# String(...)/JSON.stringify côté JS, jamais une expression numérique nue
# (convention déjà suivie partout ailleurs dans Tests/specs/e2e/).

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  datetime_str = (Time.now + 600).strftime('%H:%M') # +10 min, aujourd'hui
  message_str  = 'Message de test alerte'

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  # - step 'date-time'
  wait_for('__date-time__')
  set_value('__date-time__', datetime_str)
  click_suffix('btn-oui')

  # - step 'string' (message)
  wait_for('__message__')
  set_value('__message__', message_str)
  click_suffix('btn-oui')

  # → 'schedule' (alert) et 'conclusion' (set) sont synchrones : l'OKDialog
  #   final apparaît directement.
  wait_for_suffix('btn-oui')
  conclusion_text = bridge_eval("document.querySelector('.overlay:not(.hidden) .message')?.textContent || ''")
  expected = 'Alerte programmée avec succès.' # MES_MESSAGES.js, 'tools-confirm-scheduling-alert'
  raise "message de confirmation attendu #{expected.inspect}, obtenu #{conclusion_text.inspect}" unless conclusion_text.include?(expected)

  # → le rappel a bien été enregistré en mémoire, avec le bon message
  count = bridge_eval('String(Reminder.count)').to_i
  raise "1 seul Reminder attendu après l'outil, obtenu #{count}" unless count == 1
  registered_message = bridge_eval('Reminder.asArray()[0].message')
  raise "message du Reminder attendu #{message_str.inspect}, obtenu #{registered_message.inspect}" unless registered_message == message_str

  # - fermeture par clic sur OK (pas Enter : cf. dialog_enter_appelle_onclick_une_fois.rb)
  click_suffix('btn-oui')
  # Même piège que Reminder.count plus haut : .length nu peut renvoyer un
  # résultat vide côté Swift -> ne matcherait jamais '0', timeout permanent
  # quel que soit l'état réel. String(...) obligatoire.
  wait_until(desc: -> { "dialogue encore présent après clic sur OK (scrims=#{bridge_eval("String(document.querySelectorAll('.scrim').length)")})" }) do
    bridge_eval("String(document.querySelectorAll('.scrim').length)") == '0'
  end
ensure
  # Reminder.remove persiste via debounce 1s (App.js#saveData) : on laisse
  # le temps au flush avant que le test suivant ne tue Board (jamais
  # d'écriture directe d'appdata.yaml pendant que Board tourne encore).
  (bridge_eval('Reminder.asArray().slice().forEach(function(r){ Reminder.remove(r); })') rescue nil)
  sleep 1.2
end

board_test("outil 'Programmer une alerte' : flux complet, confirmation, fermeture par clic OK") { run_test }
