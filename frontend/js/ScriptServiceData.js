const UNIV_KEYS = {
    id: true
  , type: true
  , name: true
  , if: true
  , title: true
  , q: true
  , message: true
  , set: true
}


/**
 * DÉFINITION DES TYPES DE DONNÉES
 * 
 * @params Les paramètres
 *  :required     Si true, le paramètres est requis
 *  :required_if  Condition pour que le paramètres soit requis
 *  :type         Le type du paramètres
 */
const SCRIPT_SERVICES_KNOWN_TYPES = {
  'set': {
    params: {
        step:   { required: false, type: 'string'}
      , value:  { required: true, type: ['string', 'integer', 'boolean'] }
    }
  },

  'translate': {
      valid_if: (data) => { return data.step || data.value }
    , params: {
        step:   {required: false}
      , value:  {required: false}
      , format: {required: false}
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
      , key_value:   {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , key_title: {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété titre pour les options'}
      , create:       {type: 'boolean'}
      , default:      {type: 'string'}
    }
  },

  'save-data': {
    params: {
        path:   {required: true, type: 'string'}
      , keys:   {required: true, type: 'any'}
      , prefix: {required: false, type: 'string'}
    }
  },

  'get-data': {
    params: {
        base:   {required: true, type: 'string', name: "Chemin d'accès aux données"}
      , key:    {required: false, type: 'string', name: 'clé dans les données (au besoin)'}
    }
  },
  
  'create-folder' : {
    params: {
      path: {required: true, type: 'string'}
    }
  },

  'create-file': {
    params: {
        content:  {required: true, type: 'string'}
      , path:     {required: true, type: 'string'}
    }
  },

  'copy-file': {
    params: {
        source: {required: true, type: 'string'}
      , dest:   {name: 'Destination (folder or file)', required: true, type: 'string'}
    }
  },

  'add-to-file': {
      description: "Ajout à un fichier, à un endroit quelconque"
    , params: {
          path:     {required: true, type: 'string'}
        , content:  {required: true, type: 'string'}
        , after:    {required: false, type: 'string'}
        , before:   {required: false, type: 'string'}
        , where:    {required: false, type: 'string'}
    }
  },

  'select-file': {
    params: {
        q: {required: false, type: 'string'}
      , in: {required: false, type: 'string'}
    }
  },

  'choose-folder': {
    params: {
        q: {required: false, type: 'string'}
      , in: {required: false, type: 'string'}
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
      , value: {required: true, type: 'string'}
    }

  }
}
