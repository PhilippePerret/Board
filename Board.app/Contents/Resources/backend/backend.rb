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
    data_returned = remove_or_archive_project(request['projectId'], false)
  when 'archive-project'
    data_returned = remove_or_archive_project(request['projectId'], true)

  # === Sauvegarde d'un projet ===

  when "save-project"
    data = request["data"]
    project_id = data['id']
    Debug.log("save-project reçu, id=#{project_id.inspect}")
    IO.write(project_path(project_id), data.to_yaml)
    APP_DATA['projects-in'] << project_id unless APP_DATA['projects-in'].include?(project_id)
    save_app_data
    Debug.log("save-project terminé, id=#{project_id.inspect}")

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
  
  # Écriture du changelog et de la todo-list du projet (fin de séance
  # d'horloge, service commun "work-clock") — ajout en tête de fichier, en
  # gardant le contenu déjà là. Crée le fichier s'il n'existe pas.
  when 'update-project-notes'
    project_dir    = request['path']
    changelog_text = request['changelog']
    todo_text      = request['todo']

    if changelog_text && !changelog_text.strip.empty?
      changelog_file = File.join(project_dir, 'CHANGELOG.md')
      existed  = File.exist?(changelog_file)
      existing = existed ? IO.read(changelog_file) : ''
      header   = existed ? '' : "# Changelog\n\n"
      date     = Time.now.strftime('%Y/%m/%d')
      entry    = "## #{date}\n\n#{changelog_text.strip}\n\n"
      IO.write(changelog_file, header + entry + existing)
    end

    if todo_text && !todo_text.strip.empty?
      todo_file = File.join(project_dir, 'TODO.md')
      existed  = File.exist?(todo_file)
      existing = existed ? IO.read(todo_file) : ''
      header   = existed ? '' : "# Todo list\n\n"
      lines    = todo_text.strip.split("\n").map(&:strip).reject(&:empty?)
      entry    = lines.map { |l| "- [ ] #{l}" }.join("\n") + "\n\n"
      IO.write(todo_file, header + entry + existing)
    end

    ok = true

  # ========== EXÉCUTIONS DES SERVICES =================
  when 'exec-service'
    Debug.log("exec-service reçu, script=#{request['script']} params=#{request['params'].inspect}")
    ok = true
    returned_data = run_script(request["script"], request["params"])
    Debug.log("exec-service résultat = #{returned_data.inspect}")
    ok = returned_data["ok"] if returned_data.key?("ok")
    error = returned_data["error"] if returned_data.key?("error") && returned_data["error"]
    returned_message = returned_data["message"] if returned_data.key?("message") && returned_data["message"]  


  # Pour récupérer un projet des archives
  when 'retreive-project-from-archives'
    ok = true
    returned_data = move_project_out_to_projects_in(request["projectId"])
    
  # Pour obtenir la liste des projets en archives (comme une liste
  # de [id, title] pour select
  when 'get-options-for-projects-out'
    ok = true
    returned_data = options_for_archived_project
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

