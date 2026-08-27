# Test : backend/scripts/FileCreate.rb refuse d'écraser un fichier déjà
# existant, indépendamment de tout dialogue/UI — appelé directement via
# 'exec-service', comme le ferait un appel direct hors service (ou une
# course avec le validIf frontend, qui ne vérifie qu'AVANT la saisie du
# contenu).

require_relative '../../support/helpers'

include BoardTest

def exec_file_create(project_path, file_path, content)
  bridge_eval(<<~JS)
    (function(){
      window.__fcResult = undefined
      server.send({action: 'exec-service', script: 'FileCreate.rb', params: [#{project_path.to_json}, #{file_path.to_json}, #{content.to_json}], no_raise: true}, function(retour){ window.__fcResult = retour })
      return ''
    })()
  JS

  wait_until(10, desc: -> { "exec-service FileCreate.rb : pas de réponse" }) do
    bridge_eval('window.__fcResult !== undefined') == 'true'
  end

  JSON.parse(bridge_eval('JSON.stringify(window.__fcResult)'))
end

def run_test
  Dir.mktmpdir('board-test-filecreate-') do |dir|
    launch_app

    existing_relative = 'deja-la.txt'
    existing_full = File.join(dir, existing_relative)
    File.write(existing_full, 'contenu original')

    retour = exec_file_create(dir, existing_relative, 'contenu écrasant')
    data = retour['data']
    raise "attendu ok=false pour un fichier existant, obtenu #{data.inspect}" unless data['ok'] == false
    raise "attendu erreur 'file-already-exists-at', obtenu #{data['error'].inspect}" unless data['error'] == ['file-already-exists-at', existing_full]
    raise "le fichier existant a été écrasé" unless File.read(existing_full) == 'contenu original'

    new_relative = 'nouveau.txt'
    new_full = File.join(dir, new_relative)
    retour2 = exec_file_create(dir, new_relative, 'contenu neuf')
    data2 = retour2['data']
    raise "attendu succès pour un nouveau fichier, obtenu #{data2.inspect}" if data2['ok'] == false
    raise "fichier non créé avec le bon contenu" unless File.read(new_full) == 'contenu neuf'
  end
end

board_test("FileCreate.rb : refuse d'écraser un fichier existant, crée normalement sinon") { run_test }
