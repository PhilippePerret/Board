require "json"
require 'yaml'
require "fileutils"

MAIN_PROJECT_FOLDER   = "/Users/philippeperret/Programmes/Board/_dev"
PROJECT_CARD_FOLDER   = File.join(MAIN_PROJECT_FOLDER, 'projects-in')
PROJECT_CARD_ARCHIVE  = File.join(MAIN_PROJECT_FOLDER, 'projects-out')

SERVICES_DATA_FILE = File.join(__dir__, 'data', 'services_data.yaml')

### === Jouer un script du dossier /scripts/ ===
def run_script(script_name, params = "")
  params = params.map {|s| s.inspect}.join(' ') if params.is_a?(Array)
  cmd = nil
  case File.extname(script_name)
  when '.sh'
    begin
      cmd = "scripts/#{script_name} #{params}".strip
      res = `#{cmd}`
      if res == "" then {ok: true}
      else JSON.parse(res) end
  when '.scpt'
    begin
      cmd = "osascript scripts/#{script_name} #{params}".strip
      # return  {script_command: "cmd = #{cmd}"}
      res = `#{cmd}`
      if res == "" then {ok: true}
      else JSON.parse(res) end
    rescue Exception => e
      {ok: false, error: "### ERREUR DE SCRIPT : #{e.message}\navec la commande : #{cmd}"}
    end
  else
    puts "Je ne sais pas traiter un script #{script_name}"
  end
end
def human_date_to_aaammjj(date)
  y, m, j = date.split('/')
  "#{y}/#{m.rjust(2,'0')}/#{j.rjust(2,'0')}"
end

begin

  returned_error  = nil
  ok = true
  error = nil
  returned_data   = nil
  
  
  # La requête frontend se trouve dans cette requête qui est une
  # table JSON
  input = STDIN.read.strip
  request = JSON.parse(input)

  # ID de la requête (pour suivi)
  request_id = request["id"]

  #######################################
  ###       Analyse de l'ACTION       ###
  #######################################
  
  case request["action"]
  when 'remove-project'
    id = request["id"]
    fname = "#{request['projectId']}.yaml"
    src   = File.join(PROJECT_CARD_FOLDER, fname)
    dest  = File.join(PROJECT_CARD_ARCHIVE, fname)
    if (File.exist?(src))
      FileUtils.mv(src, dest)
    else
      ok = false
      error = "Le projet introuvable : #{src}"
    end
  when "save-project"
    data = request["data"]
    file = File.join(PROJECT_CARD_FOLDER, "#{data['id']}.yaml")
    IO.write(file, data.to_yaml)
  when "load"
    case request['what']
    when 'projects'
      # Chargement de tous les projets
      # (pour le moment dans le dossier de l'application)
      projects_data = []
      Dir["#{PROJECT_CARD_FOLDER}/*.yaml"].each do |cardpath|
        projects_data << YAML.safe_load(IO.read(cardpath))
      end
      returned_data = projects_data
    else
      ok = false
      returned_message = "Données inconnues : what = #{request['what']}"
      returned_data     = {}
    end

  # Lancement d'un script osascript
  when "run-osascript"
    returned_data = run_script("#{request['script-name']}.scpt")

  when 'run-bashscript'
    returned_data = run_script("#{request['script-name']}.sh")

  # Pour récupérer les informations de la sélection du Finder
  when "getInfoFinderSelection"
    ok = true
    returned_data = run_script('getInfoFinderSelection.scpt')
    if returned_data["ok"] != false
      returned_data['createdAt'] = human_date_to_aaammjj(returned_data['createdAt'])
      returned_data['updatedAt'] = human_date_to_aaammjj(returned_data['updatedAt'])
    end
  # Pour récupérer les informations de la fenêtre courante du Finder
  when 'getInfoFinderWindow'
    ok = true
    returned_data = run_script('getInfoFinderWindow.scpt')
  
  # ========== EXÉCUTIONS DES SERVICES =================
  when 'exec-service'
    ok = true
    returned_data = run_script(request["script"], request["params"])
  
  # action inconnue => ERRREUR
  else 
    ok = false
    returned_error = "unknown action: #{request["action"]}"

  end
  
  ###########################################
  ###   La table JSON retournée au front  ###
  ###########################################
  puts ({
    ok:       ok,
    id:       request_id,
    message:  returned_message,
    error:    error || returned_error,
    data:     returned_data,
    received_request:  request
  }.to_json)

rescue => e
  puts({ ok: false, id: (defined?(request_id) ? request_id : nil), error: e.message }.to_json)

end

