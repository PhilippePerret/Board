#!/usr/bin/env ruby

require 'json'

PROJECT_PATH        = ARGV[0]
GITHUB_ACCOUNT      = ARGV[1]
GITHUB_PROJET_NAME  = ARGV[2]
REMOTE_GIT_PATH = "git@github.com:#{GITHUB_ACCOUNT}/#{GITHUB_PROJET_NAME}.git"
GITIGNORE_FILE = File.join(PROJECT_PATH, '.gitignore')
GITIGNORE_DEFO = <<~GIT
.DS_Store

_dev/

dev/

tmp/

temp/

GIT

def prefix(command)
  return "cd '#{PROJECT_PATH}' && git #{command}"
end

output = {ok: true, error: nil}
begin

  command = prefix('init')
  `#{command}`

  # Création du fichier gitignore
  command = "Création du fichier .gitignore"
  IO.write(GITIGNORE_FILE, GITIGNORE_DEFO)

  command = prefix('add -A')
  `#{command}`
  command = prefix('commit -m "first commit"')
  `#{command}`
  command = prefix('branch -M main')
  `#{command}`
  command = prefix("remote add origin #{REMOTE_GIT_PATH}")
  `#{command}`
  command = prefix('push -u origin main')
  `#{command}`
  
rescue Exception => e
  output[:ok] = false
  output[:error] = "Impossible d'exécuter la commande #{command} : #{e.message}"
end

begin

  # Création du fichier gitignore

rescue Exception => e

end

puts output.to_json