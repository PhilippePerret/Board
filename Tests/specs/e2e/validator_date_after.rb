# Test de Validator.dateAfter() (frontend/js/Validator.js) : jusqu'ici un
# stub vide (jamais implémenté), maintenant une vraie comparaison via
# DateUtils.parseNatural. Couvre dates numériques, mots relatifs, "dans X
# unité", et le cas égalité (pas "après" au sens strict).

require_relative '../../support/helpers'
include BoardTest

CASES = [
  { desc: "numérique : échéance après début",  after: '25/12/2026',    ref: '20/12/2026', valid: true },
  { desc: "numérique : échéance avant début",  after: '15/12/2026',    ref: '20/12/2026', valid: false },
  { desc: "numérique : dates égales",          after: '20/12/2026',    ref: '20/12/2026', valid: false },
  { desc: "mots relatifs : ok",                after: 'après-demain',  ref: 'demain',      valid: true },
  { desc: "mots relatifs : inversé",           after: 'hier',          ref: 'demain',      valid: false },
  { desc: "'dans X unité' : ok",               after: 'dans 5 jours',  ref: 'dans 2 jours', valid: true },
  { desc: "'dans X unité' : inversé",          after: 'dans 1 jour',   ref: 'dans 5 jours', valid: false },
].freeze

def run_test
  launch_app

  CASES.each do |c|
    result = bridge_eval(<<~JS)
      (function(){
        var errors = [];
        Validator.dateAfter(#{c[:after].to_json}, #{c[:ref].to_json}, errors);
        return JSON.stringify(errors.length == 0);
      })()
    JS
    ok = (result == 'true')
    raise "[#{c[:desc]}] dateAfter(#{c[:after].inspect}, #{c[:ref].inspect}) : attendu valid=#{c[:valid]}, obtenu #{ok}" unless ok == c[:valid]
  end
end

board_test("Validator.dateAfter : échéance après/avant/égale à la date de début") { run_test }
