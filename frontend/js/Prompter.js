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
    'function' == typeof this[method] || raise(`Prompter.${method} doit être défini.`)
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
      console.error("Je dois apprendre à définir une valeur application.")
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
          TBL_PROJECT_DATA[prop] || raise(`La propriété ${prop} doit être ajoutée Project.PROPERITES, la liste des propriétés des projets, pour pouvoir être enregistrée.`)
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

  static promptString(spec, callback){
    new TextFieldDialog({
        title:    spec.name || spec.title
      , id:       spec.id
      , message:  spec.message || spec.q
      , default:  spec.default ?? ''
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: 'OK', onclick: callback}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  static promptText(spec, callback){
    new TextareaDialog({
        title:    spec.name || spec.title
      , id:       spec.id
      , message:  spec.message || spec.q
      , default:  spec.default ?? ''
      , width:    spec.width
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: 'OK', onclick: callback}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  static promptBoolean(spec, callback){
    new ConfirmDialog({
        title:      spec.name || spec.title
      , message:    spec.message || spec.q
      , defaultKey: spec.actual === false ? 'Non' : 'Oui'
      , ouiBtn: {name: 'Oui', onclick: () => callback(true)}
      , nonBtn: {name: 'Non', onclick: () => callback(false)}
    }).show()
  }

  static promptInteger(spec, callback){
    new TextFieldDialog({
        title:    spec.name || spec.title
      , id:       spec.id
      , message:  spec.message || spec.q
      , defaultValue: spec.default
      , toRealValue: (n) => parseInt(n)
      , ouiBtn: {name: 'OK', onclick: callback}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  static promptUrl(spec, callback){
    new TextFieldDialog({
        title:        spec.name || 'Définition d’URL'
      , id:           spec.id
      , message:      spec.message || spec.q || "Quelle URL faut-il rejoindre ?"
      , defaultValue: spec.default || 'https://'
      , ouiBtn: {name: 'OK', onclick: callback}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  static promptServiceName(spec, callback){
    new TextFieldDialog({
        title:    'Nouveau nom du service'
      , id:       spec.id
      , message:  spec.message || 'Quel nouveau nom donner à ce service pour le projet ?'
      , defaultValue: spec.default
      , ouiBtn: {name: 'OK', onclick: callback}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  static promptPhone(spec, callback){
    new TextFieldDialog({
        title:    spec.name || spec.title || 'Numéro de téléphone'
      , id:       spec.id
      , message:  spec.message || spec.q || 'Merci de bien vouloir fournir un numéro de téléphone valide.'
      , default:  spec.default || ''
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: 'OK', onclick: (retour) => this._validatePhone(retour, spec, callback)}
      , nonBtn: {name: 'Renoncer', onclick: () => callback(null)}
    }).show()
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
    new TextFieldDialog({
        title:    spec.name || 'Date et heure'
      , id:       spec.id
      , message:  spec.message || spec.q || getMsg('scserv-datetime-default-format')
      , errorMessage: spec.errorMessage
      , ouiBtn: {name: 'OK', onclick: (retour) => {
          const datetime = Validator.datetime(retour, format, true)
          if (datetime) callback(datetime)
          else this.promptDateTime(spec, callback)
        }}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  /*****************************************************************/
  /*                          SELECT                                */
  /*****************************************************************/

  // spec.values : array de strings, de [value,title], d'objects
  //               (avec spec.key_value/spec.key_title), ou un chemin
  //               de fichier (string) à charger depuis le disque.
  // spec.create : true|"Libellé" pour ajouter un bouton de création
  static promptSelect(spec, callback){
    if ('string' == typeof spec.values) {
      return this._loadSelectValuesFromFile(spec.values, (values) => {
        this.promptSelect(Object.assign({}, spec, {values}), callback)
      }, callback)
    }
    let values
    try {
      values = this._normalizeSelectValues(spec)
    } catch(err) {
      return callback(null, err.message)
    }
    const data = {
        title:    spec.name || spec.title
      , id:       spec.id
      , message:  spec.message || spec.q
      , width:    spec.width
      , idValues: [spec.id]
      , values:   values
      , defaultValue: spec.default
      , ouiBtn: {name: spec.okName || 'OK', onclick: callback}
      , nonBtn: {name: spec.cancelName || 'Annuler', onclick: () => callback(null)}
    }
    if (spec.create) {
      const btnName = spec.create === true ? "Nouveau…" : spec.create
      data.midBtn = {name: btnName, onclick: () => callback("")}
    }
    new SelectDialog(data).show()
  }
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

  // Choix d'une valeur dans le menu, ou saisie libre (bouton "Autre valeur…")
  static promptSelectOrString(spec, callback){
    this.promptSelect(Object.assign({}, spec, {
      midBtn: {name: 'Autre valeur…', onclick: () => this.promptString(spec, callback)}
    }), callback)
  }

  // Choix d'un logiciel installé (lu dans /Applications, mis en cache),
  // ou saisie libre du nom (bouton "Autre application…")
  static APPS_LIST = undefined
  static promptLogiciel(spec, callback){
    if (this.APPS_LIST == undefined) {
      return server.send({action: 'list-applications'}, (retour) => {
        this.APPS_LIST = [['none', "(par défaut)"], ...retour.data.apps]
        this.promptLogiciel(spec, callback)
      })
    }
    new SelectDialog({
        title:    spec.name || "Choix d'une application"
      , id:       spec.id
      , width:    '560px'
      , message:  spec.message || 'Choisir l’application à utiliser'
      , idValues: [spec.id]
      , values:   this.APPS_LIST
      , defaultValue: spec.default
      , ouiBtn: {name: 'OK', onclick: callback}
      , midBtn: {name: 'Autre application…', onclick: () => this.promptString(spec, callback)}
      , nonBtn: {name: 'Annuler', onclick: () => callback(null)}
    }).show()
  }

  /*****************************************************************/
  /*               TYPES LIÉS AU FINDER / CHEMINS                  */
  /*****************************************************************/

  static promptPath(spec, callback){
    const q = spec.message || spec.q || "Sélectionner l'élément dans le Finder et cliquer sur OK."
    const options = {midBtn: {name: 'Vide', onclick: () => callback('')}}
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(null, callback, retour), null, options)
  }

  static promptFolder(spec, callback){
    const q = spec.message || spec.q || "Sélectionner le dossier dans le Finder et cliquer sur OK."
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(null, callback, retour))
  }

  static promptPathInProject(spec, callback){
    const transformer = v => v.replace(Project.current.path + '/', '')
    const q = spec.message || spec.q || "Sélectionner l'élément dans le dossier du projet et cliquer sur OK."
    this._waitForWindow(spec, q, (retour) => this._getPathOfFinderSelection(transformer, callback, retour))
  }

  static promptIcon(spec, callback){ this.promptPathInProject(spec, callback) }

  static promptFinderWindow(spec, callback){
    const q = spec.message || spec.q || "Ouvrir la fenêtre dans le Finder et la régler comme voulue (position, taille, type de vue) puis cliquer OK."
    this._waitForWindow(spec, q, (retour) => this._getInfoFinderWindow('all', callback, retour))
  }

  static promptBounds(spec, callback){
    const q = spec.message || spec.q || "Positionner la fenêtre dans le Finder et cliquer “OK”."
    this._waitForWindow(spec, q, (retour) => this._getInfoFinderWindow(['position', 'size'], callback, retour))
  }

  static promptPathOrNull(spec, callback){
    const dialogData = {
      title:   'Définition de paramètre',
      message: spec.message || spec.q || "Sélectionner l'élément dans le Finder ou cliquer 'Aucun'.",
      ouiBtn:  {name: 'OK',    onclick: (retour) => this._getPathOfFinderSelection(null, callback, retour)},
      nonBtn:  {name: 'Aucun', onclick: () => callback(null)}
    }
    this._addPreserveOption(spec, dialogData, callback)
    new ConfirmDialog(dialogData).show()
  }

  static promptColorOrImage(spec, callback){
    new ConfirmDialog({
        title:   spec.title || "Choisir une couleur ou une image"
      , message: spec.message || spec.q || 'Que voulez-vous choisir comme fond ?'
      , ouiBtn:  {name: 'Couleur', onclick: () => this.promptColor(spec, callback)}
      , midBtn:  {name: 'Image',   onclick: () => this.promptImage(spec, callback)}
      , nonBtn:  {name: 'Rien',    onclick: () => callback('none')}
    }).show()
  }
  static promptImage(spec, callback){ this.promptPath(spec, callback) }
  static promptColor(spec, callback){
    new ColorDialog({
        title:   "Définition d'une couleur"
      , id:      spec.id
      , message: spec.message || spec.q || "Sélectionner une couleur avec le picker ci-dessous."
      , defaultValue: spec.default
      , ouiBtn: {name: 'Celle-là', onclick: callback}
      , nonBtn: {name: 'Aucune',  onclick: () => callback(null)}
    }).show()
  }

  // -- Aides internes (Finder / fenêtres) --

  static _waitForWindow(spec, message, callback, fallback = null, options = null){
    const dialogData = {
        title: 'Définition de paramètre'
      , message: message
      , content: options?.content ?? null
      , ouiBtn: {name: options?.ouiBtn ?? 'OK'        , onclick: callback}
      , nonBtn: {name: options?.nonBtn ?? 'Annuler'   , onclick: fallback}
    }
    if (options?.midBtn) Object.assign(dialogData, {midBtn: options.midBtn})
    this._addPreserveOption(spec, dialogData, callback)
    new ConfirmDialog(dialogData).show()
  }

  static _addPreserveOption(spec, dialogData, callback){
    if (spec.actual == null) return
    const preserve = DCreate('DIV', {class: 'preserve-value', text: `Préserver : ${spec.actual}`})
    if (dialogData.content) dialogData.content.appendChild(preserve)
    else dialogData.content = preserve
    dialogData.midBtn = {name: 'Préserver', onclick: () => callback(spec.actual)}
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
      , title: spec.title || "Choix d'un élément de Finder"
      , q: spec.message || spec.q || "Choisir l'élément dans le Finder et cliquer sur “OK”."
    }], (definers) => callback(definers[0].value))
    definer.define()
  }

  static promptChooseFolder(spec, callback){
    const definer = new ParamsDefiner([{
        id: 'source'
      , type: 'folder'
      , title: spec.title || "Choix d'un dossier"
      , q: spec.message || spec.q || "Choisir le dossier dans le Finder et cliquer sur “OK”."
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
    const mark = spec.value
    let value, m
    switch(true) {
      case /^today$/.test(mark):     value = translateDateLaps(0, spec.format); break
      case /^tomorrow$/.test(mark):  value = translateDateLaps(1, spec.format); break
      case /^demain$/.test(mark):    value = translateDateLaps(1, spec.format); break
      case !!(m = mark.match(/^date\+([0-9]+)$/)): value = translateDateLaps(parseInt(m[1]), spec.format); break
      case !!(m = mark.match(/^date\-([0-9]+)$/)): value = translateDateLaps(-1 * parseInt(m[1]), spec.format); break
      default:
        return callback(null, getErr('scserv-unknown-marker-translate', [mark, spec.id, ['today', 'tomorrow', 'demain', 'date+x', 'date-x'].join(', ')]))
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
