require 'json'

PATH = ARGV[0]

begin
  table = {ok: true, error: nil, message: nil}
  if File.exist?(PATH)
    `open "#{PATH}"`
  else
    raise new Error("Fichier introuvable : #{PATH}")
  end
rescue Exception => e
  table[:ok] = false
  table[:error] = e.message
end

puts table.to_json