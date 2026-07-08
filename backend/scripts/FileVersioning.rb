require 'json'

table = {ok: true, error: nil, message: nil}

begin

  FILEPATH    = ARGV[0] 
  FILENAME    = ARGV[1] 
  ARCHIVER    = ARGV[2] == 'true'
  VERSIONTERM = ARGV[3]

    
  table[:message] =  "Je dois versionner le #{VERSIONTERM} DE #{FILENAME} (#{ARCHIVER ? 'archiver' : 'ne pas archiver'})"

rescue Exception => e

  table[:ok] = false
  table[:error] = e.message
  
end

puts table.to_json