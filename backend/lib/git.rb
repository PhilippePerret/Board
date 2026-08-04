=begin

Pour toutes les opérations Git

Toutes ces fonctions sont appelées par :
  - l'action 'git-ope' 
  - les arguments git_args (array)
  - le chemin du projet 'project_path'

Toutes les fonctions ont en premier argument le chemin d'accès
au fichier.
=end
require_relative 'usefull.rb'
require 'shellwords'

class Git
class << self

  def commit(project_path:, files:, message:)
    files = JSON.parse(files)
    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git add #{files.map { |p| Shellwords.escape(p) }.join(' ')}
    git commit -m #{Shellwords.escape(message)}
    git push
    BASH
    `#{cmd}`
  end

  # Retourne la liste des labels Github du projet
  def get_labels(path)
    cmd = <<~BASH
    exec 2>&1
    cd "#{path}"
    gh label list --json name --jq '.[].name'
    BASH
    res = `#{cmd}`
    res.split("\n").join(',')
  end

  # Retourne les fichiers en cours de traitement 
  def get_status_files(path)
    longuest_name = 0
    longuest_path = 0
    res = `cd "#{path}" && git status -s`
      .split("\n")
      .map do |file|
        mark = file[0..1].strip
        path = file[3..-1]
        name = File.basename(path)
        folder = File.dirname(path)
        longuest_name = name.length if name.length < 21 && name.length > longuest_name
        longuest_path = path.length if path.length < 32 && path.length > longuest_path
        [mark, name, folder, path]
      end
      .map do |dfile|
        mark, name, folder, path = dfile
        mark = case mark
        when 'M'  then 'Mod'
        when '??' then 'New'
        when 'A'  then 'Add'
        when 'R'  then 'Del'
        else mark
        end
        original_name = name
        name = 
          if name.length > longuest_name
            name[0..longuest_name - 2] + ' …'
          else
            name.ljust(longuest_name, ' ')
          end
        original_folder = folder
        folder =
          if folder.length > longuest_path
            folder[0..longuest_path - 2] + ' …'
          else
            folder.ljust(longuest_path, ' ')
          end
        [path, "<span title='#{original_name}'>#{name}</span> <span title='#{original_folder}'>#{folder}</span> (#{mark})"]
      end
  end
end #/<< self
end #/Git