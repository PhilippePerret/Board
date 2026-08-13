# Test : un nouveau projet ne doit pas disparaître de projects-in si un
# save-app-data (App.js#saveData, déclenché par n'importe quelle autre
# action — changement de réglage, sélection d'un projet…) survient juste
# après sa création.
#
# Bug réel constaté sur les données de Phil (13/08/2026) : Project.js#save
# envoie 'save-project' (backend.rb l'ajoute à APP_DATA['projects-in']
# server-side et écrit appdata.yaml), mais ne synchronisait jamais
# App.data['projects-in'] côté front. Le prochain save-app-data (App.js:145,
# écrase TOUT le fichier avec App.data tel quel, sans relire l'existant)
# repartait donc d'une liste locale périmée et effaçait le projet fraîchement
# créé de appdata.yaml — la carte restait sur disque, orpheline. Reproduit 4
# fois de suite en usage réel avant d'être isolé ici.
#
# Setup : dossier support inexistant (garanti par Tests/run_tests.sh, qui
# déplace ~/Library/Application Support/Board avant de lancer les specs).

require_relative '../../support/helpers'

include BoardTest

def run_test
  launch_app

  project_id = "fixture-#{Time.now.to_i}#{rand(36**4).to_s(36)}"

  # Crée le projet par le vrai chemin (Project#save -> 'save-project'), puis
  # force IMMÉDIATEMENT un save-app-data (App.execSaveData, sans attendre le
  # debounce) dans le callback de save-project — reproduit le pire cas de la
  # course sans dépendre d'un timing flou.
  bridge_eval(<<~JS)
    (function(){
      window.__testDone = false
      var p = new Project({
        id: #{project_id.to_json},
        title: 'TDD nouveau projet',
        path: '/tmp',
        workTime: 0,
        services: { startup: [], others: [] }
      })
      Project.add(p)
      p.save(function(){
        App.execSaveData()
        window.__testDone = true
      })
      return ''
    })()
  JS

  wait_until(5, desc: -> { '__testDone jamais passé à true (save-project/save-app-data pas terminés)' }) do
    bridge_eval('window.__testDone === true ? "1" : ""') == '1'
  end

  wait_until(5, desc: -> {
    app_data = File.exist?(BoardTest::APP_DATA_FILE) ? (YAML.safe_load(File.read(BoardTest::APP_DATA_FILE)) rescue nil) : nil
    "projects-in de #{BoardTest::APP_DATA_FILE} = #{(app_data && app_data['projects-in']).inspect} (attendu : contient #{project_id})"
  }) do
    app_data = YAML.safe_load(File.read(BoardTest::APP_DATA_FILE))
    Array(app_data['projects-in']).include?(project_id)
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("un nouveau projet survit à un save-app-data juste après sa création") { run_test }
