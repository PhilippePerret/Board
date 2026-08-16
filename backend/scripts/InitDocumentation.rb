=begin

Script permettant d'initier la documentation AsciiDoctor

Reçoit le dossier de documentation (qui existe déjà). Y créer :
- le fichier principal <nom-du-dossier>.adoc
- un dossier adocs/ pour mettre les fichiers

=end
require_relative 'lib/utils.rb'


begin

  table = inited_table

  DOCU_FOLDER = ARGV[0].strip

  MAIN_FILE_NAME = "#{File.basename(DOCU_FOLDER)}.adoc"

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