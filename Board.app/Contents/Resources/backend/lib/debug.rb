require 'time'

# Log de debug persistant, pour les cas où la console dev (qui se ferme
# avec l'app) ne suffit pas — ex. observer ce que reçoit le backend pendant
# un run de tests, après coup.
#
# Fichier volontairement HORS de ~/Library/Application Support/Board/ (donc
# pas effacé par Tests/version-*/run_tests.sh, qui déplace/restaure ce seul
# dossier autour de chaque run).
#
# Usage : Debug.log("save-app-data reçu, projects-in=#{...}")
module Debug
  LOG_FILE = File.join(Dir.home, 'Library', 'Application Support', 'Board-debug.log')

  module_function

  def log(msg)
    File.open(LOG_FILE, 'a') { |f| f.puts("#{Time.now.strftime('%H:%M:%S.%L')} #{msg}") }
  end
end
