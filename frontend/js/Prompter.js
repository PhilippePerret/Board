/**
 * Prompter
 *
 * Classe UNIQUE qui centralise, par TYPE, toute méthode qui inter-
 * agit avec l'utilisateur pour :
 *    - lui demander une valeur
 *    - exécuter une opération (comme créer un dossier)
 * 
 * Utilisé à part égale, pour le moment, mais en développement, par le
 * paramDefiner des Services que par le Script-Services (ServStep)
 *
 *
 * @usage
 *    Prompter.prompt({type: 'string', id, name, message, default}, callback)
 *
 * callback(value, error)
 *    error   truthy    → l'opération a échoué (callback(null, error))
 *    value   null      → l'utilisateur a annulé/renoncé
 *    value   sinon     → la valeur obtenue (si valeur demandée, sinon le
 *                        résultat de l'opération)
 */
class Prompter {

  /**
   * @api
   * 
   * Point d'entrée unique pour les clients.
   */
  static prompt(spec, callback){
    const method = `prompt${kebabToPascalCase(spec.type)}`
    'function' == typeof this[method] || raise(`[Systemic] Prompter.${method} doit être défini.`)
    this[method](spec, callback)
  }

  /*****************************************************************/
  /*                 TYPES SIMPLES (VALEUR EN MÉMOIRE)             */
  /*****************************************************************/

  static promptRaw(spec, callback){
    callback(spec.value ?? spec.default)
  }

  static promptApp(spec, callback){
    const value = App.getData([spec.id])
    if (!value) {
      console.error(getErr('unknown-app-data', spec.id))
    } else {
      callback(value)
    }
  }

  // Propriété du projet courant, avec définition à la volée si absente
  static promptProject(spec, callback){
    const value = Project.current[spec.id]
    if (!value) {
      const definers = new ParamsDefiner(
        [Object.assign(spec.ifUndefined, {id: spec.id})],
        (definers) => {
          const valueDefiner = definers[0]
          const prop = valueDefiner.id
          TBL_PROJECT_DATA[prop] || raise(`[System] La propriété ${prop} doit être ajoutée Project.PROPERITES, la liste des propriétés des projets, pour pouvoir être enregistrée.`)
          Project.current[prop] = valueDefiner.value
          Project.current.save()
          callback(valueDefiner.value)
        }
      )
      definers.define()
    } else {
      callback(value)
    }
  }

  /*****************************************************************/
  /*                    TYPES À DIALOGUE SIMPLE                    */
  /*****************************************************************/

  // Base commune title/id/message/width partagée par tous les prompt* qui
  // affichent un Dialog — un seul endroit à corriger pour que width/title
  // marchent pareil pour params ET dynParams (même spec, même dispatcher).
  static dialogBase(spec, fallbackTitle){
    return {
        title:   spec.title || spec.name || fallbackTitle
      , id:      spec.id
      , message: spec.message || spec.q
      , width:   spec.width
    }
  }

