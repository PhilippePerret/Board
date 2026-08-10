# Test : Reminder.register() ignore un rappel qui duplique un rappel déjà
# enregistré (même message + même heure + même tâche/projet). Corrige un
# bug réel : à chaque `update.command`, les rappels de tâche se
# dupliquaient (jusqu'à 15 fois vus en pratique), aussi bien en mémoire que
# dans appdata.yaml (Reminder.getRemindersToSave itère tout le stack).
#
# taskId/projectId sont volontairement discriminants (pas de simple
# message+time) : deux tâches différentes ("Vider le dossier à 10h" sur
# deux projets distincts) peuvent légitimement partager le même texte et
# la même heure sans être des doublons.

require_relative '../../support/helpers'
include BoardTest

# Reminder.register() appelle App.saveReminders() à chaque enregistrement
# réussi, qui écrit réellement dans appdata.yaml — on restaure l'app data
# d'origine après coup pour ne pas polluer les rappels réels de l'utilisateur.
def run_test
  original_app_data = read_app_data
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var t = '2026-09-01T10:00:00.000Z'
      var out = {}

      // 1. Deux enregistrements strictement identiques -> 1 seul conservé
      Reminder.register({message: 'Alerte A', time: t, taskId: 'task-1', projectId: 'proj-1'})
      Reminder.register({message: 'Alerte A', time: t, taskId: 'task-1', projectId: 'proj-1'})
      out.doublon_strict = Reminder.count

      // 2. Même message + heure, mais taskId différent (2 tâches, même texte/heure) -> les 2 doivent exister
      Reminder.register({message: 'Vider le dossier à 10h', time: t, taskId: 'task-A', projectId: 'proj-X'})
      Reminder.register({message: 'Vider le dossier à 10h', time: t, taskId: 'task-B', projectId: 'proj-X'})
      out.apres_taskid_different = Reminder.count

      // 3. Même message + heure + taskId, mais projectId différent -> les 2 doivent exister
      Reminder.register({message: 'Vider le dossier à 11h', time: t, taskId: null, projectId: 'proj-Y'})
      Reminder.register({message: 'Vider le dossier à 11h', time: t, taskId: null, projectId: 'proj-Z'})
      out.apres_projectid_different = Reminder.count

      // 4. Heure différente (même message/taskId/projectId) -> pas un doublon
      Reminder.register({message: 'Alerte B', time: '2026-09-01T12:00:00.000Z', taskId: 'task-9', projectId: 'proj-9'})
      Reminder.register({message: 'Alerte B', time: '2026-09-01T14:00:00.000Z', taskId: 'task-9', projectId: 'proj-9'})
      out.apres_heure_differente = Reminder.count

      return JSON.stringify(out)
    })()
  JS

  data = JSON.parse(result)
  raise "doublon strict : attendu 1 rappel, obtenu #{data['doublon_strict']}" unless data['doublon_strict'] == 1
  raise "taskId différent : attendu 3 rappels (1 + 2 nouveaux), obtenu #{data['apres_taskid_different']}" unless data['apres_taskid_different'] == 3
  raise "projectId différent : attendu 5 rappels (3 + 2 nouveaux), obtenu #{data['apres_projectid_different']}" unless data['apres_projectid_different'] == 5
  raise "heure différente : attendu 7 rappels (5 + 2 nouveaux), obtenu #{data['apres_heure_differente']}" unless data['apres_heure_differente'] == 7
ensure
  write_app_data(original_app_data) if original_app_data
end

board_test("Reminder.register : ignore les doublons (message+time+taskId+projectId), garde les cas légitimement distincts") { run_test }
