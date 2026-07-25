### === Jouer un script du dossier /scripts/ ===

def exec_script(script_name, params = "")

  # RETOUR.ok = true
  # RETOUR.message = "Retour de script #{script_name}"
  # return

  # - Préambule -
  # Quand script_name a pour extension .scpt, c'est peut-être un
  # scType oublié dans le service.
  # Mais comme je ne veux plus que ça soit indiqué, on fait un test 
  # ici pour trouver vraiment le script quand il n'existe pas.
  cmd = nil
  extname = File.extname(script_name)
  if extname == '.scpt'
    unless File.exist?("./scripts/#{script_name}")
      ini_script_name = "#{script_name}"
      script_name = search_real_scriptname(script_name)
      if script_name.nil?
        RETOUR.ok = false
        RETOUR.error = "Impossible de trouver le script à jouer (#{ini_script_name})"
        return
      end
      extname = File.extname(script_name)
    end
  end
  pid = nil
  begin
    # Certains script AS ont besoin de la librairie (à l'avenir : tous)
    if OSASCRIPT_WITH_LIB.key?(script_name)
      params = case params
      when String then [params]
      when Array then params
      else []
      end
      folder = File.expand_path(File.join(__dir__, '..', 'scripts'))
      params.unshift File.join(folder, 'lib', 'Lib.scpt')
      # return {params: params}
    else
      # return {non: "#{script_name} n'appartient pas à #{OSASCRIPT_WITH_LIB.inspect}"}
    end
    # On met les paramètres en string
    params = params.map {|s| s.inspect}.join(' ') if params.is_a?(Array)
    cmd = "#{COMMAND_PER_EXT[extname]} scripts/#{script_name} #{params}".strip
    RETOUR.command = cmd
    # return  {script_command: "cmd = #{cmd}"}
    res = nil
    # Timeout dur : un script (ou une commande qu'il lance, ex. osascript
    # "tell application Board to activate" pendant que le thread principal
    # de Board attend justement CE process) peut bloquer indéfiniment sinon,
    # gelant toute l'app (le bridge est synchrone côté Swift).
    Timeout.timeout(SCRIPT_TIMEOUT) do
      IO.popen("#{cmd} 2>&1") do |io|
        pid = io.pid
        res = io.read
      end
    end
    if res == "" then
      RETOUR.ok = nil
      RETOUR.message = "Aucun retour de commande."
    else 
      #################################################
      ###       Un bon retour de script             ###
      #################################################
      RETOUR.ok   = true
      RETOUR.data = JSON.parse(res)
    end
  rescue Timeout::Error
    (Process.kill('TERM', pid) rescue nil) if pid
    RETOUR.ok = false
    RETOUR.error = "### TIMEOUT SCRIPT (> #{SCRIPT_TIMEOUT}s) ###"
    RETOUR.data = {
      "cmd" => cmd,
      "params" => params.inspect
    }
  rescue Exception => e
    RETOUR.ok = false
    RETOUR.error = e.message
    RETOUR.data = {
      "cmd" => cmd,
      "params" => params.inspect
    }
  end
end
