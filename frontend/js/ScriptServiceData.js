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

  'date-time':{
    params: {
        default:  {type: 'string'}
      , format:   {type: 'regexp'} // Une expression régulière valide ou une string de type "JJ MM HH:MM"
      , value:    {type: 'datetime', required: true}
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
      , key_value:    {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété valeur dans la liste (le value de <option>)'}
      , key_title:    {required_if: (da) => {da.values.type == 'array-of-object'}, desc: 'Propriété titre pour les options'}
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
        path:     {required: true , type: 'string', name: getMsg('path-to-data')}
      , data_id:  {required: false, type: 'string', name: getMsg('id-in-data')}
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
      description: getMsg('add-to-file-at')
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
        q:  {required: false, type: 'string'}
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
        project_key:  {required: true, type: 'string'}
      , value:        {required: true, type: 'string'}
    }

  },

  'alert': {
    params: {
        time:       {required: true, type: 'string'}
      , message:    {type: 'string'}
      , title:      {type: 'string'}
      , icon:       {type: 'icon'}
      , alertType:  {type: 'string', values: ['warning', 'notice', 'error']}
    }
  }
}
