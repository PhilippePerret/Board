require 'json'

DOCU_FOLDER = ARGV[0]
DOCU_NAME   = ARGV[1]
EDITOR_NAME = ARGV[2]

table = {ok: true, message: nil, error: nil}

if File.exist?(DOCU_FOLDER) 
  `open -a "#{EDITOR_NAME}" "#{DOCU_FOLDER}"`
  table[:message] = "Dossier de documentation ouvert avec succès dans #{EDITOR_NAME}"
else
  table[:ok] = false
  table[:error] = "Le dossier de documantation '#{DOCU_FOLDER}' est introuvable."
end

puts table.to_json