require 'json'

table = {ok: true, error: nil, message: nil}

begin

  FILEPATH = ARGV[0] 
  FILENAME = ARGV[1] 
  VERSIONTERM = ARGV[2]

    
  table[:message] =  "Je dois versionner le #{VERSIONTERM} DE #{FILENAME}"

rescue Exception => e

  table[:ok] = false
  table[:error] = e.message
  
end

puts table.to_json