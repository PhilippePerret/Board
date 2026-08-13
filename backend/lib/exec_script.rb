### === Jouer un script du dossier /scripts/ ===

require 'open3'

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
        RETOUR.error = ['backend-script-unfound', ini_script_name]
        return
      end
      extname = File.extname(script_name)
    end
  end
  pid = nil
  begin
    # Normalisé en tableau une fois pour toutes, AVANT tout traitement —
    # chaque élément deviendra un argument de process séparé (IO.popen en
    # forme tableau ci-dessous), jamais réinterprété par un shell
    # intermédiaire. Un script comme ExecCommand.sh (services 'git-issue-
    # list', 'exec-bash-code'…) reçoit ainsi son script shell tel quel, en
    # UN SEUL argument, à charge pour son propre `eval` interne de
    # l'interpréter — jamais une seconde fois par un shell extérieur avant
    # (cf. bug 2026-08-05 : "$n" d'une boucle for shell prématurément
    # expansé — vide — par ce shell extérieur, avant d'atteindre la boucle
    # elle-même).
    params = case params
    when String then params.empty? ? [] : [params]
    when Array then params.dup
    else []
    end

    # Certains script AS ont besoin de la librairie (à l'avenir : tous)
    if OSASCRIPT_WITH_LIB.key?(script_name)
      folder = File.expand_path(File.join(__dir__, '..', 'scripts'))
      params.unshift File.join(folder, 'lib', 'Lib.scpt')
    end

    argv = [COMMAND_PER_EXT[extname], "scripts/#{script_name}", *params.map { |p| p.nil? ? '' : p.to_s }]
    cmd = argv.join(' ') # pour affichage/debug (RETOUR.command) seulement
    RETOUR.command = cmd
    res = nil
    res_err = nil
    # Timeout dur : un script (ou une commande qu'il lance, ex. osascript
    # "tell application Board to activate" pendant que le thread principal
    # de Board attend justement CE process) peut bloquer indéfiniment sinon,
    # gelant toute l'app (le bridge est synchrone côté Swift).
    status = nil
    Timeout.timeout(SCRIPT_TIMEOUT) do
      # stdout et stderr capturés SÉPARÉMENT (jamais fusionnés) : tout ce
      # qu'un sous-processus lancé PAR le script (ex. `git checkout -b`,
      # dont les messages informatifs sortent sur stderr) écrit sur le
      # stderr hérité du script atterrit dans res_err, jamais mélangé au
      # stdout — seul flux sur lequel le script écrit son JSON final
      # (`puts …to_json`), seul flux que JSON.parse doit lire.
      Open3.popen3(*argv) do |stdin, stdout, stderr, wait_thr|
        pid = wait_thr.pid
        stdin.close
        out_reader = Thread.new { stdout.read }
        err_reader = Thread.new { stderr.read }
        res     = out_reader.value
        res_err = err_reader.value
        status  = wait_thr.value
      end
    end
    RETOUR.ok = status.success?
    if status.success?
      #################################################
      ###       Un bon retour de script             ###
      #################################################
      # Un script qui réussit sans rien écrire sur sa sortie (ex.
      # `open` qui ne produit rien) vaut un succès simple, pas une
      # erreur de format JSON.
      if res.nil? || res.strip.empty?
        RETOUR.ok = true
      else
        retour_script = JSON.parse(res)
        if retour_script["ok"] == false
          RETOUR.ok     = false
          RETOUR.error  = retour_script["error"]
          RETOUR.data   = retour_script
        else
          RETOUR.ok       = true
          RETOUR.message  = retour_script["message"]
          RETOUR.data     = retour_script
        end
      end
    else
      RETOUR.ok     = false
      erreur = [res, res_err].compact.join("\n")
      if erreur.match?(/-25211|accès d.aide|assistive access/i)
        RETOUR.error = ['backend-access-unabled']
      else
        RETOUR.error = erreur
      end
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
