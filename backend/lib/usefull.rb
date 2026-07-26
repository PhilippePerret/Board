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
  [DATA_SUPPORT_FOLDER, 'appdata.yaml'],
  {'version' => "0.0.0", 'projects-in' => [], 'projects-out' => []}.to_yaml
  )

  # Les données courantes de l'application
APP_DATA = YAML.safe_load(IO.read(APP_DATA_FILE))
APP_DATA["support_folder"] = DATA_SUPPORT_FOLDER

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
    {error: "Projet #{pid} introuvable dans les archives."}
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
    return {error: "Projet introuvable : #{project_id} (dans #{PROJECT_CARD_FOLDER})"}
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
SCRIPT_TIMEOUT = 30 # secondes


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
