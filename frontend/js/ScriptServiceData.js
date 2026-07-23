const UNIV_KEYS = {id: true, type: true, name: true, if: true, title: true, q: true}

const SCRIPT_SERVICES_KNOWN_TYPES = {
  'set': {
    params: {
        var_step:   { required: true, type: 'string'}
      , var_value:  { required: true, type: ['string', 'integer', 'boolean'] }
    }
  },

  'string': {
    params: {
      default: {type: 'string'}
    }
  },

  'phone': {
    params: {
      default: {type: 'string'}
    }
  },

  'text': {
    params: {
      default: {type: 'string'}
    }
  },

  'select': {
    params: { // les paramètres possible
        values:       {required: true, type: ['array-of-string', 'array-of-paire', 'array-of-object', 'path']}
      , key_values:   {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , title_values: {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété titre pour les options'}
      , create:       {type: 'boolean'}
      , default:      {type: 'string'}
    }
  },

  'save-data': {
    params: {
        path:   {required: true, type: 'string'}
      , values: {required: true, type: 'any'}
      , prefix: {required: false, type: 'string'}
    }
  },
  
  'create-folder' : {
    params: {
      path: {required: true, type: 'string'}
    }
  }
}
