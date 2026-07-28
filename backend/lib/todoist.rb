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

  def self.request(method, path, params: nil, body: nil)
    raise "Token Todoist manquant (#{TODOIST_TOKEN_FILE})" if token.nil? || token.empty?

    uri = URI("#{BASE_URL}#{path}")
    uri.query = URI.encode_www_form(params) if params

    req = case method
      when :get  then Net::HTTP::Get.new(uri)
      when :post then Net::HTTP::Post.new(uri)
      end
    req['Authorization'] = "Bearer #{token}"
    if body
      req['Content-Type'] = 'application/json'
      req.body = body.to_json
    end

    res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
    raise "Erreur Todoist (#{res.code}) : #{res.body}" unless res.is_a?(Net::HTTPSuccess)

    res.body.nil? || res.body.empty? ? true : JSON.parse(res.body)
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
    list('/tasks', params: {project_id: project_id, filter: 'today | overdue'})
      .select { |task| task['due'] }
  end

  def self.close_and_create_tasks(project_id, dones, createds)
    done    = close_tasks(dones)
    created = create_tasks(project_id, createds)
    {
      done_count:    done[:count],
      created_count: created[:count],
      errors: done[:errors] + created[:errors]
    }
  end

  def self.close_task(task_id)
    request(:post, "/tasks/#{task_id}/close")
  end

  def self.close_tasks(task_ids)
    count = 0
    errors = []
    task_ids.each do |task_id|
      begin
        close_task(task_id)
        count += 1
      rescue => e
        errors << "Tâche #{task_id} : #{e.message}"
      end
    end
    {count: count, errors: errors}
  end

  def self.create_tasks(project_id, tasks)
    count = 0
    errors = []
    tasks.each do |task|
      begin
        create_task(project_id, task)
        count += 1
      rescue => e
        errors << "#{task['content']} : #{e.message}"
      end
    end
    {count: count, errors: errors}
  end

  def self.create_task(project_id, task)
    task = _ensure_task_data(project_id, task)
    request(:post, '/tasks', body: task)
  end

  def self._ensure_task_data(project_id, task)
    task = task.merge('project_id' => project_id)
    lang = APP_DATA['lang'].split('-')[0]

    # 'start' (langage naturel, ex: "demain", "dans 3 jours") est la clé
    # utilisée côté frontend (TasksDialog) ; l'API attend 'due_string' + 'due_lang'
    due = task.delete('start') || task.delete('due')
    if due
      task['due_string'] = due
      task['due_lang']   = lang
    end

    # 'deadline' idem : langage naturel côté frontend, 'deadline_date' + 'deadline_lang' côté API
    if task['deadline']
      task['deadline_date'] = task.delete('deadline')
      task['deadline_lang'] = lang
    end

    # 'labels' arrive en chaîne séparée par des virgules côté frontend,
    # l'API attend un tableau
    if task['labels'].is_a?(String)
      task['labels'] = task['labels'].split(',').map(&:strip)
    end

    if task['duration']
      amount, unit = _parse_duration(task.delete('duration'), lang)
      task['duration']      = amount
      task['duration_unit'] = unit
    end

    task
  end

  # task['duration'] arrive en langage courant, p.e. "3 jours" ou "45 minutes"
  # => à convertir en [amount Integer, unit String ('minute'|'day')] pour l'API
  # Note : la valeur est contrôlée en frontend donc arrive correcte ici
  def self._parse_duration(str, lang)
    amount, mot = str.downcase.strip.split(/\s+/, 2)
    amount = amount.to_i
    case mot
    when Lang.minute_in(lang)   then [amount, 'minute']
    when Lang.hour_in(lang)     then [amount * 60, 'minute']
    when Lang.day_in(lang)      then [amount, 'day']
    when Lang.week_in(lang)     then [amount * 7, 'day']
    when Lang.month_in(lang)    then [amount * 31, 'day']
    end
  end
end

class Lang
class << self
  def minute_in(lang) = /(minute|mn)s?/           # TODO faire pour chaque langue
  def hour_in(lang)   = /(heure|hr|hour|h)s?/     # idem
  def day_in(lang)    = /(jour|jr|j|day|d)s?/     # idem
  def week_in(lang)   = /(semaine|sem|week|w)s?/  # idem
  def month_in(lang)  = /(moi|month)s?/           # idem
end # /self
end #/ Lang
