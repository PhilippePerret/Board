# Test : Speaking._resolveMessagesIn (Messagerie.js) — couvre TOUTES les
# formes documentées dans son commentaire (Messagerie.js:104-110), plus le
# cas ">2 valeurs root" (Messagerie.js:131). Un id peut être connu OU brut
# (message Ruby non localisé) partout où un id est attendu — y compris
# À L'INTÉRIEUR d'une liste d'ids (pas seulement en id simple) : les cas
# ci-dessous mélangent id connu + texte brut dans les formes liste.
#
# Bug connu au moment de l'écriture (Messagerie.js:154-157) : le reduce
# fait `return accu.push(...)` — Array#push renvoie la nouvelle LONGUEUR,
# pas le tableau, donc accu devient un nombre dès la 1re itération. Toute
# forme TABLEAU (liste d'ids ou pas, id connu ou brut) plante — soit sur
# .join si un seul id, soit sur le accu.push suivant si plusieurs. Seuls
# null/undefined et un msgId simple (string nue, sans tableau) fonctionnent
# aujourd'hui.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var Ensemble = {id1: 'Msg 1 %{0}', id2: 'Msg 2', id3: 'Msg 3'}
      var cases = [
          ['null',                              null]
        , ['undefined',                         undefined]
        , ['msgId seul (connu)',                'id1']
        , ['msgId seul (brut)',                 'une erreur ruby brute']
        , ['[msgId, val] (connu)',              ['id1', 'V']]
        , ['[msgId, val] (brut)',               ['une erreur ruby brute %{0}', 'V']]
        , ['[msgId, [vals]]',                   ['id1', ['V']]]
        , ['[[ids]] (tous connus)',             [['id1', 'id2']]]
        , ['[[ids]] (connu + brut)',            [['id1', 'une erreur brute']]]
        , ['[[ids], val] (connu + brut)',       [['id1', 'une erreur brute'], 'V']]
        , ['[[ids], [vals]] (tous connus)',     [['id1', 'id2'], ['V1', 'V2']]]
        , ['[[ids], [vals]] (connu + brut)',    [['id1', 'une erreur brute'], ['V1', 'V2']]]
        , ['>2 flat (tous connus)',             ['id1', 'id2', 'id3']]
        , ['>2 flat (connu + brut)',            ['id1', 'une erreur brute', 'id3']]
      ]
      var results = cases.map(function(c){
        var label = c[0], input = c[1]
        try {
          var res = Speaking._resolveMessagesIn(input, Ensemble)
          return {label: label, ok: true, value: res}
        } catch(e) {
          return {label: label, ok: false, error: e.message}
        }
      })
      return JSON.stringify(results)
    })()
  JS
  results = JSON.parse(result)

  # Toutes les formes doivent réussir (comportement attendu, documenté
  # dans le commentaire de la fonction). Aujourd'hui, seules les formes
  # NON tableau passent (bug reduce/push ci-dessus) — id connu ou brut ne
  # change rien, seule la nature (string nue vs tableau) détermine si le
  # bug est atteint. Ce test échoue donc sur toutes les formes tableau
  # tant que le bug n'est pas corrigé.
  results.each do |r|
    raise "#{r['label']} : devrait réussir, a échoué avec #{r['error'].inspect}" unless r['ok']
  end
end

board_test("Speaking._resolveMessagesIn : toutes les formes documentées (null, id connu/brut, +/- valeur(s), liste d'ids mixte, >2 flat)") { run_test }
