require './lib/usefull.rb'
require './lib/debug.rb'
  
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

  # === Destuction d'un projet ===
  when 'remove-project'
    id = request["id"]
    project_id = request['projectId']
    ok = File.exist?(project_path(project_id))
    if ok
      APP_DATA['projects-out'] << APP_DATA['projects-in'].delete(project_id)
      save_app_data
    else
      error = "Le projet introuvable : #{project_id} (dans #{PROJECT_CARD_FOLDER})"
    end

  # === Sauvegarde d'un projet ===

  when "save-project"
    data = request["data"]
    project_id = data['id']
    IO.write(project_path(project_id), data.to_yaml)
    APP_DATA['projects-in'] << project_id unless APP_DATA['projects-in'].include?(project_id)
    save_app_data

  # === Sauvegarde des données de l'application ===

  when 'save-app-data'
    Debug.log("save-app-data reçu, projects-in=#{request['data']['projects-in'].inspect}")
    IO.write(APP_DATA_FILE, request['data'].to_json)
    ok = true
    returned_message = "Données de l'application sauvées."
   
  # à l'initialisation (App.init)
  when 'load-all'
    # Chargement de toutes les données de projets, classés
    projects_data =
      APP_DATA['projects-in'].map do |project_id|
        YAML.safe_load(IO.read(project_path(project_id)))
      end
    returned_data = {
      appData: APP_DATA,
      projectsData: projects_data
    }
    
    # === Chargement de :what ===
  # when "load"
  #   case request['what']

  #   # === Chargement des projets ===
  #   else
  #     ok = false
  #     returned_message = "Données inconnues : what = #{request['what']}"
  #     returned_data     = {}
  #   end


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
    Debug.log("exec-service reçu, script=#{request['script']} params=#{request['params'].inspect}")
    ok = true
    returned_data = run_script(request["script"], request["params"])
    Debug.log("exec-service résultat = #{returned_data.inspect}")
    ok = returned_data["ok"] if returned_data.key?("ok")
    error = returned_data["error"] if returned_data.key?("error") && returned_data["error"]
    returned_message = returned_data["message"] if returned_data.key?("message") && returned_data["message"]  
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

