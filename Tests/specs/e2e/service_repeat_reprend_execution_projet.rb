# Test : régression ServiceExecuter — un service commun avec repeat: true
# (ex. git-commit, ServiceData.js) doit, à chaque répétition, reprendre par
# le MÊME point d'entrée que le premier run (exec() OU execOnProject()) et
# pas systématiquement par exec()/this.params.
#
# Bug corrigé : afterRunService (ServiceExecuter.js) rappelait toujours
# this.exec(this.projet, this.callback) sur repeat, quel que soit le point
# d'entrée initial. Pour un service COMMUN joué depuis le panneau/projet
# (execOnProject), this.params est le SCHÉMA abstrait du service (jamais
# résolu — les valeurs réelles vivent dans projet.common_services_data),
# et contient une référence circulaire (param.service = this, posée par
# Service.js#constructor) : sur la 2e itération, JSON.stringify plantait
# ("cannot serialize cyclic structures"), symptôme visible en prod sur
# git-commit.
#
# Test unitaire direct (bridge_eval), pas de vrai backend/git/dialogue —
# service factice (test-repeat-service, pas git-commit) pour reproduire la
# forme d'un service commun sans en dépendre. On stub runWithDynParams pour
# capturer QUELLE source de params est utilisée à chaque appel.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var callsLog = []
      var project = { common_services_data: { 'test-repeat-service': [['stub-value']] } }
      var fakeService = {
          id: 'test-repeat-service'
        , name: 'Test repeat'
        , params: [{id: 'git_ope', type: 'raw', value: 'commit'}] // jamais résolu, comme un vrai service commun
        , data: { repeat: true }
        , script: 'GitOpes.rb'
      }

      // --- Cas 1 : service commun (execOnProject), avec repeat ---
      var executer = new ServiceExecuter(fakeService)
      executer.runWithDynParams = function(baseParams){ callsLog.push(baseParams) }
      executer.execOnProject(project)
      executer.afterRunService({ok: true, message: 'ok'})

      var projectData = project.common_services_data['test-repeat-service']
      var commonCase = {
          callCount: callsLog.length
        , firstIsProjectData: callsLog[0] === projectData
        , secondIsProjectData: callsLog[1] === projectData
        , secondIsUnresolvedSchema: callsLog[1] === fakeService.params
      }

      // --- Cas de contrôle : même service, SANS repeat -> une seule
      // exécution, pas de second appel du tout ---
      callsLog = []
      var fakeServiceNoRepeat = Object.assign({}, fakeService, {data: {repeat: false}})
      var executer2 = new ServiceExecuter(fakeServiceNoRepeat)
      executer2.runWithDynParams = function(baseParams){ callsLog.push(baseParams) }
      executer2.execOnProject(project)
      executer2.afterRunService({ok: true, message: 'ok'})

      var noRepeatCase = { callCount: callsLog.length }

      return JSON.stringify({commonCase: commonCase, noRepeatCase: noRepeatCase})
    })()
  JS
  data = JSON.parse(result)

  common = data['commonCase']
  raise "repeat: true doit ré-exécuter une 2e fois, obtenu #{common.inspect}" unless common['callCount'] == 2
  raise "1er appel attendu avec les valeurs projet, obtenu #{common.inspect}" unless common['firstIsProjectData']
  raise "2e appel (repeat) attendu avec les valeurs projet (execOnProject repris), obtenu #{common.inspect}" unless common['secondIsProjectData']
  raise "2e appel ne doit JAMAIS utiliser le schéma non résolu (régression), obtenu #{common.inspect}" if common['secondIsUnresolvedSchema']

  no_repeat = data['noRepeatCase']
  raise "sans repeat, un seul appel attendu (cas de contrôle), obtenu #{no_repeat.inspect}" unless no_repeat['callCount'] == 1
end

board_test("ServiceExecuter : un service commun 'repeat: true' se ré-exécute via execOnProject (valeurs projet), pas via exec()/schéma non résolu") { run_test }
