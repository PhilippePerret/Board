require './lib/usefull.rb'
require './lib/debug.rb'
  
begin

  # Pour le retour
  class Retour
    attr_accessor :ok
    attr_accessor :message, :data, :error
    attr_accessor :no_raise, :request_id, :request
    attr_accessor :command
    def init(request)
      self.request = request
      self.ok = true
      self.request_id = request['id']
      self.message = nil
      self.data = nil
      self.error = nil
      self.no_raise = request['no_raise'] === true
    end
    def output
      {
        ok:       evaluated_ok,
        no_raise: no_raise,
        id:       self.request_id,
        data:     self.data,
        message:  self.message,
        error:    self.error,
        request:  self.request,
        command:  self.command
      }
    end
    def evaluated_ok
      if no_raise
        return true
      else
        error.nil?
      end
    end
  end

  # La requête frontend se trouve dans cette requête qui est une
  # table JSON
  input = STDIN.read.strip
  request = JSON.parse(input)

  RETOUR = Retour.new
  RETOUR.init(request)


  #######################################
  ###       DISPATCH de l'ACTION      ###
  #######################################
  
  case request["action"]

  # === Destuction d'un projet ===
  when 'remove-project'
    RETOUR.data = remove_or_archive_project(request['projectId'], false)
    
  when 'archive-project'
    RETOUR.data = remove_or_archive_project(request['projectId'], true)

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
    IO.write(APP_DATA_FILE, request['data'].to_yaml)
    RETOUR.ok = true
    RETOUR.message = "Données de l'application sauvées."
   
  # à l'initialisation (App.init)
  when 'load-all'
    require_relative 'lib/app.rb'
    RETOUR.data = App.load_all
    
  # Lancement d'un script osascript
  when "run-osascript"
    require_relative 'lib/exec_script.rb'
    exec_script("#{request['script-name']}.scpt")


  when 'run-bashscript'
    require_relative 'lib/exec_script.rb'
    exec_script("#{request['script-name']}.sh")

  # Liste des logiciels installés (type de param 'logiciel', ParamDefiner.js)
  # /System/Applications (+ Utilities) : apps système (Preview, Terminal…),
  # pas dans /Applications depuis macOS Ventura.
  when 'list-applications'
    app_dirs = ['/Applications/*.app', '/System/Applications/*.app', '/System/Applications/Utilities/*.app']
    RETOUR.data = { apps: app_dirs.flat_map { |g| Dir.glob(g) }.map { |p| File.basename(p, '.app') }.uniq.sort }

  # Pour récupérer les informations de la sélection du Finder
  when "getInfoFinderSelection"
    require_relative 'lib/exec_script.rb'
    RETOUR.data = exec_script('getInfoFinderSelection.scpt')
    if RETOUR.ok
      RETOUR.data['createdAt'] = human_date_to_aaammjj(RETOUR.data['createdAt'])
      RETOUR.data['updatedAt'] = human_date_to_aaammjj(RETOUR.data['updatedAt'])
    end
  # Pour récupérer les informations de la fenêtre courante du Finder
  when 'getInfoFinderWindow'
    require_relative 'lib/exec_script.rb'
    exec_script('getInfoFinderWindow.scpt')

  # Panneau "Outils" (ToolsData.js/Tools.js) — applications visibles
  # (Dock), pour choisir celle dont on veut la position/taille de fenêtre
  when 'list-running-apps'
    require_relative 'lib/exec_script.rb'
    exec_script('GetRunningApps.scpt')

  # Panneau "Outils" : position + taille de la fenêtre de premier plan de
  # request['appName'] — copiées dans le presse-papier par le script lui-même
  when 'get-app-window-bounds'
    require_relative 'lib/exec_script.rb'
    exec_script('GetAppWindowBounds.scpt', [request['appName']])
  
  # Écriture du changelog et de la todo-list après minuteur
  when 'update-project-notes'
    require_relative 'lib/project_files.rb'

  # ========== EXÉCUTIONS DES SERVICES =================

  when 'exec-service'
    Debug.log("exec-service reçu, script=#{request['script']} params=#{request['params'].inspect}")
    
    require_relative 'lib/exec_script.rb'
    exec_script(request["script"], request["params"])

    Debug.log("exec-service résultat = #{RETOUR.data.inspect}")
    # RETOUR.ok = RETOUR.data["ok"] if RETOUR.data.key?("ok")
    # RETOUR.error = RETOUR.data["error"] if RETOUR.data.key?("error") && RETOUR.data["error"]
    # RETOUR.message = RETOUR.data["message"] if RETOUR.data.key?("message") && RETOUR.data["message"]  


  when 'load-yaml-file'
    path = request['path']
    if !File.exist?(path)
      RETOUR.error = "Fichier introuvable : #{path}"
    else
      begin
        RETOUR.data = YAML.safe_load(File.read(path).gsub(/\n\s+\n/,"\n\n"))
      rescue Psych::SyntaxError => e
        RETOUR.error = "Code YAML invalide (#{path}) : #{e.message}"
      end
    end

  when 'open-file-yaml'
    `open -a "#{APP_DATA['yaml-editor'] || APP_DATA['text-editor']}" "#{request['path']}"`
  when 'open-file-text'
    `open -a "#{APP_DATA['text-editor']}" "#{request['path']}"`
  when 'open-file-code'
    `open -a "#{APP_DATA['code-editor']}" "#{request['path']}"`
  when 'create-folder'
    begin
      FileUtils.mkdir_p(request['data'])
    rescue => e
      RETOUR.error = e.message
    end

  # Pour récupérer un projet des archives
  when 'retreive-project-from-archives'
    RETOUR.data = move_project_out_to_projects_in(request["projectId"])
    
  # Pour obtenir la liste des projets en archives (comme une liste
  # de [id, title] pour select
  when 'get-options-for-projects-out'
    RETOUR.data = options_for_archived_project

  # Évaluation d'un fichier et retour du résultat.
  # Par exemple, un fichier YAML, CSV, JSON, etc. ou un fichier
  # exécutable
  when 'evaluate-file', 'get-data'
    require_relative 'lib/handy_file.rb'
    FileHandy.evaluate(request['path'])
    
  # Créer un fichier avec le content fourni
  when 'create-file'
    require_relative 'lib/handy_file.rb'
    FileHandy.create(request['path'], request['content'])

  # Fonctionne de paire avec 'evaluate-file' pour enregistrer
  # un nouvel objet ou autre valeur dans un fichier quelconque
  when 'save-in-file'
    require_relative 'lib/handy_file.rb'
    FileHandy.add_objet(request['path'], request['obj'])
    
  when 'copy-file'
    require_relative 'lib/handy_file.rb'
    FileHandy.copy(request['source'], request['dest'])

  when 'add-to-file'
    require_relative 'lib/handy_file.rb'
    FileHandy.add_to_file(request)
    
  when 'open-file'
    require_relative 'lib/handy_file.rb'
    FileHandy.open(request['path'])

  # ========== TODOIST (Todoist.js) =====================

  when 'todoist-find-project'
    require_relative 'lib/todoist.rb'
    id = Todoist.find_project_id(request['todoist-title'])
    if id
      RETOUR.data = {id: id}
    else
      RETOUR.error = "Projet « #{request['todoist-title']} » introuvable dans Todoist."
    end

  when 'todoist-today-tasks'
    require_relative 'lib/todoist.rb'
    RETOUR.data = {tasks: Todoist.today_tasks(request['todoist_id'])}

  when 'todoist-set-done'
    require_relative 'lib/todoist.rb'
    Todoist.close_tasks(request['task_ids'])

  when 'todoist-create-tasks'
    require_relative 'lib/todoist.rb'
    RETOUR.data = Todoist.create_tasks(request['project_id'], request['tasks'])

  when 'todoist-mark-complete-and-create-new'
    require_relative 'lib/todoist.rb'
    RETOUR.data = Todoist.close_and_create_tasks(request['project_id'], request['done'], request['created'])

  # action inconnue => ERRREUR
  else 
    RETOUR.error = "unknown action: #{request["action"]}"
  end

  
rescue => e
  RETOUR.ok = false
  RETOUR.error = e.message
end

###########################################
###   La table JSON retournée au front  ###
###########################################
puts (RETOUR.output.to_json)

