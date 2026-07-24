const UNIV_KEYS = {id: true, type: true, name: true, if: true, title: true, q: true}


/**
 * DÉFINITION DES TYPES DE DONNÉES
 * 
 * @params Les paramètres
 *  :required     Si true, le paramètres est requis
 *  :required_if  Condition pour que le paramètres soit requis
 *  :type         Le type du paramètres
 *  :evaluate     Si true, les ${<id étape>} seront remplacés par le value de l'étape
 */
const SCRIPT_SERVICES_KNOWN_TYPES = {
  'set': {
    params: {
        var_step:   { required: false, type: 'string'}
      , var_value:  { required: true, evaluate: true, type: ['string', 'integer', 'boolean'] }
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
        values:       {required: true, evaluate: true, type: ['array-of-string', 'array-of-paire', 'array-of-object', 'path']}
      , key_values:   {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , title_values: {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété titre pour les options'}
      , create:       {type: 'boolean'}
      , default:      {type: 'string'}
    }
  },

  'save-data': {
    params: {
        path:   {required: true, evaluate: true, type: 'string'}
      , values: {required: true, evaluate: true, type: 'any'}
      , prefix: {required: false, type: 'string'}
    }
  },

  'get-data': {
    params: {
        base:   {required: true, evaluate: true, type: 'string', name: "Chemin d'accès aux données"}
      , key:    {required: false, type: 'string', name: 'clé dans les données (au besoin)'}
    }
  },
  
  'create-folder' : {
    params: {
      path: {required: true, type: 'string', evaluate: true}
    }
  },

  'create-file': {
    params: {
        content:  {required: true, evaluate: true, type: 'string'}
      , path:     {required: true, evaluate: true, type: 'string'}
    }
  },

  'copy-file': {
    params: {
        source: {required: true, type: 'string', evaluate: true}
      , dest:   {name: 'Destination (folder or file)', required: true, type: 'string', evaluate: true}
    }
  },

  'select-file': {
    params: {

    }
  },

  /* Pour récupérer une propriété du projet */
  'get-project-data': {
    params: {
    }
  },

  /* Pour définir une propriété du projet */
  'set-project-data': {
    params: {
        project_key: {required: true, type: 'string'}
      , value: {required: true, type: 'string', evaluate: true}
    }

  }
}
