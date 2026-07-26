require 'net/http'
require 'json'
require 'yaml'
require 'date'

TODOIST_TOKEN_FILE = ensure_file(
  [DATA_SUPPORT_FOLDER, 'todoist.yaml'],
  {'token' => nil}.to_yaml
)

module Todoist
  BASE_URL = 'https://api.todoist.com/api/v1'

  def self.token
    YAML.safe_load(IO.read(TODOIST_TOKEN_FILE))['token']
  end

  def self.request(method, path, params: nil)
    raise "Token Todoist manquant (#{TODOIST_TOKEN_FILE})" if token.nil? || token.empty?

    uri = URI("#{BASE_URL}#{path}")
    uri.query = URI.encode_www_form(params) if params

    req = case method
      when :get  then Net::HTTP::Get.new(uri)
      when :post then Net::HTTP::Post.new(uri)
      end
    req['Authorization'] = "Bearer #{token}"

    res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
    raise "Erreur Todoist (#{res.code}) : #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    JSON.parse(res.body)
  end

  # L'API v1 pagine les listes sous {"results" => [...], "next_cursor" => ...}
  # (contrairement à l'ancienne REST v2 qui renvoyait un tableau nu).
  def self.list(path, params: nil)
    res = request(:get, path, params: params)
    res.is_a?(Hash) ? (res['results'] || []) : res
  end

  def self.find_project_id(name)
    projet = list('/projects').find { |p| p['name'] == name }
    projet && projet['id']
  end

  def self.today_tasks(project_id)
    today = Date.today.to_s
    list('/tasks', params: {project_id: project_id}).select do |task|
      task['due'] && task['due']['date'] && task['due']['date'] <= today
    end
  end
end
