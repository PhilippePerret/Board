#!/usr/bin/env ruby

require 'json'

message = nil
error  = nil
ok = true

# Todo : pouvoir transmettre des paramètres au script

begin
  FILEPATH = ARGV[0]
  case File.extname(FILEPATH)
  when '.rb' then message = `ruby #{FILEPATH}`
  when '.py' then message = `python3 #{FILEPATH}`
  when '.sh' then message = `bash #{FILEPATH}`
  else
    # Sinon, si le script est exécutable, on le lance
    if File.executable?(FILEPATH)
      message = `"#{FILEPATH}"` 
    else
      ok = false
      error = ['unrunnable-file', FILEPATH]
    end
  end
rescue Exception => e
  ok = false
  error = e.message
end

table = {ok: ok, message: message, error: error}

puts table.to_json