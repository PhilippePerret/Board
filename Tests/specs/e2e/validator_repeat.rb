# Test de Validator.repeat() (frontend/js/Validator.js) : aucun test
# n'existait pour cette fonction. Couvre "N du mois", jour de la semaine,
# avec ou sans heure, et corrige au passage une variable non déclarée
# (valInit) qui aurait fait planter le cas d'erreur.
#
# Note : "tous les jours" (sans chiffre devant "jours") est rejeté — pas une
# régression, comportement déjà présent avant la localisation (le check ne
# reconnaît que "N jours", jamais "jours" seul).

require_relative '../../support/helpers'
include BoardTest

CASES = [
  { desc: "tous les 10 du mois",         value: 'tous les 10 du mois',      valid: true },
  { desc: "le mardi",                    value: 'le mardi',                 valid: true },
  { desc: "le mardi à 11 heures",        value: 'le mardi à 11 heures',     valid: true },
  { desc: "heure invalide",              value: 'le mardi à zz',            valid: false },
  { desc: "tous les jours (sans chiffre, rejeté)", value: 'tous les jours', valid: false },
  { desc: "texte incompréhensible",      value: "n'importe quoi",           valid: false },
].freeze

def run_test
  launch_app

  CASES.each do |c|
    result = bridge_eval(<<~JS)
      (function(){
        var errors = [];
        Validator.repeat(#{c[:value].to_json}, errors);
        return JSON.stringify(errors.length == 0);
      })()
    JS
    ok = (result == 'true')
    raise "[#{c[:desc]}] repeat(#{c[:value].inspect}) : attendu valid=#{c[:valid]}, obtenu #{ok}" unless ok == c[:valid]
  end
end

board_test("Validator.repeat : jours, jour du mois, jour de semaine, avec/sans heure") { run_test }
