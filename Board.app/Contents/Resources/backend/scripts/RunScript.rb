#!/usr/bin/env ruby

require 'json'

FILEPATH = ARGV[0]

`open "#{FILEPATH}"`

puts {ok: true, message: "Fichier ouvert avec succès."}.to_json