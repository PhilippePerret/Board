# Point d'entrée requis par tous les fichiers de test
# (Tests/specs/**/*.rb, via `require_relative '../../support/helpers'`).
#
# Aiguille vers l'implémentation du moteur de test choisi (variable
# BOARD_TEST_ENGINE, positionnée par Tests/version-*/run_tests.sh) :
# - non défini / "base" → helpers_base.rb (1 appel osascript par action,
#   version historique, inchangée)
# - "batch"             → version-batch/support/helpers.rb (regroupe les
#   actions sans valeur de retour en un seul appel osascript)
# - "pers"        → version-pers/support/helpers.rb (1 seul
#   process osascript gardé ouvert toute la spec, au lieu d'un par action)
# - "swift"       → version-swift/support/helpers.rb (1 seul process natif,
#   binaire Swift compilé qui appelle AXUIElement directement, sans System
#   Events)
#
# Le moteur "compiled" n'a pas besoin d'entrée ici : il réutilise
# helpers_base.rb tel quel, seul BOARD_TEST_AX_SCRIPT change (cf. plus bas).

case ENV['BOARD_TEST_ENGINE']
when 'batch'
  require_relative '../version-batch/support/helpers'
when 'pers'
  require_relative '../version-pers/support/helpers'
when 'swift'
  require_relative '../version-swift/support/helpers'
else
  require_relative 'helpers_base'
end
