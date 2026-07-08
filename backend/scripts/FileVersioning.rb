require 'fileutils'
require 'json'
=begin

Produit une version du fichier spécifié
---------------------------------------

Plusieurs case peuvent se produire

CAS 1 Le fichier ne doit pas être archivé
  - il contient donc son numéro de version dans son nom
  - il faut juste changer son numéro de version

CAS 2 Le fichier doit être archivé

CAS 2.1 Le fichier doit être versionné dans l'archive
  - il ne contient pas de numéro de version dans son nom
  - il faut prendre le dernier numéro d'archive

CAS 2.2 Le fichier doit être versionné lui-même
  - il faut le déplacer dans l'archive tel qu'il est
  - il faut modifier son nom vers la nouvelle version

=end

table = {ok: true, error: nil, message: nil}
suivi = []

begin

  REG_VERSION = /^(.*?)([0-9]+)\.([0-9]+)(?:\.([0-9]+))?(.*?)$/


  class MyFile 
    attr_reader :name
    attr_reader :prefix, :postfix, :major, :minor, :patch
    def initialize(name) 
      @name = name
      parse
    end

    def parse
      if version_in_name?
        @prefix, ma, mi, pa, @postfix = name.match(REG_VERSION).captures
        @major, @minor, @patch = [ma, mi, pa].map {|n| n.to_i}
      else
        @postfix  = File.extname(name)
        @prefix   = File.basename(name, postfix)
      end
    end

    def version_in_name? = name.match?(REG_VERSION)
    def ksort = [major, minor, patch]

    def next_version(term)
      pa = term == 'patch' ? patch + 1 : patch
      mi = term == 'minor' ? minor + 1 : minor
      ma = term == 'major' ? major + 1 : major
      "#{prefix}#{ma}.#{mi}.#{pa}#{postfix}"
    end

  end # end class MyFile


  FILEPATH        = ARGV[0] 
  FILENAME        = ARGV[1]
  FEXTNAME        = File.extname(FILENAME)
  afold           = ARGV[2]
  ARCHIVE_FOLDER  = afold == "nil" ? nil : afold
  VERSIONTERM     = ARGV[4]



  message = []

  myfile = MyFile.new(FILENAME)
  suivi << "le fichier " + (myfile.version_in_name? ? 'a' : 'n’a pas') + ' son numéro de version'

  has_version_in_name = myfile.version_in_name?
  if has_version_in_name
    new_version_name = myfile.next_version(VERSIONTERM)
  end

  if ARCHIVE_FOLDER
    if has_version_in_name
      # On déplace le fichier dans les archives et l'on change son nom
      dest = File.join(ARCHIVE_FOLDER, FILENAME)
      FileUtils.mv(FILEPATH, dest)
      FileUtils.rename(FILEPATH, new_version_name)
      message << "Déplacé dans l'archive et renuméroté #{new_version_name.inspect}"
    elsif File.exist?(ARCHIVE_FOLDER)
      # C'est la version dans le dossier qu'il faut prendre
      sorted_files = Dir["#{ARCHIVE_FOLDER}/*#{FEXTNAME}"]
        .reverse
        .map do |p|
          MyFile.new(File.basename(p))
        end
        .filter do |mf| 
          # puts "mf.prefix: #{mf.prefix} / #{(myfile.prefix + '-').inspect}"
          mf.prefix == (myfile.prefix + '-') && mf.postfix == myfile.postfix 
        end.sort_by(&:ksort)
      # puts sorted_files.inspect
      # rdata = sorted_files.map {|mf| mf.name + mf.ksort.inspect }.join(', ')
      lastfile = sorted_files.last
      dest = File.join(ARCHIVE_FOLDER, lastfile.next_version(VERSIONTERM))
      FileUtils.cp(FILEPATH, dest)
      if File.exist?(dest)
        message << "Version sauvegardée en archives."
      else
        raise "Version non archivées suite à un problème inconnu."
      end
    else
      raise "Dossier archive introuvable : #{ARCHIVE_FOLDER}."
    end
  else
    if has_version_in_name
      message << "Renommage du fichier : #{new_version_name.inspect}."
    else
      raise "Le fichier ne contient pas de numéro de version, je ne peux pas le versionner."
    end
  end  

  table[:message] =  message.join(', ')

rescue Exception => e

  table[:ok] = false
  table[:error] = e.message
  
end

# table["rdata"] = rdata

puts table.to_json