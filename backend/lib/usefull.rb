require "json"
require 'yaml'
require "fileutils"
require "timeout"

def ensure_folder(dpath)
  File.join(dpath).tap { |p| FileUtils.mkdir_p(p) }
end
def ensure_file(dpath, ini_content)
  File.join(dpath).tap { |fp| IO.write(fp, ini_content) unless File.exist?(fp) }
end

APP_FOLDER = File.dirname(__dir__)
DATA_SUPPORT_FOLDER = ensure_folder([Dir.home, "Library", "Application Support", "Board"])
PROJECT_CARD_FOLDER = ensure_folder([DATA_SUPPORT_FOLDER, 'project-cards'])

DEV_PROJECT_FOLDER   = File.join(APP_FOLDER, '_dev')

APP_DATA_FILE = ensure_file(
  [DATA_SUPPORT_FOLDER, 'appdata.json'], 
  {version:"0.0.0", 'projects-in':[], 'projects-out':[]}.to_json
  )

  # Les données courantes de l'application
APP_DATA = JSON.parse(IO.read(APP_DATA_FILE))

def save_app_data
  IO.write(APP_DATA_FILE, APP_DATA.to_json)
end
#
def project_path(project_id)
  File.join(PROJECT_CARD_FOLDER, "#{project_id}.yaml")
end

  
  COMMAND_PER_EXT = {
  '.scpt' => 'osascript',
  '.rb'   => 'ruby',
  '.sh'   => 'zsh'
}
SCRIPT_TIMEOUT = 8 # secondes
### === Jouer un script du dossier /scripts/ ===

def run_script(script_name, params = "")
  # - Préambule -
  # Quand script_name a pour extension .scpt, c'est peut-être un
  # scType oublié dans le service.
  # Mais comme je ne veux plus que ça soit indiqué, on fait un test 
  # ici pour trouver vraiment le script quand il n'existe pas.
  params = params.map {|s| s.inspect}.join(' ') if params.is_a?(Array)
  cmd = nil
  extname = File.extname(script_name)
  if extname == '.scpt'
    unless File.exist?("./scripts/#{script_name}")
      ini_script_name = "#{script_name}"
      script_name = search_real_scriptname(script_name)
      if script_name.nil?
        return {ok: false, name: "Impossible de trouver le script à jouer (#{ini_script_name})"}
      end
      extname = File.extname(script_name)
    end
  end
  pid = nil
  begin
    cmd = "#{COMMAND_PER_EXT[extname]} scripts/#{script_name} #{params}".strip
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
    if res == "" then {ok: null, message: "Aucun retour de la commande."}
    else JSON.parse(res) end
  rescue Timeout::Error
    (Process.kill('TERM', pid) rescue nil) if pid
    {
      ok: false,
      warning: "### TIMEOUT SCRIPT (> #{SCRIPT_TIMEOUT}s) ###",
      cmd: cmd,
      params: params.inspect
    }
  rescue Exception => e
    {
      ok: false,
      warning: "### ERREUR DE SCRIPT ###",
      script_error: e.message,
      cmd: cmd,
      params: params.inspect
    }
  end
end

def search_real_scriptname(script_name)
  folder = File.dirname(script_name)
  rootname = File.basename(script_name, File.extname(script_name))
  ['rb', 'sh', 'py', 'scpt'].each do |extension|
    # raise "Premier : #{File.absolute_path(File.join('scripts', "#{rootname}.#{extension}"))}"
    if File.exist?( File.join('scripts', new_file_name = "#{rootname}.#{extension}"))
      return new_file_name
    end
  end
  return nil
end

def human_date_to_aaammjj(date)
  y, m, j = date.split('/')
  "#{y}/#{m.rjust(2,'0')}/#{j.rjust(2,'0')}"
end
