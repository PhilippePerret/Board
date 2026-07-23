const UNIV_KEYS = {id: true, type: true, name: true}

const SCRIPT_SERVICES_KNOWN_TYPES = {
  'select': {
    params: { // les paramètres possible
        values:       {required: true, type: ['array-of-string', 'array-of-paire', 'array-of-object', 'path']}
      , key_values:   {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , title_values: {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété titre pour les options'}
      , create:       {type: 'boolean'}
      , default:      {type: 'string'}
    }
  },
  
  'create-folder' : {
    params: {
      path: {required: true, type: 'string'}
    }
  }
}
