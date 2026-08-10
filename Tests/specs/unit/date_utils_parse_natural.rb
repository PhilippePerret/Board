# Tests DateUtils.parseNatural (frontend/js/DateUtils.js) : convertit en
# vraie Date les formats acceptés par Validator.date() — ISO 8601, JJ/MM/AAAA,
# mot relatif ("demain", "après-demain"...), "dans X unité" — ou renvoie null
# si le format n'est pas reconnu.
#
# Couvre en particulier un bug trouvé en testant : "après-demain" contient
# "demain" comme sous-chaîne, donc mal résolu en +1 jour au lieu de +2 avant
# correction de l'ordre de test des mots relatifs.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  # --- Formats à résultat fixe (pas de dépendance à "maintenant") ---
  fixed_result = bridge_eval(<<~JS)
    (function(){
      var iso = DateUtils.parseNatural('2026-07-29T09:00:00Z');
      var num = DateUtils.parseNatural('25/12/2026');
      var bad = DateUtils.parseNatural('n\\'importe quoi');
      return JSON.stringify({
        iso: iso ? iso.toISOString() : null,
        num_y: num ? num.getFullYear() : null,
        num_m: num ? num.getMonth() : null,
        num_d: num ? num.getDate() : null,
        bad: bad,
      });
    })()
  JS
  data = JSON.parse(fixed_result)
  raise "parseNatural(ISO) : attendu 2026-07-29T09:00:00.000Z, obtenu #{data['iso'].inspect}" unless data['iso'] == '2026-07-29T09:00:00.000Z'
  raise "parseNatural('25/12/2026') : année attendue 2026, obtenue #{data['num_y'].inspect}" unless data['num_y'] == 2026
  raise "parseNatural('25/12/2026') : mois attendu 11 (0-indexé), obtenu #{data['num_m'].inspect}" unless data['num_m'] == 11
  raise "parseNatural('25/12/2026') : jour attendu 25, obtenu #{data['num_d'].inspect}" unless data['num_d'] == 25
  raise "parseNatural(texte invalide) : attendu null, obtenu #{data['bad'].inspect}" unless data['bad'].nil?

  # --- Mots relatifs et "dans X unité" : comparés à un oracle calculé dans
  # le même appel JS (DateUtils.dateIn, déjà testé isolément par
  # date_utils_add_units.rb) pour éviter tout écart d'horloge entre Ruby et JS.
  relative_result = bridge_eval(<<~JS)
    (function(){
      function sameDay(a, b){
        return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
      }
      var cases = {
        demain:            [DateUtils.parseNatural('demain'),            DateUtils.dateIn(1, 'day')],
        'après-demain':    [DateUtils.parseNatural('après-demain'),      DateUtils.dateIn(2, 'day')],
        hier:              [DateUtils.parseNatural('hier'),              DateUtils.dateIn(-1, 'day')],
        'avant-hier':      [DateUtils.parseNatural('avant-hier'),        DateUtils.dateIn(-2, 'day')],
        "aujourd'hui":     [DateUtils.parseNatural("aujourd'hui"),       DateUtils.dateIn(0, 'day')],
        'dans 3 jours':    [DateUtils.parseNatural('dans 3 jours'),      DateUtils.dateIn(3, 'day')],
        'dans 2 semaines': [DateUtils.parseNatural('dans 2 semaines'),   DateUtils.dateIn(14, 'day')],
        'dans 1 mois':     [DateUtils.parseNatural('dans 1 mois'),       DateUtils.dateIn(1, 'month')],
      };
      var out = {};
      for (var key in cases) { out[key] = sameDay(cases[key][0], cases[key][1]); }
      return JSON.stringify(out);
    })()
  JS
  JSON.parse(relative_result).each do |label, ok|
    raise "parseNatural(#{label.inspect}) : jour obtenu différent du jour attendu" unless ok
  end
end

board_test("DateUtils.parseNatural : ISO 8601, JJ/MM/AAAA, mots relatifs, 'dans X unité'") { run_test }
