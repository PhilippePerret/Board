# Point d'entrée requis par tous les fichiers de test
# (Tests/specs/**/*.rb, via `require_relative '../../support/helpers'`).
#
# Aiguille vers l'implémentation du moteur de test choisi (variable
# BOARD_TEST_ENGINE, positionnée par Tests/version-*/run_tests.sh) :
# - "swift" (défaut de fait, cf. ./run-tests) → version-swift/support/helpers.rb
#   (1 seul process natif, binaire Swift compilé qui appelle AXUIElement
#   directement, sans System Events)
# - "pont"        → version-pont/support/helpers.rb (canal direct vers le JS
#   de la WKWebView via Sources/Board/TestBridge.swift, aucune accessibilité)
#
# Moteurs "base"/"batch"/"compiled"/"pers" retirés (2026-07-11) : benchmarkés,
# nettement plus lents que swift/pont (cf. memory/project_test_engines_status.md),
# gardés seulement le temps de la comparaison.

case ENV['BOARD_TEST_ENGINE']
when 'swift'
  require_relative '../version-swift/support/helpers'
when 'pont'
  require_relative '../version-pont/support/helpers'
else
  require_relative 'helpers_base'
end
