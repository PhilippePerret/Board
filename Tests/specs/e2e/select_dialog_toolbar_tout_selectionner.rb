require_relative '../../support/helpers'

include BoardTest

# Test unitaire de la barre d'outils "tout sélectionner / tout désélectionner"
# de SelectDialog (Dialogs.js) : appel direct via le pont JS, sans passer par
# un flux métier réel (ex. init GitHub, dont le multi-select est un cas
# d'usage, mais qui exigerait un vrai dépôt configuré).
#
# La barre d'outils et son filtre n'ont pas d'id (seulement des classes) :
# les helpers *_prefix/*_suffix (id-based) ne s'appliquent pas ici, tout
# passe par des requêtes CSS directes en bridge_eval.

def open_select_dialog(id, multi:, values: %w[Pomme Poire Cerise Fraise])
  bridge_eval(<<~JS)
    (function(){
      window.__testDlg = new SelectDialog({id: #{id.to_json}, values: #{values.to_json}, multi: #{multi}, title: 'Test', q: 'Choisis'})
      window.__testDlg.show()
      return ''
    })()
  JS
end

def close_select_dialog
  bridge_eval("window.__testDlg && window.__testDlg.close(); delete window.__testDlg; ''")
end

def dialog_value(id)
  JSON.parse(bridge_eval("JSON.stringify(document.getElementById(#{"__#{id}__".to_json}).value)"))
end

def toolbar_buttons_count
  bridge_eval("document.querySelectorAll('.custom-select-toolbar-btn').length").to_i
end

def click_toolbar_button(index)
  bridge_eval(<<~JS)
    (function(){
      var fireClick=#{BoardTest::FIRE_CLICK_JS};
      var btns=document.querySelectorAll('.custom-select-toolbar-btn');
      fireClick(btns[#{index}]);
      return '';
    })()
  JS
end

def selected_options_count
  bridge_eval("document.querySelectorAll('.custom-select-option.selected').length").to_i
end

def toolbar_button_src(index)
  bridge_eval("document.querySelectorAll('.custom-select-toolbar-btn')[#{index}].getAttribute('src')")
end

def toolbar_button_title(index)
  bridge_eval("document.querySelectorAll('.custom-select-toolbar-btn')[#{index}].getAttribute('title')")
end

def run_test
  launch_app

  # → mode multi : la barre d'outils (2 boutons) doit être présente
  open_select_dialog('test-multi', multi: true)
  wait_for('__test-multi__')
  raise "2 boutons de toolbar attendus, obtenu #{toolbar_buttons_count}" unless toolbar_buttons_count == 2

  # → câblage icône -> action : le bouton 0 doit être list-check (sélectionner),
  #   le bouton 1 list-uncheck (désélectionner) — pas juste une inférence sur
  #   le comportement, on vérifie directement src et title (localisé)
  raise "bouton 0 attendu = list-check.svg, obtenu #{toolbar_button_src(0).inspect}" unless toolbar_button_src(0).include?('list-check.svg')
  raise "bouton 1 attendu = list-uncheck.svg, obtenu #{toolbar_button_src(1).inspect}" unless toolbar_button_src(1).include?('list-uncheck.svg')
  raise "title bouton 0 attendu 'Tout sélectionner', obtenu #{toolbar_button_title(0).inspect}" unless toolbar_button_title(0) == 'Tout sélectionner'
  raise "title bouton 1 attendu 'Tout désélectionner', obtenu #{toolbar_button_title(1).inspect}" unless toolbar_button_title(1) == 'Tout désélectionner'

  # → clic "tout sélectionner" (1er bouton, list-check avant list-uncheck)
  click_toolbar_button(0)
  raise "4 options sélectionnées attendues après 'tout sélectionner', obtenu #{selected_options_count}" unless selected_options_count == 4
  raise "value attendue = 4 éléments, obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').length == 4

  # → clic "tout désélectionner" (2e bouton) : plus aucune sélection
  click_toolbar_button(1)
  raise "0 option sélectionnée attendue après 'tout désélectionner', obtenu #{selected_options_count}" unless selected_options_count == 0
  raise "value attendue = [], obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').empty?

  # → filtre appliqué : "tout sélectionner" ne doit toucher que les options visibles
  bridge_eval(<<~JS)
    (function(){
      var el = document.querySelector('.custom-select-filter');
      el.value = 'poi';
      el.dispatchEvent(new Event('input', {bubbles:true}));
      return '';
    })()
  JS
  wait_until(2, desc: -> { 'filtre pas appliqué' }) { bridge_eval("document.querySelectorAll('.custom-select-option:not(.hidden)').length").to_i == 1 }
  click_toolbar_button(0)
  raise "seule l'option filtrée doit être sélectionnée, obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi') == ['Poire']

  # → filtre sans aucun résultat visible : "tout sélectionner" ne doit rien
  #   faire (pas planter, pas sélectionner d'option cachée)
  bridge_eval(<<~JS)
    (function(){
      var el = document.querySelector('.custom-select-filter');
      el.value = 'xyzxyz-aucune-correspondance';
      el.dispatchEvent(new Event('input', {bubbles:true}));
      return '';
    })()
  JS
  wait_until(2, desc: -> { 'filtre pas appliqué' }) { bridge_eval("document.querySelectorAll('.custom-select-option:not(.hidden)').length").to_i == 0 }
  # → changer le filtre a déjà désélectionné 'Poire' en la cachant
  #   (applyFilter, comportement existant) : la sélection est donc déjà
  #   vide avant même le clic
  raise "sélection attendue vide avant le clic (désélection au filtrage), obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').empty?
  click_toolbar_button(0)
  raise "aucune option ne doit être sélectionnable avec 0 résultat visible, obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').empty?

  close_select_dialog

  # → mode simple (non multi) : pas de barre d'outils
  open_select_dialog('test-single', multi: false)
  wait_for('__test-single__')
  raise "barre d'outils présente à tort en mode simple, obtenu #{toolbar_buttons_count} bouton(s)" unless toolbar_buttons_count == 0
  close_select_dialog
end

board_test("SelectDialog : barre d'outils tout sélectionner / tout désélectionner (mode multi uniquement, respecte le filtre)") { run_test }
