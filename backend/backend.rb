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

  RETOUR = Retour.new
  RETOUR.init({})
  
  # La requête frontend se trouve dans cette requête qui est une
  # table JSON
  input = STDIN.read.strip
  request = JSON.parse(input)

  RETOUR.init(request)

  # Ouvre +path+ avec l'application +editor+ (nom configuré dans APP_DATA,
  # p.e. 'yaml-editor'/'text-editor'/'code-editor') — si aucune n'est
  # configurée, ouvre avec l'application par défaut du système (`open`
  # sans `-a`). Signale une erreur si l'ouverture échoue, plutôt que de
  # lancer silencieusement une commande cassée.
  def open_file_with_editor(path, editor)
    if editor.nil? || editor.empty?
      `open "#{path}"`
    else
      `open -a "#{editor}" "#{path}"`
    end
    RETOUR.error = ['backend-open-file-failed', [path, editor || '']] unless $?.success?
  end

  #######################################
  ###       DISPATCH de l'ACTION      ###
  #######################################
  
  case request["action"].strip

  # === Destuction d'un projet ===
  when 'remove-project'
    RETOUR.data = remove_or_archive_project(request['projectId'], false)
    
  when 'archive-project'
    RETOUR.data = remove_or_archive_project(request['projectId'], true)

  # === Sauvegarde d'un projet ===

  when "save-project"
    data = request["data"]
    project_id = data['id']
    # Debug.log("save-project reçu, id=#{project_id.inspect}")
    IO.write(project_path(project_id), data.to_yaml)
    APP_DATA['projects-in'] << project_id unless APP_DATA['projects-in'].include?(project_id)
    save_app_data
    RETOUR.data = {newProjectsIn: APP_DATA['projects-in']}
    # Debug.log("save-project terminé, id=#{project_id.inspect}")

  # === Sauvegarde des données de l'application ===

  when 'save-app-data'
    # Debug.log("save-app-data reçu, projects-in=#{request['data']['projects-in'].inspect}")
    IO.write(APP_DATA_FILE, request['data'].to_yaml)
    RETOUR.ok = true
    RETOUR.message = 'backend-app-data-save'
   
  # à l'initialisation (App.init)
  when 'load-all'
    require_relative 'lib/app.rb'
    RETOUR.data = App.load_all

  # Backup quotidien, appelé en fin de cycle de démarrage (App.init)
  when 'app-backup'
    require_relative 'lib/app_backup.rb'
    RETOUR.data = app_backup_run

  # Confirmation user malgré la baisse détectée (bouton "Je confirme")
  when 'app-backup-confirm'
    require_relative 'lib/app_backup.rb'
    RETOUR.data = app_backup_run(confirmed: true)

  # Bouton "Revenir au backup précédent"
  when 'app-backup-restore-previous'
    require_relative 'lib/app_backup.rb'
    RETOUR.data = app_backup_restore_previous

  # Lancement d'un script osascript
  when "run-osascript"
    require_relative 'lib/exec_script.rb'
    exec_script("#{request['script-name']}.scpt")


  when 'run-bashscript'
    require_relative 'lib/exec_script.rb'
    exec_script("#{request['script-name']}.sh")

  # Outil "Évaluer du code" (panneau Outils) — cf. backend/lib/code_eval.rb.
  # RETOUR.ok reste TOUJOURS true ici : un code qui échoue est un résultat
  # normal de l'outil (à afficher dans le dialog), pas une erreur de
  # bridge — ok:false ouvrirait l'ErrorsDialog générique de xbridge.js à
  # la place du callback de EvalCodeDialog (cf. convention ok:true/false).
  when 'eval-code'
    require_relative 'lib/code_eval.rb'
    RETOUR.data = CodeEval.run(request['language'], request['code'])

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
    require_relative 'lib/debug.rb'
    Debug.log("get-app-window-bounds : appel pour appName=#{request['appName'].inspect}")
    t0 = Time.now
    exec_script('GetAppWindowBounds.scpt', [request['appName']])
    Debug.log("get-app-window-bounds : retour en #{(Time.now - t0).round(3)}s, ok=#{RETOUR.ok.inspect}, error=#{RETOUR.error.inspect}")
  
  # Écriture du changelog et de la todo-list après minuteur
  when 'update-project-notes'
    require_relative 'lib/project_files.rb'
    update_project_notes(request)

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
      RETOUR.error = ['backend-unfound-file', path]
    else
      begin
        RETOUR.data = YAML.safe_load(File.read(path).gsub(/\n\s+\n/,"\n\n"))
      rescue Psych::SyntaxError => e
        RETOUR.error = ['backend-invalid-yaml', [path, e.message]]
      end
    end

  when 'open-file-yaml'
    open_file_with_editor(request['path'], APP_DATA['yaml-editor'] || APP_DATA['text-editor'])
  when 'open-file-text'
    open_file_with_editor(request['path'], APP_DATA['text-editor'])
  when 'open-file-code'
    open_file_with_editor(request['path'], APP_DATA['code-editor'])
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

  when /^todoist/
    require_relative 'lib/todoist.rb'
    Todoist.exec_request(request)


  # Toutes les opérations GIT
  when 'git-ope'
    require_relative 'lib/git.rb'
    args = request['git_args'] || []
    if request['project_path']
      args.unshift(request['project_path'])
    end
    RETOUR.data = Git.send(request['git_ope'], *args)


  # action inconnue => ERRREUR
  else 
    RETOUR.error = ['backend-unknown-action', request["action"]]
  end

  
rescue => e
  RETOUR.ok = false
  RETOUR.error = e.message
end

###########################################
###   La table JSON retournée au front  ###
###########################################
puts (RETOUR.output.to_json)

