require 'fileutils'
require 'yaml'
require 'json'
require 'csv'

class FileHandy
class << self
    
  def open(path)
    if File.exist?(path)
      `open "#{path}"`
    else
      RETOUR.error "Fichier introuvable : #{path}"
    end
  end

  def create(path, content)
    if File.exist?(File.dirname(path))
      IO.write(path, content)
    else
      RETOUR.error = "Le dossier '#{File.dirname(path)}' est introuvable. Impossible de créer le fichier en toute confiance."
    end
  end

  def copy(source, dest)
    FileUtils.copy(source, dest)
    dest = File.join(dest, File.basename(source)) if File.directory?(dest)
    if File.exist?(dest)
      RETOUR.message = "Le fichier #{dest} a été créé."
    else
      RETOUR.error = "Le fichier #{dest} n'a pas pu être créé."
    end
  end
  # Ajoute un objet à une liste d'objet ou l'enregistre
  # dans un fichier
  def add_objet(path, objet)
    
    if File.exist?(path)
      data = evaluate(path)
      data.push(objet)
    else
      case File.extname(path).downcase
      when '.yaml', '.yml', '.json', '.csv'  then 
        data = []
        data.push(objet)
      when '.txt', '.text', '.md', '.markdown'
        data = objet
      end
    end

    case File.extname(path).downcase
    when '.yaml', '.yml'  then data = data.to_yaml
    when '.json'          then data = data.to_json
    when '.csv'           then data = data.to_csv
    when '.xml'           then return RETOUR.error("Pas encore de lecture des fichiers XML.")
    when '.txt', '.text', '.md', '.markdown' then data = data
    else                  data = data.to_yaml
    end
    IO.write(path, data)
  end

  def evaluate path
    if !File.exist?(path)
      RETOUR.error = "Fichier inexistant"
      return
    end

    case File.extname(path).downcase
    when '.yaml', '.yml'  then RETOUR.data = YAML.safe_load(IO.read(path))
    when '.json'          then RETOUR.data = JSON.parse(IO.read(path))
    when '.csv'           then RETOUR.data = CSV.read(path)
    when '.xml'           then RETOUR.error("Pas encore de lecture des fichiers XML.")
    else 
      # On doit essayer d'évaluer le fichier et de prendre le 
      # résultat qui doit obligatoirement, aujourd'hui être au
      # format JSON
      begin
        res = `#{path} 2>&1`
        RETOUR.data = JSON.parse(res)
      rescue Exception => e
        RETOUR.error e.message
      end
    end
  end
end #/<< self
end #/FileHandy