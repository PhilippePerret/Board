#!/usr/bin/env ruby

require 'json'

message = nil
error  = nil
ok = true


begin
  FILEPATH = ARGV[0]
  `open "#{FILEPATH}"`
rescue Exception => e
  ok = false
  error = e.message
end

table = {ok: ok, message: message, error: error}

puts table.to_json