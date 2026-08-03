=begin

Script permettant d'initier la documentation AsciiDoctor

Créer :
- dans le container désigné…
- un fichier principal docu.adoc
- un dossier adocs/ pour mettre les fichiers
- le fichier de raccourcis macros.rb

=end
require_relative 'lib/utils.rb'


begin
  
  table = inited_table
  
  CONTAINER         = ARGV[0].strip
  DOCU_FOLDER_NAME  = ARGV[1].strip
  MAIN_FILE_NAME    = ARGV[2].strip

  if File.exist?(File.join(CONTAINER, DOCU_FOLDER_NAME))
    raise "Le dossier existe déjà, je ne peux pas créer la documentation ici."
  end
  DOCU_FOLDER = ensure_folder(CONTAINER, DOCU_FOLDER_NAME)

  ADOCS_FOLDER = ensure_folder(DOCU_FOLDER, 'adocs')
  FIRST_ADOC_FILE = File.join(ADOCS_FOLDER, 'introduction.adoc')
  MAIN_DOCU_FILE = File.join(DOCU_FOLDER, MAIN_FILE_NAME)

  IO.write(MAIN_DOCU_FILE, "= Documentation =\n\ninclude::adocs/introduction.adoc[]\n")
  IO.write(FIRST_ADOC_FILE, "== Introduction ==\n\nIntroduction à la documentation.\n")

  table[:message] = "Documentation prête. Utiliser Éditer documentation pour l'éditer."

rescue Exception => e
  table[:ok] = false
  table[:error] = e.message

end

puts table.to_json