# Test : régression — Service#duplicateService() (Service.js) faisait une
# copie SUPERFICIELLE (Object.assign({}, this.data, {uuid})) : .params
# restait la MÊME référence de tableau que le schéma abstrait partagé
# (SERVICES_DATA_TABLE[id].params, ServiceData.js). ServiceDefiner#define()
# fait `this.params.unshift({id:'service-name',...})` sur ce tableau — donc
# chaque glissé (même via un doublon) polluait le schéma partagé pour de
# bon, cumulativement, pour toute la session. Symptôme observé en
# production (Phil) : rejouer le glissé du MÊME service, dans la MÊME
# session, fait apparaître DEUX FOIS le champ nom.
#
# attribution_service_nom_pas_en_cache.rb couvrait déjà une partie de ce
# problème (this.data.name qui fuitait) — le fix existant (duplicateService)
# était incomplet : il ne clonait pas .params lui-même.
#
# Test direct (bridge_eval, pas de vrai glissé — plus rapide, cible
# exactement le mécanisme) : simule ce que fait ServiceDefiner.define() sur
# PLUSIEURS doublons successifs du même service abstrait, et vérifie que le
# schéma source (SERVICES_DATA_TABLE) n'a jamais bougé.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var id = 'open-folder-project'
      // Service.get(id) ne renvoie une instance que si le panneau des
      // services communs a déjà été construit au moins une fois (c'est
      // cette construction qui crée les instances, cf. Service.js) — dans
      // l'usage réel, c'est toujours vrai (on glisse un bouton du panneau,
      // qui n'existe donc déjà que si le panneau est là). On le force ici
      // pour reproduire cette condition, jamais remplie sinon juste après
      // launch_app.
      Service.CommonPanel
      var originalLength = SERVICES_DATA_TABLE[id].params.length

      // Simule 3 glissés successifs du même service abstrait, dans la
      // même session — comme ServiceDefiner.define() le ferait à chaque
      // fois (this.params.unshift({id:'service-name', ...})).
      for (var i = 0; i < 3; i++) {
        var duplicat = Service.get(id).duplicateService()
        duplicat.params.unshift({id: 'service-name', type: 'service-name'})
      }

      return JSON.stringify({
          originalLength: originalLength
        , schemaLengthAfter: SERVICES_DATA_TABLE[id].params.length
        , schemaHasServiceName: SERVICES_DATA_TABLE[id].params.some(function(p){ return p.id === 'service-name' })
      })
    })()
  JS
  data = JSON.parse(result)

  raise "le schéma partagé a été modifié par les doublons, obtenu #{data.inspect}" unless
    data['schemaLengthAfter'] == data['originalLength']
  raise "le schéma partagé contient un 'service-name' qui a fuité, obtenu #{data.inspect}" if
    data['schemaHasServiceName']
end

board_test("Service#duplicateService() : le schéma abstrait partagé n'est jamais modifié par les doublons successifs") { run_test }