  static promptString(spec, callback){
    new TextFieldDialog(Object.assign(this.dialogBase(spec), {
        default:  spec.default ?? ''
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  static promptText(spec, callback){
    new TextareaDialog(Object.assign(this.dialogBase(spec), {
        default:  spec.default ?? ''
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  static promptBoolean(spec, callback){
    new ConfirmDialog(Object.assign(this.dialogBase(spec), {
        defaultKey: spec.actual === false ? getMsg('btn-no') : getMsg('btn-yes')
      , ouiBtn: {name: getMsg('btn-yes'), onclick: () => callback(true)}
      , nonBtn: {name: getMsg('btn-no'), onclick: () => callback(false)}
    })).show()
  }

  static promptInteger(spec, callback){
    new TextFieldDialog(Object.assign(this.dialogBase(spec), {
        defaultValue: spec.default
      , toRealValue: (n) => parseInt(n)
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  static promptUrl(spec, callback){
    new TextFieldDialog(Object.assign(this.dialogBase(spec, 'Définition d’URL'), {
        message:      spec.message || spec.q || getMsg('which-url')
      , defaultValue: spec.default || 'https://'
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  static promptServiceName(spec, callback){
    new TextFieldDialog(Object.assign(this.dialogBase(spec, getMsg('new-service-name')), {
        message:  spec.message || getMsg('which-name-for-project-service')
      , defaultValue: spec.default
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  static promptPhone(spec, callback){
    new TextFieldDialog(Object.assign(this.dialogBase(spec, getMsg('phone-number')), {
        message:  spec.message || spec.q || getMsg('which-phone-number')
      , default:  spec.default || ''
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: getMsg('OK'), onclick: (retour) => this._validatePhone(retour, spec, callback)}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }
  static _validatePhone(retour, spec, callback){
    retour = retour.replace(/\./, ' ')
    if (retour.match(/[0-9]{8}/)) retour = retour.match(/\d\d/g).join(" ")
    if (retour.match(/[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/)) {
      callback(retour)
    } else {
      this.promptPhone(Object.assign({}, spec, {errorMessage: getErr('invalid-phone-number', retour)}), callback)
    }
  }

  static promptDateTime(spec, callback){
    const format = spec.format || REG_DATETIME_JJ_MM_HH_MM
    new TextFieldDialog(Object.assign(this.dialogBase(spec, getMsg('date-and-hour')), {
        message:  spec.message || spec.q || getMsg('scserv-datetime-default-format')
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: getMsg('OK'), onclick: (retour) => {
          const datetime = Validator.datetime(retour, format, true)
          if (datetime) callback(datetime)
          else this.promptDateTime(spec, callback)
        }}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  /******************************************************************/
  /*                          SELECT                                */
  /******************************************************************/
  /**
   * @param spec.values   
   *    SOIT [Array]  un array de valeurs string (value = title)
   *    SOIT [Array]  un array de [value, title]
   *    SOIT [String] un fichier à charger contenant les valeurs
   *    SOIT [Func]   une fonction permettant de définir les valeurs
   * @param spec.create
   *    Pour permettre de créer une nouvelle valeur
   *    SOIT [Bool]   true pour dire que oui
   *    SOIT [String] Le nom que doit prendre le bouton pour créer 
   *                  la nouvelle valeur
   */
  static promptSelect(spec, callback){
    console.log("-> promptSelect/spec =", spec)
    switch(typeof spec.values) {
      case 'string':
        return this._loadSelectValuesFromFile(spec.values, (values) => {
          this.promptSelect(Object.assign({}, spec, {values}), callback)
        }, callback)
      case 'function':
        // REFLEXION 
        // Le problème ici, c'est que la fonction peut avoir besoin de bien d'autres choses
        // que ce que lui donne la spec. Le plus simple serait qu'on accumule dans +spec+
        // le résultat des paramètres précédents, mais est-ce seulement possibles ?
        // Sinon, je ne vois pas comment faire, si ce n'est en créant de dangereux effets
        // de bord… L'autre solution, peut-être encore plus simple, c'est que +spec+ contienne
        // service, le service en cours de définition
        return spec.values(spec, this._getSelectValuesFromFunction.bind(this, spec, callback))
    }
    let values
    try {
      values = this._normalizeSelectValues(spec)
    } catch(err) {
      return callback(null, err.message)
    }
    // Cas d'une valeur customisée : l'ajouter dans le menu
    if ( spec.default && !values.find(d => d[0] == spec.default)) {
      values.unshift([spec.default, spec.default])
    }
    const data = Object.assign({}, spec, this.dialogBase(spec), {
        idValues: [spec.id]
      , values:   values
      , multi:    spec.multi
      , defaultValue: spec.default
      , ouiBtn: {name: spec.okName || getMsg('OK'), onclick: callback}
      , nonBtn: {name: spec.cancelName || getMsg('Cancel'), onclick: () => callback(null)}
    })
    if (spec.create) {
      const btnName = spec.create === true ? getMsg('new…') : spec.create
      data.midBtn = {name: btnName, onclick: this.promptString.bind(this, spec, callback)}
    }
    new SelectDialog(data).show()
  }
  // Le select attends une liste de valeurs = [ [val1, tit1], [val2, tit2] ... ]
  static _normalizeSelectValues(spec){
    if (!Array.isArray(spec.values)) raise('scserv-param-bad-type', ['values', 'array of object', typeof spec.values])
    return spec.values.map(value => {
      if (typeof value == 'string') {
        return [value, value]
      } else if (Array.isArray(value) && value.length == 2) {
        return value
      } else if (Object.isObject(value)) {
        spec.key_value ?? raise('scserv-select-with-object-requires-key-values', [spec.id])
        spec.key_title ?? raise('scserv-select-with-object-requires-title-values', [spec.id])
        value[spec.key_value] ?? raise('scserv-select-with-object-unknown-key', [spec.id, JSON.stringify(value), spec.key_value])
        value[spec.key_title] ?? raise('scserv-select-with-object-unknown-title', [spec.id, JSON.stringify(value), spec.key_title])
        return [value[spec.key_value], value[spec.key_title]]
      } else {
        raise('scserv-param-bad-type', ['values', '[value, title]', typeof value])
      }
    })
  }
  static _loadSelectValuesFromFile(path, callback, errCallback){
    server.send({action:'evaluate-file', path: path, no_raise: true}, (retour) => {
      if (retour.error) errCallback(null, retour.error)
      else callback(retour.data)
    })
  }
  static _getSelectValuesFromFunction(spec, callback, retour){
    console.log("-> _getSelectValuesFromFunction/spec/callback/retour", spec, callback, retour)
    spec.values = retour.data
    this.promptSelect.call(this, spec, callback)
  }

  // Choix d'un logiciel installé (lu dans /Applications, mis en cache),
  // ou saisie libre du nom (bouton "Autre application…")
  static APPS_LIST = undefined

  static promptLogiciel(spec, callback){
    if (this.APPS_LIST == undefined) {
      return server.send({action: 'list-applications'}, (retour) => {
        this.APPS_LIST = [['none', getMsg('(by-default)') ], ...retour.data.apps]
        this.promptLogiciel(spec, callback)
      })
    }
    new SelectDialog(Object.assign(this.dialogBase(spec, getMsg('app-choice')), {
        width:    spec.width || '560px'
      , message:  spec.message || getMsg('choose-app-to-use')
      , idValues: [spec.id]
      , values:   this.APPS_LIST
      , defaultValue: spec.default
      , ouiBtn: {name: getMsg('OK'), onclick: callback}
      , midBtn: {name: getMsg('other-app'), onclick: () => this.promptString(spec, callback)}
      , nonBtn: {name: getMsg('Cancel'), onclick: () => callback(null)}
    })).show()
  }

  /*****************************************************************/
  /*               TYPES LIÉS AU FINDER / CHEMINS                  */
  /*****************************************************************/

  static promptPath(spec, callback){
    const q = spec.message || spec.q || getMsg('select-el-in-finder-and-ok')
    const options = {midBtn: {name: 'Vide', onclick: () => callback('')}}
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(null, callback, retour), null, options, callback)
  }

  static promptFolder(spec, callback){
    const q = spec.message || spec.q || getMsg('select-folder-and-ok')
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(null, callback, retour), null, null, callback)
  }

  static promptPathInProject(spec, callback){
    const transformer = v => v.replace(Project.current.path + '/', '')
    const q = spec.message || spec.q || getMsg('select-el-in-project-and-ok')
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(transformer, callback, retour), null, null, callback)
  }

  static promptIcon(spec, callback){ this.promptPathInProject(spec, callback) }

  static promptFinderWindow(spec, callback){
    const q = spec.message || spec.q || getMsg('set-window-in-finder-and-ok')
    this._waitForWindow(spec, q, (retour) => this._getInfoFinderWindow('all', callback, retour), null, null, callback)
  }

  static promptBounds(spec, callback){
    const q = spec.message || spec.q || getMsg('pos-window-in-finder-and-ok')
    this._waitForWindow(spec, q, (retour) => this._getInfoFinderWindow(['position', 'size'], callback, retour), null, null, callback)
  }

  static promptPathOrNull(spec, callback){
    const dialogData = Object.assign(this.dialogBase(spec, 'Définition de paramètre'), {
      message: spec.message || spec.q || getMsg('sel-el-in-finder-or-click-none'),
      ouiBtn:  {name: getMsg('OK'),    onclick: (retour) => this._getPathOfFinderSelection(null, callback, retour)},
      nonBtn:  {name: getMsg('None'), onclick: () => callback(null)}
    })
    this._addPreserveOption(spec, dialogData, callback)
    new ConfirmDialog(dialogData).show()
  }

  static promptColorOrImage(spec, callback){
    new ConfirmDialog(Object.assign(this.dialogBase(spec, getMsg('choose-color-or-image')), {
        message:  spec.message || spec.q || getMsg('which-background')
      , ouiBtn:  {name: getMsg('Color'),    onclick: () => this.promptColor(spec, callback)}
      , midBtn:  {name: getMsg('Image'),    onclick: () => this.promptImage(spec, callback)}
      , nonBtn:  {name: getMsg('Nothing'),  onclick: () => callback('none')}
    })).show()
  }
  static promptImage(spec, callback){ this.promptPath(spec, callback) }
  static promptColor(spec, callback){
    new ColorDialog(Object.assign(this.dialogBase(spec, getMsg('Defining-a-color')), {
        message: spec.message || spec.q || getMsg('choose-a-color')
      , defaultValue: spec.default
      , ouiBtn: {name: getMsg('This-onee'), onclick: callback}
      , nonBtn: {name: getMsg('Nonee'),  onclick: () => callback(null)}
    })).show()
  }

  // -- Aides internes (Finder / fenêtres) --

  static _waitForWindow(spec, message, callback, fallback = null, options = null, preserveCallback = callback){
    const dialogData = Object.assign(this.dialogBase(spec, getMsg('Defining-parameter')), {
        message: message
      , content: options?.content ?? null
      , ouiBtn: {name: options?.ouiBtn ?? getMsg('OK')        , onclick: callback}
      , nonBtn: {name: options?.nonBtn ?? getMsg('Cancel')   , onclick: fallback}
    })
    if (options?.midBtn) Object.assign(dialogData, {midBtn: options.midBtn})
    this._addPreserveOption(spec, dialogData, preserveCallback)
    new ConfirmDialog(dialogData).show()
  }

  static _addPreserveOption(spec, dialogData, callback){
    if (spec.actual == null) return
    const preserve = DCreate('DIV', {class: 'preserve-value', text: `${getMsg('Preserve')} : ${spec.actual}`})
    if (dialogData.content) dialogData.content.appendChild(preserve)
    else dialogData.content = preserve
    dialogData.midBtn = {name: getMsg('Preserve'), onclick: () => callback(spec.actual)}
  }

  static _getPathOfFinderSelection(transformer, callback, retour){
    if (undefined == retour) {
      server.send({action: 'run-osascript', 'script-name': 'getPathOfFinderSelection'}, this._getPathOfFinderSelection.bind(this, transformer, callback))
    } else {
      var finalvalue = retour.data.filepath
      if (transformer) finalvalue = transformer(finalvalue)
      callback(finalvalue)
    }
  }

  static _getInfoFinderWindow(properties, callback, retour){
    if (undefined == retour) {
      return server.send({action: 'getInfoFinderWindow', type: 'folder'}, this._getInfoFinderWindow.bind(this, properties, callback))
    }
    const data = retour.data
    let value
    if (properties == 'all') {
      value = {
          path:       data.path
        , position:   data.position
        , left:       data.position[0]
        , top:        data.position[1]
        , size:       data.size
        , width:      data.size[0]
        , height:     data.size[1]
        , viewType:   data.view
        , sidebarWidth: data.sidebarWidth
      }
    } else {
      value = properties.reduce((accu, property) => {
        Object.assign(accu, {[property]: data[property]})
        return accu
      }, {})
    }
    callback(value)
  }

  /*****************************************************************/
  /*         TYPES D'ÉTAPES SCRIPT-SERVICE (ACTIONS / DONNÉES)     */
  /*****************************************************************/

  static promptAlert(spec, callback){
    spec.time || raise("this.time non défini")
    Reminder.register({
        title: spec.title
      , message: spec.message
      , icon: spec.icon
      , type: spec.type ?? 'warning'
      , time: spec.time
    })
    callback(true)
  }

  static promptSelectFile(spec, callback){
    const definer = new ParamsDefiner([{
        id: 'source'
      , type: 'path'
      , title: spec.title || getMsg('Choosing-finder-element')
      , q: spec.message || spec.q || getMsg('select-el-in-finder-and-ok')
    }], (definers) => callback(definers[0].value))
    definer.define()
  }

  static promptChooseFolder(spec, callback){
    const definer = new ParamsDefiner([{
        id: 'source'
      , type: 'folder'
      , title: spec.title || getMsg('Choosing-a-folder')
      , q: spec.message || spec.q || getMsg('select-folder-and-ok')
    }], (definers) => callback(definers[0].value))
    definer.define()
  }

  static promptCopyFile(spec, callback){
    server.send({action:'copy-file', source: spec.source, dest: spec.dest}, (retour) => {
      retour.error ? callback(null, retour.error) : callback(true)
    })
  }

  static promptAddToFile(spec, callback){
    const {path, content, after, before, where} = spec
    server.send({action: 'add-to-file', path, content, after, before, where}, (retour) => {
      retour.error ? callback(null, retour.error) : callback(true)
    })
  }

  static promptSetProjectData(spec, callback){
    spec.projet.set(spec.project_key, spec.value, (retour) => {
      retour?.error ? callback(null, retour.error) : callback(true)
    })
  }

  static promptGetProjectData(spec, callback){
    callback(spec.projet.get(spec.key || spec.id) || null)
  }

  static promptSet(spec, callback){
    callback(spec.value)
  }

  static promptTranslate(spec, callback){
    function translateDateLaps(ecart, format) {
      const date = new Date()
      date.setDate(date.getDate() + ecart)
      return formateDate(date, format || '%J %M %Y')
    }
    // Pour l'aide
    const marks = ['auj', 'today', 'tomorrow', 'demain', 'date+x', 'date-x']
    const mark = spec.value
    let value, m
    switch(true) {
      case /^auj$/.test(mark):     value = translateDateLaps(0, spec.format); break
      case /^today$/.test(mark):     value = translateDateLaps(0, spec.format); break
      case /^tomorrow$/.test(mark):  value = translateDateLaps(1, spec.format); break
      case /^demain$/.test(mark):    value = translateDateLaps(1, spec.format); break
      case !!(m = mark.match(/^date\+([0-9]+)$/)): value = translateDateLaps(parseInt(m[1]), spec.format); break
      case !!(m = mark.match(/^date\-([0-9]+)$/)): value = translateDateLaps(-1 * parseInt(m[1]), spec.format); break
      default:
        return callback(null, getErr('scserv-unknown-marker-translate', [mark, spec.id, marks.join(', ')]))
    }
    callback(value)
  }

  static promptCreateFolder(spec, callback){
    server.send({action: 'create-folder', data: spec.path, no_raise: true}, (retour) => {
      retour.error ? callback(null, retour.error) : callback(true)
    })
  }

  static promptCreateFile(spec, callback){
    server.send({action: 'create-file', path: spec.path, content: spec.content}, (retour) => {
      retour.error ? callback(null, getErr(retour.error)) : callback(true)
    })
  }

  static promptSaveData(spec, callback){
    server.send({action:'save-in-file', path: spec.path, obj: spec.obj, no_raise: true}, (retour) => {
      retour.error ? callback(null, retour.error) : callback(true)
    })
  }

  static promptGetData(spec, callback){
    server.send({action: 'get-data', path: spec.path, no_raise: true}, (retour) => {
      if (retour.error) return callback(null, retour.error)
      const data = retour.data
      let value
      if (spec.data_id) {
        if (Object.isObject(data)) value = data[spec.data_id]
        else if (Array.isArray(data)) value = data.find(c => c.id == spec.data_id)
        else value = data
      } else {
        value = data
      }
      callback(value)
    })
  }

}
