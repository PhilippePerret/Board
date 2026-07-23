require 'yaml'
require 'json'
require 'csv'

class FileHandy
class << self
    
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