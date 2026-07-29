# Stub Todoist pour les specs e2e (moteur "pont") : contrairement à
# Tests/support/todoist_stub.rb (stub in-process, utilisable seulement par
# les specs unit qui requièrent backend/lib/todoist.rb directement), les
# specs e2e pilotent un Board.app réel dont le sous-processus backend.rb
# est un process ruby séparé — impossible d'y injecter un stub in-process.
#
# BOARD_TEST_TODOIST_STUB_DIR (propagé à l'app via helpers_base.rb#launch_app,
# lu côté backend par backend/lib/todoist.rb#stubbed_request) pointe vers un
# dossier de fixtures sur disque : les réponses à servir, dans l'ordre, une
# par appel Todoist.request.

require_relative 'helpers_base'
require 'fileutils'
require 'tmpdir'
require 'json'

module BoardTest
  # +responses+ : tableau de Hash (réponse JSON à servir) ou {'__error__' => msg}
  # pour simuler un échec de l'appel correspondant, servies dans l'ordre des
  # appels Todoist.request faits par le process backend.rb.
  def with_todoist_e2e_stub(responses)
    dir = Dir.mktmpdir('board-todoist-e2e-stub')
    FileUtils.mkdir_p(File.join(dir, 'responses'))
    responses.each_with_index do |resp, i|
      File.write(File.join(dir, 'responses', "#{i}.json"), resp.to_json)
    end
    ENV['BOARD_TEST_TODOIST_STUB_DIR'] = dir
    yield dir
  ensure
    ENV.delete('BOARD_TEST_TODOIST_STUB_DIR')
    FileUtils.remove_entry(dir) if dir && File.directory?(dir)
  end

  # Les appels effectivement reçus par le stub, dans l'ordre, sous forme de
  # Hash {"method"=>"get"/"post", "path"=>..., "params"=>..., "body"=>...}.
  def todoist_e2e_stub_calls(dir)
    calls_file = File.join(dir, 'calls.jsonl')
    return [] unless File.exist?(calls_file)
    File.readlines(calls_file).map { |l| JSON.parse(l) }
  end
end
