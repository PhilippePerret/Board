# Test : filtre fuzzy du SelectDialog (frontend/js/Dialogs.js) — utilise la
# SelectDialog du genre de projet ('__genre__', valeurs statiques : Roman,
# Film, Application, Jeu, Maison, Vacances) comme support.
#
# set_value ne déclenche pas d'événement 'input' (cf. helpers.rb), donc pas
# utilisable pour simuler une frappe dans le champ de filtre : bridge_eval
# direct pour poser la valeur ET dispatcher un vrai 'input'.

require_relative '../../support/helpers'

include BoardTest

def type_in_filter(dom_id, text)
  bridge_eval(<<~JS)
    (function(){
      var el = document.querySelector(#{dom_id.to_json} + ' .custom-select-filter');
      if (!el) throw new Error('filtre introuvable dans ' + #{dom_id.to_json});
      el.value = #{text.to_json};
      el.dispatchEvent(new Event('input', {bubbles: true}));
      return '';
    })()
  JS
end

def option_hidden?(dom_id, title)
  bridge_eval(<<~JS) == 'true'
    (function(){
      var opts = document.querySelectorAll(#{dom_id.to_json} + ' .custom-select-option');
      var opt = Array.from(opts).find(function(o){ return o.textContent === #{title.to_json}; });
      if (!opt) throw new Error('option introuvable : ' + #{title.to_json});
      return opt.classList.contains('hidden');
    })()
  JS
end

def click_option(dom_id, title)
  bridge_eval(<<~JS)
    (function(){
      var opts = document.querySelectorAll(#{dom_id.to_json} + ' .custom-select-option');
      var opt = Array.from(opts).find(function(o){ return o.textContent === #{title.to_json}; });
      if (!opt) throw new Error('option introuvable : ' + #{title.to_json});
      opt.click();
      return '';
    })()
  JS
end

def run_test
  project_id = create_fixture_project(title: 'Projet à genrer (filtre)')
  launch_app

  card_id = "project-#{project_id}"
  panel_id = "project-#{project_id}-panel-data"

  wait_for(card_id)
  click(card_id)

  wait_for('btn-deal-project-data')
  click('btn-deal-project-data')

  wait_for("#{panel_id}-genre-value")
  click("#{panel_id}-genre-value")

  wait_for('__genre__')

  # → sans filtre, toutes les valeurs sont visibles
  raise "'Vacances' déjà masqué avant filtrage" if option_hidden?('#__genre__', 'Vacances')
  raise "'Roman' déjà masqué avant filtrage" if option_hidden?('#__genre__', 'Roman')

  # → "vac" ne matche (fuzzy) que "Vacances" parmi les 6 valeurs
  type_in_filter('#__genre__', 'vac')

  raise "'Vacances' masqué après filtrage sur 'vac'" if option_hidden?('#__genre__', 'Vacances')
  raise "'Roman' toujours visible après filtrage sur 'vac'" unless option_hidden?('#__genre__', 'Roman')
  raise "'Film' toujours visible après filtrage sur 'vac'" unless option_hidden?('#__genre__', 'Film')

  # → vider le filtre réaffiche tout
  type_in_filter('#__genre__', '')
  raise "'Roman' encore masqué après filtre vidé" if option_hidden?('#__genre__', 'Roman')

  # → filtrer à nouveau puis choisir la valeur filtrée, jusqu'à enregistrement
  type_in_filter('#__genre__', 'vac')
  click_option('#__genre__', 'Vacances')

  wait_for_suffix('genre-btn-oui')
  click_suffix('genre-btn-oui')

  click("#{panel_id}-btn-oui")

  wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
    read_project_card(project_id)['genre'] == 'Vacances'
  end
ensure
  remove_fixture_project(project_id) if project_id
end

board_test("filtre fuzzy du SelectDialog (genre de projet)") { run_test }
