# Test : outil "Programmer une alerte", step 'date-time' — valider avec une
# date/heure au format INVALIDE.
#
# Prompter.js#promptDateTime :
#   ouiBtn: { onclick: (retour) => {
#     const datetime = Validator.datetime(retour, format, true)
#     if (datetime) callback(datetime)
#     else this.promptDateTime(spec, callback)   // reprompt silencieux
#   }}
# Contrairement à l'ancien ScriptService.js#execDateTime (qui bloquait le
# flux en silence, sans nouvelle boite), le format invalide fait
# réafficher une NOUVELLE TextFieldDialog (même step, même id
# '__date-time__') — toujours sans message d'erreur visible.

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app
  wait_until(10, desc: -> { "spinner = #{spinner_message_text.inspect}" }) { spinner_message_text.include?('prête') }

  click('tools-button')
  wait_for('tools-panel')
  wait_for('tool-alerte')
  click('tool-alerte')

  wait_for('__date-time__')
  set_value('__date-time__', 'ceci-n-est-pas-une-date')
  click_suffix('btn-oui')

  # → reprompt silencieux : nouvelle boite, même step, pas de message d'erreur
  wait_for('__date-time__')
  footer_msg = get_text('message').to_s
  raise "un message d'erreur est apparu (#{footer_msg.inspect}) : toujours pas affiché normalement ?" if footer_msg =~ /invalide|erreur/i

  count = bridge_eval('String(Reminder.count)').to_i
  raise "aucun Reminder ne devrait avoir été programmé avant validation, obtenu #{count}" unless count == 0

  # - abandon (bouton 'Annuler')
  # ServStep#onPrompted : value===null -> setValue(':abort:') met
  # this.aborted=true mais N'APPELLE JAMAIS callback() (commentaire du code :
  # "rien à faire puisque le callback n'est pas appelé") -> execNextStep
  # (qui affiche "Abandon du script-service.") n'est donc jamais rappelé
  # après un abandon — pas d'assertion sur ce message, juste sur l'état
  # observable : dialogue fermé, aucun Reminder créé.
  click_suffix('btn-non')
  wait_until(desc: -> { "dialogue encore présent après abandon (scrims=#{bridge_eval("String(document.querySelectorAll('.scrim').length)")})" }) do
    bridge_eval("String(document.querySelectorAll('.scrim').length)") == '0'
  end
  count_after_abort = bridge_eval('String(Reminder.count)').to_i
  raise "aucun Reminder ne devrait avoir été programmé après abandon, obtenu #{count_after_abort}" unless count_after_abort == 0
end

board_test("outil 'Programmer une alerte' : date/heure invalide redemande la saisie (sans message d'erreur)") { run_test }
