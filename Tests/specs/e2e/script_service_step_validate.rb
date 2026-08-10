require_relative '../../support/helpers'

include BoardTest

# Test unitaire de ServStep#validate() (ScriptService.js) : appel direct de
# la méthode via le pont JS, sans passer par un projet fixture ni un clic
# dans l'UI. Ajouter un cas ici à chaque nouvelle règle de validation.
# `expect` liste les clés d'erreur attendues, dans l'ordre — [] pour une
# étape valide (aucune erreur ne doit remonter).
CASES = [
  {
    desc: "étape valide (create-folder)",
    data: { id: 'valide', type: 'create-folder', path: './sortie-test' },
    expect: []
  },
  {
    desc: "sans 'type'",
    data: { id: 'sanstype', path: './sortie-test' },
    expect: ['scserv-type-required']
  },
  {
    desc: "sans 'id'",
    data: { type: 'create-folder', path: './sortie-test' },
    expect: ['scserv-id-required']
  },
  {
    desc: "'id' avec caractère invalide (espace)",
    data: { id: 'id invalide', type: 'create-folder', path: './sortie-test' },
    expect: ['scserv-id-invalid']
  },
  {
    desc: "'type' inconnu",
    data: { id: 'typeinconnu', type: 'nawak' },
    expect: ['scserv-step-type-unknowned'],
    id_in_message: true
  },
  {
    desc: "paramètre inconnu",
    data: { id: 'paraminconnu', type: 'create-folder', path: './sortie-test', bidule: 'valeur' },
    expect: ['scserv-unknown-param'],
    id_in_message: true
  },
  {
    desc: "étape valide (select, 'values' en tableau d'objets)",
    data: { id: 'selectvalide', type: 'select', values: [{ value: 'a', title: 'A' }], key_value: 'value', key_title: 'title' },
    expect: []
  },
  {
    desc: "'select' sans 'values'",
    data: { id: 'selectsansvalues', type: 'select', key_value: 'k', key_title: 't' },
    expect: ['scserv-param-required'],
    id_in_message: true
  },
  {
    desc: "'select', 'values' type multiple (nombre) — pas de contrôle de type sur 'values' pour l'instant",
    data: { id: 'selectbadtype', type: 'select', values: 42, key_value: 'value', key_title: 'title' },
    expect: []
  },
  {
    desc: "étape valide (select, 'values' en path vers un fichier)",
    data: { id: 'selectpath', type: 'select', values: './values.yaml', key_value: 'value', key_title: 'title' },
    expect: []
  },
].freeze

def validate_errors(step_data)
  bridge_eval(<<~JS)
    (function(){
      var step = new ServStep({projet: null}, #{step_data.to_json});
      var errs = step.validate();
      return JSON.stringify(errs.map(function(e){
        return {key: (e && e.key) ? e.key : null, text: String(e)}
      }));
    })()
  JS
end

def run_test
  launch_app

  CASES.each do |c|
    errors = JSON.parse(validate_errors(c[:data]))

    if c[:expect].empty?
      raise "[#{c[:desc]}] attendu aucune erreur, obtenu #{errors.inspect}" unless errors.empty?
      next
    end

    raise "[#{c[:desc]}] nombre d'erreurs inattendu, attendu #{c[:expect].length}, obtenu #{errors.inspect}" unless errors.length == c[:expect].length

    c[:expect].each_with_index do |expected_key, i|
      key = errors[i]['key']
      unless key && key.include?(expected_key)
        raise "[#{c[:desc]}] erreur ##{i} attendue '#{expected_key}', obtenu #{errors[i].inspect}"
      end
      if c[:id_in_message]
        text = errors[i]['text']
        raise "[#{c[:desc]}] message #{text.inspect} ne mentionne pas l'id de l'étape (#{c[:data][:id].inspect})" unless text.include?(c[:data][:id])
      end
    end
  end
end

board_test("ServStep#validate() : étape valide sans erreur, invalidités avec le bon message") { run_test }
