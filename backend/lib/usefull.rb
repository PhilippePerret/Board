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
# BOARD_TEST_DATA_DIR (positionné par Tests/support/helpers_base.rb#launch_app
# et Tests/version-pont/run_tests.sh) redirige TOUTES les données app vers un
# dossier de test dédié — jamais le dossier réel, même si le process est tué
# par un signal non interceptable (kill -9) avant tout nettoyage.
DATA_SUPPORT_FOLDER = ensure_folder(ENV['BOARD_TEST_DATA_DIR'] ? [ENV['BOARD_TEST_DATA_DIR']] : [Dir.home, "Library", "Application Support", "Board"])
PROJECT_CARD_FOLDER = ensure_folder([DATA_SUPPORT_FOLDER, 'project-cards'])

# Board.app est lancé par Finder/LaunchServices : le process (et donc ce
# script Ruby, et tout ce qu'il lance ensuite via backtick/IO.popen)
# n'hérite PAS du PATH d'un shell de login (pas de .zshrc/.zprofile
# sourcé). Sans ça, des commandes Homebrew (ex. gh) sont introuvables
# même si elles marchent très bien dans un Terminal.
#
# On récupère le vrai PATH en interrogeant le shell de login de
# l'utilisateur ($SHELL -ilc), et on le pose une bonne fois pour toutes
# dans ENV['PATH'] : tout backtick/IO.popen lancé ensuite dans ce
# process (git.rb, exec_script.rb, scripts de backend/scripts/...) en
# hérite automatiquement. Résultat mis en cache (coûte 100-300ms sinon),
# invalidé si un fichier rc a été modifié depuis (comparaison de mtime).
# Même fichier de cache que ExecCommand.sh (backend/scripts/), qui a la
# même logique côté bash pour les scripts lancés hors de ce process.
def load_real_user_path!
  cache_file = File.join(DATA_SUPPORT_FOLDER, 'user_path.cache')
  rc_files = %w[.zshenv .zprofile .zshrc .bash_profile .bashrc].map { |f| File.join(Dir.home, f) }

  need_refresh = true
  if File.exist?(cache_file)
    cache_mtime = File.mtime(cache_file)
    need_refresh = rc_files.any? { |rc| File.exist?(rc) && File.mtime(rc) > cache_mtime }
  end

  if need_refresh
    user_path = `#{ENV['SHELL']} -ilc 'echo -n $PATH'`.strip
    IO.write(cache_file, user_path) unless user_path.empty?
  else
    user_path = IO.read(cache_file)
  end

  ENV['PATH'] = user_path unless user_path.nil? || user_path.empty?
end
load_real_user_path!

DEV_PROJECT_FOLDER   = File.join(APP_FOLDER, '_dev')

APP_DATA_FILE = ensure_file(
  [DATA_SUPPORT_FOLDER, 'appdata.yaml'],
  {'version' => "0.0.0", 'projects-in' => [], 'projects-out' => []}.to_yaml
  )

  # Les données courantes de l'application
APP_DATA = YAML.safe_load(IO.read(APP_DATA_FILE))
APP_DATA["support_folder"] = DATA_SUPPORT_FOLDER
APP_DATA['lang'] ||= 'fr-FR' # seule langue disponible pour le moment

# tag::scripts-with-lib[]
OSASCRIPT_WITH_LIB = {
  'OpenOrUpdateInBrowser.scpt' => true
}
# end::scripts-with-lib[]

def save_app_data
  IO.write(APP_DATA_FILE, APP_DATA.to_yaml)
end
#
def project_path(project_id)
  File.join(PROJECT_CARD_FOLDER, "#{project_id}.yaml")
end

def options_for_archived_project
  new_projects_out = []
  options = APP_DATA['projects-out'].map do |pid|
    card_path = File.join(PROJECT_CARD_FOLDER, "#{pid}.yaml")
    if File.exist?(card_path)
      new_projects_out << pid
      dataproj = YAML.safe_load(IO.read card_path)
      [pid, dataproj['title']]
    end
  end.compact
  if new_projects_out != APP_DATA['projects-out']
    APP_DATA['projects-out'] = new_projects_out
    save_app_data
  end
  return options
end

def move_project_out_to_projects_in(pid)
  card_path = File.join(PROJECT_CARD_FOLDER, "#{pid}.yaml")
  if APP_DATA['projects-out'].delete(pid) && File.exist?(card_path)
    APP_DATA['projects-in'] << pid
    save_app_data
    return {
      project: YAML.safe_load(IO.read(card_path)),
      newProjectsIn: APP_DATA['projects-in'],
      newProjectsOut: APP_DATA['projects-out']
    }
  else
    {error: ['backend-app-project-unfound', pid]}
  end
end

def remove_or_archive_project(project_id, archive_it)

  if File.exist?(card = project_path(project_id))
    APP_DATA['projects-in'].delete(project_id)
    if archive_it
      APP_DATA['projects-out'] << project_id
    else
      File.delete(card)
    end
     save_app_data
  else
    return {error: ['backend-app-project-unfound', project_id]}
  end
  return {
    newProjectsIn: APP_DATA['projects-in'],
    newProjectsOut: APP_DATA['projects-out']
  }
end

  
  COMMAND_PER_EXT = {
  '.scpt' => 'osascript',
  '.rb'   => 'ruby',
  '.sh'   => 'zsh'
}
SCRIPT_TIMEOUT = 60 # secondes


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
