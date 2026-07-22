const SCRIPT_SERVICES_KNOWN_TYPES = {
  'select': {
    params: {
        values: {required: true, type: 'array-or-path'}
      , key_values: {required: true, desc: 'Propriété valeur dans la liste (le value de <option>'}
      , title_values: {required: true, desc: 'Propriété titre pour les options'}
    }
  },
  
  'select-or-string': {
    params: {
      values: {required: true, type: 'array'}

    }
  },

  'create-folder' : {
    params: {
      path: {required: true, type: 'string'}
    }
  }
}
