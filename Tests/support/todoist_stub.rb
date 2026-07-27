require_relative 'helpers_base'
require_relative "#{BoardTest::ROOT}/backend/lib/usefull.rb"
require_relative "#{BoardTest::ROOT}/backend/lib/todoist.rb"

# Stub du point d'entrée réseau unique de Todoist (Todoist.request) : aucun
# appel HTTP réel n'est fait. On enregistre chaque requête qui AURAIT été
# envoyée (méthode, chemin, body) pour pouvoir la vérifier, et on sert des
# réponses (ou des erreurs) fabriquées à la main, dans l'ordre des appels.
class TodoistRequestStub
  Call = Struct.new(:method, :path, :params, :body, keyword_init: true)

  attr_reader :calls

  def initialize
    @calls = []
    @responses = []
  end

  # Empile une réponse à servir au prochain appel (Hash, true…),
  # ou une Exception pour simuler un échec de CET appel précis.
  def push(response_or_error)
    @responses << response_or_error
  end

  def call(method, path, params: nil, body: nil)
    @calls << Call.new(method: method, path: path, params: params, body: body)
    resp = @responses.shift
    raise resp if resp.is_a?(Exception)
    resp
  end
end

def with_todoist_stub
  stub = TodoistRequestStub.new
  original = Todoist.method(:request)
  Todoist.define_singleton_method(:request) do |method, path, params: nil, body: nil|
    stub.call(method, path, params: params, body: body)
  end
  yield stub
ensure
  Todoist.define_singleton_method(:request, original)
end
