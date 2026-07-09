require "json"
require 'yaml'
require "fileutils"

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
  File.join(PROJECT_CARD_FOLDER, "#{project_id}")
end

  
  COMMAND_PER_EXT = {
  '.scpt' => 'osascript',
  '.rb'   => 'ruby',
  '.sh'   => 'zsh'
}
### === Jouer un script du dossier /scripts/ ===

def run_script(script_name, params = "")
  params = params.map {|s| s.inspect}.join(' ') if params.is_a?(Array)
  cmd = nil
  extname = File.extname(script_name)
  case extname
  when '.scpt', '.rb', '.sh'
    begin
      cmd = "#{COMMAND_PER_EXT[extname]} scripts/#{script_name} #{params}".strip
      # return  {script_command: "cmd = #{cmd}"}
      res = `#{cmd}`
      if res == "" then {ok: null, message: "Aucun retour de la commande."}
      else JSON.parse(res) end
    rescue Exception => e
      {ok: false, error: "### ERREUR DE SCRIPT : #{e.message}\navec la commande : #{cmd}"}
    end
  else
    {ok: false, error: "Je ne sais pas traiter un script #{script_name}"}
  end
end

def human_date_to_aaammjj(date)
  y, m, j = date.split('/')
  "#{y}/#{m.rjust(2,'0')}/#{j.rjust(2,'0')}"
end
