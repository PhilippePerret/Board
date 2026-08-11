require_relative '../../support/helpers'

include BoardTest

# Test unitaire de la barre d'outils "tout sélectionner / tout désélectionner"
# de SelectDialog (Dialogs.js) : appel direct via le pont JS, sans passer par
# un flux métier réel (ex. init GitHub, dont le multi-select est un cas
# d'usage, mais qui exigerait un vrai dépôt configuré).

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
  bridge_eval(<<~JS)
    (function(){
      if (window.__testDlg) window.__testDlg.close ? window.__testDlg.close() : window.__testDlg.destroy && window.__testDlg.destroy()
      var el = document.getElementById(#{'panel-test-multi'.to_json})
      if (el) el.remove()
      var el2 = document.getElementById(#{'panel-test-single'.to_json})
      if (el2) el2.remove()
      delete window.__testDlg
      return ''
    })()
  JS
end

def dialog_value(id)
  JSON.parse(bridge_eval("JSON.stringify(document.getElementById(#{"__#{id}__".to_json}).value)"))
end

def run_test
  launch_app

  # → mode multi : la barre d'outils (2 boutons) doit être présente
  open_select_dialog('test-multi', multi: true)
  wait_for('__test-multi__')
  raise "bouton 'tout sélectionner' absent en mode multi" unless exists_prefix?('custom-select-toolbar')
  toolbar_btns_count = bridge_eval("document.querySelectorAll('.custom-select-toolbar-btn').length").to_i
  raise "2 boutons de toolbar attendus, obtenu #{toolbar_btns_count}" unless toolbar_btns_count == 2

  # → clic "tout sélectionner" : les 4 valeurs sont sélectionnées
  click_prefix('custom-select-toolbar')
  # le 1er bouton du DOM est "tout sélectionner" (list-check avant list-uncheck)
  selected_count = bridge_eval("document.querySelectorAll('.custom-select-option.selected').length").to_i
  raise "4 options sélectionnées attendues après 'tout sélectionner', obtenu #{selected_count}" unless selected_count == 4
  raise "value attendue = 4 éléments, obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').length == 4

  # → clic "tout désélectionner" (2e bouton) : plus aucune sélection
  bridge_eval(<<~JS)
    (function(){
      var fireClick=#{BoardTest::FIRE_CLICK_JS};
      var btns=document.querySelectorAll('.custom-select-toolbar-btn');
      fireClick(btns[1]);
      return '';
    })()
  JS
  selected_count = bridge_eval("document.querySelectorAll('.custom-select-option.selected').length").to_i
  raise "0 option sélectionnée attendue après 'tout désélectionner', obtenu #{selected_count}" unless selected_count == 0
  raise "value attendue = [], obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi').empty?

  # → filtre appliqué : "tout sélectionner" ne doit toucher que les options visibles
  set_value_prefix('custom-select-filter', 'poi')
  bridge_eval("document.querySelector('.custom-select-filter').dispatchEvent(new Event('input', {bubbles:true}))")
  wait_until(2, desc: -> { 'filtre pas appliqué' }) { bridge_eval("document.querySelectorAll('.custom-select-option:not(.hidden)').length").to_i == 1 }
  bridge_eval(<<~JS)
    (function(){
      var fireClick=#{BoardTest::FIRE_CLICK_JS};
      var btns=document.querySelectorAll('.custom-select-toolbar-btn');
      fireClick(btns[0]);
      return '';
    })()
  JS
  raise "seule l'option filtrée doit être sélectionnée, obtenu #{dialog_value('test-multi').inspect}" unless dialog_value('test-multi') == ['Poire']

  close_select_dialog

  # → mode simple (non multi) : pas de barre d'outils
  open_select_dialog('test-single', multi: false)
  wait_for('__test-single__')
  raise "barre d'outils présente à tort en mode simple" if exists_prefix?('custom-select-toolbar')
  close_select_dialog
end

board_test("SelectDialog : barre d'outils tout sélectionner / tout désélectionner (mode multi uniquement, respecte le filtre)") { run_test }
