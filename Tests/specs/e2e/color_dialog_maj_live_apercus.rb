# Test : ColorDialog#onColorChange — au changement de couleur (événement
# 'input' sur le <input type="color">), les 3 aperçus (texte sur blanc,
# texte sur noir, rond plein) sont mis à jour EN DIRECT, pas seulement à la
# validation (frontend/js/Dialogs.js:238-282).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section B point 9). projet_extradata_background_color_picker_prefill.rb
# ne teste que le préremplissage initial, pas la mise à jour live.
#
# Comparaison des couleurs calculées (getComputedStyle) contre un élément
# de référence portant la même couleur en dur, plutôt que de supposer un
# format exact ("rgb(0, 255, 0)" vs "#00ff00") pour la valeur retournée par
# le navigateur.

require_relative '../../support/helpers'
include BoardTest

def run_test
  launch_app

  result = bridge_eval(<<~JS)
    (function(){
      var d = new ColorDialog({ id: 'test-color', defaultValue: '#ff0000', ouiBtn: {name: 'OK', onclick: function(){}} });
      d.show();
      var input = document.getElementById('__test-color__');

      var ref = document.createElement('div');
      ref.style.color = '#00ff00';
      document.body.appendChild(ref);
      var expectedColor = getComputedStyle(ref).color;
      var expectedBg;
      ref.style.background = '#00ff00';
      expectedBg = getComputedStyle(ref).backgroundColor;
      ref.remove();

      input.value = '#00ff00';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      return JSON.stringify({
          onWhiteColor: getComputedStyle(d.onWhite).color
        , onBlackColor: getComputedStyle(d.onBlack).color
        , discBg:       getComputedStyle(d.disc).backgroundColor
        , expectedColor: expectedColor
        , expectedBg:    expectedBg
      });
    })()
  JS
  data = JSON.parse(result)

  raise "aperçu texte-sur-blanc pas mis à jour (#{data['onWhiteColor'].inspect} attendu #{data['expectedColor'].inspect})" unless data['onWhiteColor'] == data['expectedColor']
  raise "aperçu texte-sur-noir pas mis à jour (#{data['onBlackColor'].inspect} attendu #{data['expectedColor'].inspect})" unless data['onBlackColor'] == data['expectedColor']
  raise "rond plein pas mis à jour (#{data['discBg'].inspect} attendu #{data['expectedBg'].inspect})" unless data['discBg'] == data['expectedBg']
end

board_test("ColorDialog : les 3 aperçus se mettent à jour en direct au changement de couleur") { run_test }
