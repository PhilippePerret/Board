# Point d'entrée requis par tous les fichiers de test
# (Tests/specs/**/*.rb, via `require_relative '../../support/helpers'`).
#
# Un seul moteur : "pont" (version-pont/support/helpers.rb, canal direct
# vers le JS de la WKWebView via Sources/Board/TestBridge.swift, aucune
# accessibilité). Les autres moteurs testés ("swift", "base"/"batch"/
# "compiled"/"pers") ont été retirés : benchmarkés plus lents, gardés
# seulement le temps de la comparaison.

require_relative '../version-pont/support/helpers'
