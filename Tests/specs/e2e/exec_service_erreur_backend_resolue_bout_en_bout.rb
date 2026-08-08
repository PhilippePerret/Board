# Test : vrai aller-retour backend -> frontend, pas une fonction isolée
# (cf. speaking_resolve_backend_messages_toutes_formes.rb, qui teste
# _resolveMessagesIn seul avec un dictionnaire fabriqué). Ici : un vrai
# service (ExecCommand.sh) échoue réellement (dossier sans .git), l'erreur
# `["backend-not-a-git-repo", chemin]` remonte par le vrai pont
# (backend.rb -> bridge.receive -> Speaking.resolveBackendMessages), et on
# vérifie que le texte final, avec la VRAIE substitution ($1, cf.
# frontend/locales/PATCH_LOCALES.js), est correct — pas juste "ça ne
# plante pas".
#
# 'exec-service' est TOUJOURS envoyé avec no_raise: true
# (ServiceExecuter.js) : response.ok reste true côté pont même en cas
# d'échec (backend.rb#Retour#evaluated_ok) — c'est retour.error, résolu
# par Speaking AVANT que le callback ne soit exécuté, que le code appelant
# (ServiceExecuter#afterRunService) inspecte ensuite.

require_relative '../../support/helpers'
require 'shellwords'
include BoardTest

def run_test
  Dir.mktmpdir('board-test-no-git-') do |dir|
    launch_app

    cmd = "cd #{dir.shellescape} && gh issue create -l bug -t test -b test"

    bridge_eval(<<~JS)
      window.__testError = undefined
      server.send({action: 'exec-service', script: 'ExecCommand.sh', params: [#{cmd.to_json}], no_raise: true}, function(retour){
        window.__testError = retour.error
      })
      ''
    JS

    wait_until(desc: -> { 'window.__testError jamais défini' }) do
      bridge_eval("String(typeof window.__testError !== 'undefined')") == 'true'
    end

    error_text = bridge_eval("String(window.__testError)")
    expected = "Le dossier #{dir} n'est pas un repo Git." # frontend/locales/PATCH_LOCALES.js, 'backend-not-a-git-repo'

    raise "erreur pas résolue en texte final attendu : obtenu #{error_text.inspect}, attendu #{expected.inspect}" unless
      error_text == expected
  end
end

board_test("exec-service : erreur ['backend-not-a-git-repo', chemin] résolue bout en bout (backend réel -> pont -> Speaking -> texte substitué)") { run_test }
