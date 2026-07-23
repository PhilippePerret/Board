require_relative '../../support/helpers'

include BoardTest

# Test de l'action backend 'evaluate-file' (backend/lib/evaluate_file.rb),
# utilisée quand un paramètre de type multiple (ex. 'values' de 'select',
# ['array-of-object', 'path']) reçoit un chemin de fichier plutôt qu'une
# donnée en dur. Testé directement via l'action backend (pas via
# ServStep#validate(), qui est synchrone alors que la résolution d'un path
# passe par un aller-retour serveur asynchrone — validate() ne peut donc
# pas remonter les erreurs de cette branche telle qu'elle est écrite
# aujourd'hui).
#
# Appel asynchrone (server.send) : on ne peut pas compter sur le fait que
# evaluateJavaScript (TestBridge.swift) attende une Promise renvoyée — pas
# vérifié en live. On stocke donc la réponse dans une variable globale JS et
# on la lit par polling (wait_until), comme le reste de la suite.
def evaluate_file(path)
  bridge_eval(<<~JS)
    (function(){
      window.__evalFileResult = undefined
      server.send({action: 'evaluate-file', path: #{path.to_json}}, function(retour){ window.__evalFileResult = retour })
      return ''
    })()
  JS

  wait_until(10, desc: -> { "evaluate-file : pas de réponse pour #{path}" }) do
    bridge_eval('window.__evalFileResult !== undefined') == 'true'
  end

  JSON.parse(bridge_eval('JSON.stringify(window.__evalFileResult)'))
end

VALUES = [{ 'value' => 'a', 'title' => 'A' }, { 'value' => 'b', 'title' => 'B' }].freeze

def run_test
  Dir.mktmpdir('board-test-evaluate-file-') do |dir|
    launch_app

    yaml_path = File.join(dir, 'values.yaml')
    File.write(yaml_path, VALUES.to_yaml)

    json_path = File.join(dir, 'values.json')
    File.write(json_path, JSON.generate(VALUES))

    ruby_ok_path = File.join(dir, 'values_ok.rb')
    File.write(ruby_ok_path, <<~RUBY)
      #!/usr/bin/env ruby
      require 'json'
      puts JSON.generate(#{VALUES.inspect})
    RUBY
    File.chmod(0755, ruby_ok_path)

    ruby_bad_path = File.join(dir, 'values_bad.rb')
    File.write(ruby_bad_path, <<~RUBY)
      #!/usr/bin/env ruby
      puts "ceci n'est pas du JSON"
    RUBY
    File.chmod(0755, ruby_bad_path)

    [
      ['fichier YAML', yaml_path, VALUES],
      ['fichier JSON', json_path, VALUES],
      ['script Ruby renvoyant du bon JSON', ruby_ok_path, VALUES],
    ].each do |desc, path, expected_data|
      retour = evaluate_file(path)
      raise "[#{desc}] attendu pas d'erreur, obtenu #{retour['error'].inspect}" if retour['error']
      raise "[#{desc}] données attendues #{expected_data.inspect}, obtenu #{retour['data'].inspect}" unless retour['data'] == expected_data
    end

    retour = evaluate_file(ruby_bad_path)
    raise "[script Ruby renvoyant du mauvais JSON] attendu une erreur, obtenu #{retour.inspect}" unless retour['error']
  end
end

board_test("evaluate-file : yaml / json / ruby (bon et mauvais JSON)") { run_test }
