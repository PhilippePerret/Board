# Test d'intégration du verrou Project#lockSave/unlockSave EN SITUATION
# RÉELLE : une redéfinition de service (Service#redefine -> ServiceDefiner,
# verrouillé pour toute sa durée) en cours pendant qu'un Reminder.poll()
# déclenche un onDue qui sauvegarde le projet — exactement le scénario qui
# a motivé le verrou (cf. Project.js#967, un reminder de projet en veille
# avec onDue: reactive, poll toutes les 60s en production ; ici on rejoue
# le même mécanisme Reminder réel, avec un onDue qui persiste une propriété
# du projet via Project#set(..., true), même forme d'appel que
# standbyize() — sans passer par le clic DOM réel, bloqué sur un projet en
# veille et hors sujet ici).
#
# Vérifie :
#  - pendant la définition (dialogue de redéfinition ouvert), le save
#    déclenché par le reminder est mis en attente, PAS écrit sur disque
#  - à la fin de la définition, un flush unique écrit à la fois ce que le
#    reminder voulait sauver ET les nouveaux params du service — rien
#    n'est perdu, rien n'est écrit en double pendant le processus.

require_relative '../../support/helpers'

include BoardTest

def run_test
  id = nil
  uuid = "fixture-service-#{Time.now.to_i}verrou"
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    service = {
      'id' => 'work-clock', 'uuid' => uuid, 'type' => 'others',
      'name' => 'Nom initial', 'params' => [[90], [30]], 'projectId' => nil
    }
    id = create_fixture_project(title: 'Projet verrou', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    card = "project-#{id}"
    service_card = "service-#{uuid}"

    wait_for(card)
    click(card)
    wait_for(service_card)
    meta_click(service_card)

    # → dialogue de redéfinition ouvert : le projet doit être verrouillé
    wait_for('__service-name__')
    locked = bridge_eval('Project.current._saveLocked') == 'true'
    raise "Project.current._saveLocked attendu true pendant la définition, obtenu #{locked.inspect}" unless locked
    click_suffix_last('btn-oui') # nom inchangé

    # → EN PLEIN MILIEU de la définition (avant même le 1er param) : un
    # reminder réel, déjà échu, dont le onDue sauve le projet (même forme
    # d'appel que Project#standbyize -> set('collapsed', ..., true)) —
    # déclenché via un poll direct (pas d'attente réelle de 60s, cf.
    # reminder_poll_due.rb).
    wait_for('__session-duration__', 8)
    poll_result = bridge_eval(<<~JS)
      (function(){
        Reminder.register({
          time: new Date(Date.now() - 5000),
          message: 'test verrou',
          onDue: function(){ Project.current.set('collapsed', true, true) }
        });
        Reminder.poll();
        return JSON.stringify({
          locked: Project.current._saveLocked,
          pending: (Project.current._pendingSaveCallbacks || []).length,
          collapsedMemoire: Project.current.collapsed
        });
      })()
    JS
    poll_data = JSON.parse(poll_result)
    raise "reminder déclenché sans mettre le save en attente : #{poll_data.inspect}" unless poll_data['pending'] >= 1
    raise "collapsed pas mis à jour en mémoire (onDue n'a pas tourné) : #{poll_data.inspect}" unless poll_data['collapsedMemoire'] == true

    # → sur le disque, rien n'a encore bougé : ni le save du reminder, ni
    # les anciens params du service (toujours [90],[30])
    card_pendant = read_project_card(id)
    raise "écriture prématurée du reminder pendant la définition : #{card_pendant.inspect}" if card_pendant['collapsed'] == true
    raise "écriture prématurée des params pendant la définition : #{card_pendant.inspect}" unless card_pendant['services']['others'].find { |s| s['uuid'] == uuid }['params'].flatten == [90, 30]

    # → on termine normalement la redéfinition
    set_value('__session-duration__', '100')
    click_suffix_last('btn-oui')
    wait_for('__work-duration__', 8)
    click_suffix_last('btn-oui')

    # → flush unique : ce que le reminder voulait sauver ET les nouveaux
    # params du service, tous les deux présents
    wait_until(desc: -> { "carte projet = #{read_project_card(id).inspect}" }) do
      card_final = read_project_card(id)
      found = card_final['services']['others'].find { |s| s['uuid'] == uuid }
      card_final['collapsed'] == true && found && found['params'].flatten == [100, 100]
    end

    still_locked = bridge_eval('Project.current._saveLocked') == 'true'
    raise "Project.current._saveLocked attendu false après la définition, obtenu #{still_locked.inspect}" if still_locked
  end
ensure
  remove_fixture_project(id) if id
end

board_test("verrou de save pendant une redéfinition de service : reminder concurrent mis en attente puis flushé en un seul save") { run_test }
