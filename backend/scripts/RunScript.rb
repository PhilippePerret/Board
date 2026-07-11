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
    message = `open "#{FILEPATH}"`
  end
rescue Exception => e
  ok = false
  error = e.message
end

table = {ok: ok, message: message, error: error}

puts table.to_json