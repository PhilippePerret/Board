require 'fileutils'
require 'yaml'
require 'json'
require 'csv'

SELF_LOAD = __FILE__ == $0

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

  # Ajouter le contenu +content+ au fichier +path+ en le
  # plaçant avant +before+ ou après +after+
  # Plus tard, pour definir quelque chose comme [{after: "ça"}, {before: "ça"}, etc.]
  def add_to_file(request)
    path    = request['path']
    content = request['content']
    after   = request['after']
    before  = request['before']
    where   = request['where']

    if File.exist?(path)
      code = IO.read(path)
      if where
        apres = code
        avant = ""
        where = JSON.parse(where) unless where.is_a?(Array)
        # => [{after: "mot"}, {before: "autre"}] 
        # P.e. phrase = "Je dois mettre au grenier un mot entre chambre et grenier."
        # where = [{after: "chambre"}, {before: "grenier"}]
        where.each do |cond|
          # puts "cond: #{cond.inspect} (#{cond.keys[0].inspect} / #{cond.values[0].inspect})"
          reg = Regexp.new(cond.values[0])
          dec = apres =~ reg
          deb = $~.begin(0)
          fin = $~.end(0)
          case cond.keys[0]
          when "after", :after
            avant += apres[0..fin-1]
            apres = apres[fin...]
          when "before", :before
            if deb > 0
              avant += apres[0..deb]
              apres = apres[deb...]
            end
          end
          # puts "---"
          # puts "avant = #{avant.inspect}"
          # puts "apres = #{apres.inspect}"
        end
        content = avant + content + apres
      elsif after
        dec = code.index(after) + after.length
        content = code[0..dec] + content + code[(dec+1)..]
      elsif before
        dec = code.index(before)
        content = code[0..dec] + content + code[(dec+1)...]
      else 
        content = code + content
      end
    end
    puts "content: #{content.inspect}" if SELF_LOAD
    IO.write(path, content)
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


if SELF_LOAD # tests


  puts "Je vais faire les tests"

  # Créer le fichier
  File.delete("./essai.txt") if File.exist?("./essai.txt")
  FileHandy.add_to_file(path: "./essai.txt", after:nil, before: nil, where: nil, content: "Je dois mettre au grenier un mot entre chambre et grenier.")
  res = FileHandy.add_to_file(path: "./essai.txt", content: ", cuisine", after: nil, before: nil, where: [{after: "chambre"}, {before:" et grenier"}])
  puts res
  File.delete("./essai.txt") if File.exist?("./essai.txt")
end