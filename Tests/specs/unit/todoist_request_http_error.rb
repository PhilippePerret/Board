require_relative '../../support/todoist_stub'
include BoardTest

# Vérifie Todoist.request lui-même face à une vraie réponse HTTP non-2xx
# (pas via le stub réseau, qui court-circuite cette méthode). On remplace
# Net::HTTP.start par un double renvoyant directement une fausse réponse
# en échec — aucun appel réseau réel n'est fait.
FakeHttpResponse = Struct.new(:code, :body)

def run_test
  original_token = Todoist.method(:token)
  Todoist.define_singleton_method(:token) { 'fake-token' }

  original_start = Net::HTTP.method(:start)
  Net::HTTP.define_singleton_method(:start) { |*args, **kwargs, &block| FakeHttpResponse.new('404', 'Not Found') }

  raised = false
  begin
    Todoist.request(:get, '/projects/inexistant')
  rescue => e
    raised = true
    raise "message attendu avec code+corps, obtenu #{e.message.inspect}" unless e.message.include?('404') && e.message.include?('Not Found')
  end
  raise "réponse non-2xx : une exception était attendue" unless raised
ensure
  Net::HTTP.define_singleton_method(:start, original_start) if original_start
  Todoist.define_singleton_method(:token, original_token) if original_token
end

board_test("Todoist.request : réponse HTTP non-2xx → exception avec code + corps") { run_test }
