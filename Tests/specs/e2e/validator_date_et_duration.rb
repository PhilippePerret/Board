require_relative '../../support/helpers'

include BoardTest

# Test unitaire de Validator.date() et Validator.duration() (Validator-fr.js),
# appelés directement via le pont JS. Chaque cas couvre soit une branche
# valide, soit un rejet attendu, tel que défini par les regex du fichier
# (dateReg, dateDansReg, dureeReg, et la liste de mots-clés naturels).
#
# Deux cas ('date' 32/13/2024 et 'date' texte contenant "demain") documentent
# volontairement le comportement ACTUEL du validateur, pas un idéal :
#   - dateReg ne vérifie que le nombre de chiffres, pas un vrai calendrier
#     (32/13/2024 est donc accepté aujourd'hui)
#   - la regex des mots-clés naturels n'est pas ancrée (^...$), un mot comme
#     "demain" est donc reconnu même noyé dans du texte
# Si ces deux comportements sont corrigés un jour, ces deux cas doivent
# basculer côté "invalide" plutôt qu'être supprimés.
CASES = [
  # --- Validator.date : formats JJ/MM/AAAA et dérivés ---
  { fn: :date, desc: "JJ/MM/AAAA", value: '25/12/2024', valid: true },
  { fn: :date, desc: "JJ-MM-AAAA", value: '25-12-2024', valid: true },
  { fn: :date, desc: "JJ:MM:AAAA", value: '25:12:2024', valid: true },
  { fn: :date, desc: "JJ/MM sans année", value: '25/12', valid: true },
  { fn: :date, desc: "jour/mois à 1 chiffre", value: '5/1', valid: true },
  { fn: :date, desc: "préfixe 'le '", value: 'le 25/12/2024', valid: true },
  { fn: :date, desc: "calendrier impossible (32/13) — accepté aujourd'hui, regex non calendaire", value: '32/13/2024', valid: true },

  # --- Validator.date : mots-clés naturels ---
  { fn: :date, desc: "hier", value: 'hier', valid: true },
  { fn: :date, desc: "avant-hier", value: 'avant-hier', valid: true },
  { fn: :date, desc: "après-demain", value: 'après-demain', valid: true },
  { fn: :date, desc: "demain", value: 'demain', valid: true },
  { fn: :date, desc: "dem (abrégé)", value: 'dem', valid: true },
  { fn: :date, desc: "aujourd'hui", value: "aujourd'hui", valid: true },
  { fn: :date, desc: "auj (abrégé)", value: 'auj', valid: true },
  { fn: :date, desc: "mot-clé noyé dans du texte — accepté aujourd'hui, regex non ancrée", value: 'ah demain peut-être', valid: true },

  # --- Validator.date : "dans X unité" ---
  { fn: :date, desc: "dans X jours", value: 'dans 3 jours', valid: true },
  { fn: :date, desc: "dans X mois", value: 'dans 1 mois', valid: true },
  { fn: :date, desc: "dans X semaines", value: 'dans 2 semaines', valid: true },
  { fn: :date, desc: "dans X heures", value: 'dans 5 heures', valid: true },
  { fn: :date, desc: "dans X minutes", value: 'dans 10 minutes', valid: true },
  { fn: :date, desc: "dans X mn", value: 'dans 1 mn', valid: true },

  # --- Validator.date : cas invalides ---
  { fn: :date, desc: "vide", value: '', valid: false },
  { fn: :date, desc: "format durée sans 'dans'", value: '3 jours', valid: false },
  { fn: :date, desc: "'dans' sans nombre", value: 'dans jours', valid: false },
  { fn: :date, desc: "'dans' sans unité", value: 'dans 3', valid: false },
  { fn: :date, desc: "texte quelconque", value: "n'importe quoi", valid: false },

  # --- Validator.date : date/heure combinée — seule dateReg (JJ/MM/AAAA)
  # supporte une partie heure en fin de regex ; les 2 autres non.
  { fn: :date, desc: "mot-clé + heure ('demain à 10 heures') — accepté par le trou de regex, pas par un vrai support de l'heure", value: 'demain à 10 heures', valid: true },
  { fn: :date, desc: "'dans X unité' + heure ('dans 4 mois à 6 hrs 30')", value: 'dans 4 mois à 6 hrs 30', valid: true },

  # --- Validator.duration : formats "N unité" ---
  { fn: :duration, desc: "jours", value: '3 jours', valid: true },
  { fn: :duration, desc: "jour singulier", value: '1 jour', valid: true },
  { fn: :duration, desc: "jr (abrégé)", value: '2 jr', valid: true },
  { fn: :duration, desc: "j (abrégé)", value: '1 j', valid: true },
  { fn: :duration, desc: "minutes", value: '45 minutes', valid: true },
  { fn: :duration, desc: "min (abrégé)", value: '10 min', valid: true },
  { fn: :duration, desc: "mn (abrégé)", value: '5 mn', valid: true },
  { fn: :duration, desc: "semaines", value: '2 semaines', valid: true },
  { fn: :duration, desc: "sem (abrégé)", value: '1 sem', valid: true },
  { fn: :duration, desc: "heures", value: '4 heures', valid: true },
  { fn: :duration, desc: "hr (abrégé)", value: '2 hr', valid: true },
  { fn: :duration, desc: "h (abrégé)", value: '3 h', valid: true },
  { fn: :duration, desc: "mois", value: '6 mois', valid: true },

  # --- Validator.duration : cas invalides ---
  { fn: :duration, desc: "vide", value: '', valid: false },
  { fn: :duration, desc: "nombre en toutes lettres", value: 'trois jours', valid: false },
  { fn: :duration, desc: "sans unité", value: '3', valid: false },
  { fn: :duration, desc: "unité inconnue", value: '3 machins', valid: false },
  { fn: :duration, desc: "format date relative, pas durée", value: 'dans 3 jours', valid: false },
].freeze

def validator_call(fn, value)
  bridge_eval(<<~JS)
    (function(){
      var err = Validator.#{fn}(#{value.to_json}, null);
      return JSON.stringify(err === undefined ? null : err);
    })()
  JS
end

def run_test
  launch_app

  CASES.each do |c|
    result = JSON.parse(validator_call(c[:fn], c[:value]))
    if c[:valid]
      raise "[#{c[:fn]} #{c[:desc].inspect}] attendu valide, erreur obtenue #{result.inspect}" unless result.nil?
    else
      raise "[#{c[:fn]} #{c[:desc].inspect}] attendu invalide, aucune erreur obtenue" if result.nil?
    end
  end
end

board_test("Validator.date / Validator.duration : formats valides et invalides") { run_test }
