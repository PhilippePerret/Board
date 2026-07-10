# Point d'entrée requis par tous les fichiers de test
# (Tests/specs/**/*.rb, via `require_relative '../../support/helpers'`).
#
# Aiguille vers l'implémentation du moteur de test choisi (variable
# BOARD_TEST_ENGINE, positionnée par Tests/version-*/run_tests.sh) :
# - non défini / "base" → helpers_base.rb (1 appel osascript par action,
#   version historique, inchangée)
# - "batch"             → version-batch/support/helpers.rb (regroupe les
#   actions sans valeur de retour en un seul appel osascript)

if ENV['BOARD_TEST_ENGINE'] == 'batch'
  require_relative '../version-batch/support/helpers'
else
  require_relative 'helpers_base'
end
