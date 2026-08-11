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
  FILENAME        = File.basename(FILEPATH)
  FEXTNAME        = File.extname(FILENAME)
  afold           = ARGV[1]
  ARCHIVE_FOLDER  = (afold == "nil" || afold.nil? || afold.empty?) ? nil : afold
  VERSIONTERM     = ARGV[2]



  message = []

  myfile = MyFile.new(FILENAME)

  has_version_in_name = myfile.version_in_name?
  if has_version_in_name
    new_version_name = myfile.next_version(VERSIONTERM)
  end

  if ARCHIVE_FOLDER
    if has_version_in_name
      # On déplace le fichier dans les archives et l'on change son nom
      dest = File.join(ARCHIVE_FOLDER, FILENAME)
      FileUtils.mv(FILEPATH, dest)
      File.rename(FILEPATH, new_version_name)
      message << ['backend-archiv-move-and-num', new_version_name.inspect]
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
      new_archive_name = lastfile ? lastfile.next_version(VERSIONTERM) : "#{myfile.prefix}-1.0.0#{myfile.postfix}"
      dest = File.join(ARCHIVE_FOLDER, new_archive_name)
      FileUtils.cp(FILEPATH, dest)
      if File.exist?(dest)
        message << 'backend-archiv-saved'
      else
        puts({'ok' => false, 'error' => ['backend-archiv-unknown-problem']}.to_json)
        exit 0
      end
    else
      puts({'ok' => false, 'error' => ['backend-archiv-unfound-folder', ARCHIVE_FOLDER]}.to_json)
      exit 0
    end
  else
    if has_version_in_name
      new_version_path = File.join(File.dirname(FILEPATH), new_version_name)
      File.rename(FILEPATH, new_version_path)
      message << "Renommage du fichier : #{new_version_name.inspect}."
    else
      puts({'ok' => false, 'error' => ['backend-version-no-num', new_version_name.inspect]}.to_json)
      exit 0
    end
  end  

  table[:message] =  [message, []]
  
end

puts table.to_json