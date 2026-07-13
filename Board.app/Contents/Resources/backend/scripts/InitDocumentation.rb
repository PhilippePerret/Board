=begin

Script permettant d'initier la documentation AsciiDoctor

Créer :
- un fichier principal docu.adoc
- un dossier adocs/ pour mettre les fichiers
- le fichier de raccourcis macros.rb

=end
require_relative 'lib/utils.rb'


begin
  
  table = inited_table
  
  CONTAINER = ARGV[0].strip

  # Nouvel essai pour ce script : trouver le macros.rb le plus récent
  HOME = File.expand_path('~/Programmes')
  cmd = %Q(find "#{HOME}" -type f -name 'macros.rb' -exec stat -f '%m %N' {} \\; | sort -nr | head -n1 | cut -d' ' -f2-)
  last_macro_file = `#{cmd}`

  DOCU_FOLDER = ensure_folder(CONTAINER, 'Documentation')
  ADOCS_FOLDER = ensure_folder(DOCU_FOLDER, 'adocs')
  FIRST_ADOC_FILE = File.join(ADOCS_FOLDER, 'introduction.adoc')
  MAIN_DOCU_FILE = File.join(DOCU_FOLDER, "docu.adoc")

  IO.write(MAIN_DOCU_FILE, "= Documentation =\n\ninclude::adocs/introduction.adoc[]\n")
  IO.write(FIRST_ADOC_FILE, "== Introduction ==\n\nIntroduction à la documentation.\n")

  table[:message] = "Documentation prête. Utiliser Éditer documentation pour l'éditer."

rescue Exception => e
  table[:ok] = false
  table[:error] = e.message

end

puts table.to_json