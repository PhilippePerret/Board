const SCRIPT_SERVICES_KNOWN_TYPES = {
  'select': {
    params: {
        values: {required: true, type: ['array-of-object', 'path']}
      , key_values: {required: true, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , title_values: {required: true, desc: 'Propriété titre pour les options'}
    }
  },
  
  'select-or-string': {
    params: {
        values: {required: true, type: 'array'}
      , default: {type: 'string'}
    }
  },

  'create-folder' : {
    params: {
      path: {required: true, type: 'string'}
    }
  }
}
