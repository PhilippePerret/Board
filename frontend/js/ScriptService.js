
class ScriptService {

  /* -- Point d'entrée principal -- */
  static run(projet, data){
    const scriptPath = data[0]
    const service = new ScriptService(projet, scriptPath)
    service.run()
  }

  constructor(projet, scriptPath){
    this.projet     = projet
    this.scriptPath = scriptPath
    this.steps      = []
    this.values     = {}
  }

  /* -- Point d'entrée secondaire -- */
  run(retour){
    if (undefined == retour) {
      server.send({action: 'load-yaml-file', path: this.scriptPath, no_raise: true}, this.run.bind(this))
    } else if (retour.error) {
      this.displayErrors([retour.error])
    } else if (!Array.isArray(retour.data)) {
        return this.displayErrors([getErr('scserv-list-required',[aide('script-services-steps')])])
    } else {
      // ok
      this.stepById = {}
      this.steps = retour.data.map(stepData => {
        const step = new ServStep(this, stepData)
        if (step.id) { Object.assign(this.stepById, {[step.id]: step}) }
        return step
      })
      console.info("Nombre d'étapes : %i", this.steps.length)
      this.errors = []
      if ( this.serviceSeemsValid() /* Premier contrôle rapide */) {
        this.execNextStep() 
      }
    }
  }

  /**
   * Analyse grossière de la validité du script-service (ses data)
   */
  serviceSeemsValid(){
    let errors = []
    // Définitions générales, par exemple les formats de date
    // Todo
    // Validité de chaque étape
    errors = [...errors, ...this.steps.flatMap(step => step.validate())]
    // Rapport final
    if (errors.length > 0) { 
      this.displayErrors(errors) 
      return false
    } else {
      return true
    }
  }

  /************************************************************/
  /*              BOUCLE SUR CHAQUE ÉTAPE                     */
  /************************************************************/
  execNextStep(){
    D.start()
    if (this.errors.length) {
      console.log("this.errors au retour de step.exec", this.errors)
    } else if (this.currentStep) {
      if (this.currentStep.aborted) return message("Abandon du script-service.")
    }
    const step = this.steps.shift()
    this.currentStep = step
    if ( step ) {
      /* ============  EXÉCUTION DE L'ÉTAPE  =============*/
      D.add(`--- ÉTAPE $1 ---`, [step.id])
      step.exec(this.errors, this.execNextStep.bind(this))
    } else {
      if (this.errors.length) {
        this.displayErrors(this.errors)
      } else if (this.steps.length == 0 /* si toutes les étapes ont été jouées*/) {
        // Fin des opérations
        message(getMsg('scserv-end'))
        new OKDialog({
          title: "Script service", 
          message: getMsg('scserv-end')
        }).show()
        return 
      } else {
        message("Abandon du script-service.")
      }
    }
  }

  // Retourne la valeur (value) d'une étape évaluée précédemment
  getValue(stepId){
    this.stepById[stepId] || this.errors.push(getErr('scserv-unknown-step', [stepId]))
    return this.stepById[stepId].value
  }
  // Pour définir la valeur d'une étape
  setValue(stepId, stepValue){
    this.stepById[stepId] || this.errors.push(getErr('scserv-unknown-step', [stepId]))
    this.stepById[stepId].value = stepValue
  }

  // Résoud un chemin d'accès relatif
  resolvePath(relativePath){
    return `${this.projet.path}/${relativePath.replace(/^\.\//, '')}`
  }


  /******************************************************************/
  /*                    USEFULL METHODS                             */
  /******************************************************************/

  // Pour éditer le fichier YAML de données du script script-service
  openData(retour){
    if (undefined == retour) {
      server.send({action: 'open-file-yaml', path: this.scriptPath}, this.openData.bind(this))
    } else {
      message(getMsg('file-opened', this.scriptPath.split('/').pop()))
    }
  }

  // Affichage des erreurs rencontrées
  displayErrors(errors){
    const data = {
        title:    'Erreur de définition du Script-service'
      , width:    '960px'
      , message:  'Le fichier de définition du script-service contient des erreurs.'+"\n\n"
      , errors:   errors
      , ouiBtn:   {name: 'Le modifier', onclick: this.openData.bind(this)}
    }
    new ErrorsDialog(data).show()
  }

} // ScriptService




  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/



class ServStep extends ExtendedObject {

  static init(){
    super.init()
    this.unenableUndefinedId = false
  }

  // Pour définir la valeur finale et passer à l'étape suivante
  setValue(value) {
    if ( value === ':abort:' ) {
      // Normalement, rien à faire puisque le callback n'est pas appelé
      this.aborted = true
    } else {
      value = this.transformValue(value)
      console
      message(`Valeur pour étape '${this.id} = ${(typeof value == 'object') ? JSON.stringify(value) : value}`)
      this.value = value
      // Pour définir une autre valeur d'étape
      this.ifSet()
      // Puis on joue la suite
      this.callback()
    }
  }

  /**
   * S'il faut transformer la valeur
   */
  transformValue(value){
    if (! this.transform ) return value
    switch(this.transform) {
      case 'date':      return formateDate(value, this.format)
      case 'valid-id':  return slugify(value)
      case 'integer': 
      case 'entier':    return parseInt(value, 10)
      case 'float': 
      case 'flottant':  return parseFloat(value)
      case 'boolean':
        switch(value){
          case 'true':  return true
          case 'false': return false
        }
      default:
        return value
    }
  }
  /**
   * Pour définir de façon simple une autre valeur d'étape, sans 
   * passer par une étate 'set'
   */
  ifSet(){
    if (this.set) {
      this.scriptService.setValue(this.set, value)
    }
  }

  // Dans l'exécution des étapes, il ne faut pas utiliser raise mais retourner 
  // cette fonction.
  addFatalError(msg, params){
    this.setValue(':abort:')
    this.errors.push(getErr(msg, params))
    return false
  }


  /**
   ***************************************************************
   *              EXÉCUTION DE L'ÉTAPE
   * (Fonction principale)
   * 
   * Pour le moment, on essaie de l'évaluer en même temps qu'on 
   * l'exécute, c'est-à-dire qu'on fait une première passe pour
   * essayer autant qu'on peut et ensuite on lance vraiment.
   * 
   * Note : L'étape a déjà été validée dans ses grandes largeurs.
   * 
   * @param errors Array Container pour les erreurs
   */
  exec(errors, callback){
    this.callback = callback
    this.errors = errors
    // Pour une étape conditionnelle
    if (this.isConditional && this.conditionNotSatisfied()){ 
      console.info("La condition n'est pas satisfaite, je passe à la suite.")
      return callback()
    } else if (this.isConditional) {
      console.info(`La condition est satisfaite, j'exécute l'étape ${this.id}.`)
    } else {
      console.info("Étape inconditionnelle")
    }

    // Remplacements communs dans les paramètres
    ['q', 'path', 'value', 'content'].forEach( param => {if (this[param]) { this[param] = this.evaluateProp(param)}})
    if (this.path) this.path = this.expandPath(this.path)
    if (this.value) this.ifSet() // pourra être modifié

    const method = `exec${kebabToPascalCase(this.type)}`
    if ('function' == typeof this[method]) {
      this[method].call(this)
    } else {
      this.errors.push(`Fonction à définir : ${method}`) // normalement détecté avant
      callback()
    }
  }

  // Étape pour choisir un fichier
  execSelectFile(retour){
    historize('-> execSelectFile', retour)
    if (retour){
      const path = retour[0].value
      this.setValue(path)
    } else {
      const definer = new ParamsDefiner([{
          id: 'source'
        , type: 'path'
        , title: this.title || "Choix d'un élément de Finder"
        , q: this.q || "Choisir l'élément dans le Finder et cliquer sur “OK”."
      }], this.execSelectFile.bind(this))
      definer.define()
    }
  }
  execChooseFolder(retour){
    historize('-> execChooseFolder', retour)
    if (retour){
      if (retour.error) return this.addFatalError(retour.error) // is no_raise, mais non définissable, encore
      const path = retour[0].value
      this.setValue(path)
    } else {
      const definer = new ParamsDefiner([{
          id: 'source'
        , type: 'folder'
        , title: this.title || "Choix d'un dossier"
        , q: this.q || "Choisir le dossier dans le Finder et cliquer sur “OK”."
      }], this.execChooseFolder.bind(this))
      definer.define()
    }
    
  }

  // Copie d'un fichier
  execCopyFile(retour){
    if (retour) {
      if (retour.error) return this.addFatalError(retour.error)
      else this.setValue(true)
    } else {
      const src = this.expandPath(this.evaluateProp('source'))
      const dst = this.expandPath(this.evaluateProp('dest'))
      // console.log("source et dest", {src, dst})
      server.send({action:'copy-file', source: src, dest: dst}, this.execCopyFile.bind(this))
    }
  }

  // Pour ajouter le contenu +content+ au fichier +path+
  execAddToFile(retour){
    historize('-> execAddToFile', retour)
    if (retour) {
      if (retour.error) return this.addFatalError(retour.error)
      else this.setValue(true)
    } else {
      const path    = this.path
      const content = this.content
      const after   = this.evaluateProp('after')
      const before  = this.evaluateProp('before')
      const where   = this.evaluateProp('where')
      server.send({action: 'add-to-file', path, content, after, before, where}, this.execAddToFile.bind(this))
    }
  }

  // Etape d'affectation d'une valeur au projet
  execSetProjectData(retour){
    if (retour) {
      if (retour.error) return this.addFatalError(retour.error) // Ne peut pas encore passer par là
      else this.setValue(true)
    } else {
      const value = this.value
      this.projet.set(this.project_key, value, this.execSetProjectData.bind(this, {error: undefined}))
      // On met la valeur dans l'étape de projet
      // console.info("L'étape %s doit prendre la valeur %s", this.project_key, value)
      this.scriptService.setValue(this.project_key, value)
      this.ifSet()
    }
  }

  // Pour récupérer une valeur projet
  execGetProjectData(){
    historize('-> execGetProjectData')
    this.setValue(this.projet.get(this.key || this.id) || null) // la clé peut être l'id
  }

  /**
   * Fonction qui se contente de fixer la valeur d'une étape précédente ou
   * de l'étape courante.
   * Cette donnée servira plus tard car elle sera accessible avec 
   * "${<step id>}".
   */
  execSet(){
    var finalValue = this.value
    if (this.step) {
      this.scriptService.setValue(this.step, finalValue)
      this.setValue(true)
    } else {
      console.log("Mise de la valeur de '%s' à '%s'", this.id, finalValue)
      this.setValue(finalValue)
    }
  }

  execTranslate(){

    function translateDateLaps(ecart, format) {
      const date = new Date()
      date.setDate(date.getDate() + ecart)
      return formateDate(date, format || '%J %M %Y')
    }

    var mark
    if (this.step) { mark = this.scriptService.getValue(this.step)}
    else mark = this.value

    // Pour l'aide de l'erreur
    const marker_list = ['today', 'tomorrow', 'demain', 'date+x', 'date-x']

    // Transformation de la valeur
    var value, m
    switch(true) {
    case /^today$/.test(mark): 
      value = translateDateLaps(0, this.format)
      break
    case /^tomorrow$/.test(mark):
      value = translateDateLaps(1, this.format)
      break
    case /^demain$/.test(mark):
      value = translateDateLaps(1, this.format)
      break
    case !!(m = mark.match(/^date\+([0-9]+)$/)):
      value = translateDateLaps(parseInt(m[1]), this.format)
      break
    case !!(m = mark.match(/^date\-([0-9]+)$/)):
      value = translateDateLaps(-1 * parseInt(m[1]), this.format)
      break
    default: 
      return this.addFatalError('scserv-unknown-marker-translate', [mark, this.id, marker_list.join(', '), this.aideByType])
    }
    // /Fin de transformation de la valeur

    console.info("value date = ", value)

    // à la fin
    if (this.step) { 
      this.scriptService.setValue(this.step, value)
      this.callback()
    } else this.setValue(value)
  }



  execString(retour){
    historize('-> execString', retour)
    if (retour) {
      if (this.required && retour == ':none:') {
        //=> une erreur
      }
      this.setValue(retour)
    } else {
      const ddata = {
          title: this.title
        , message: this.q || "Entrez la valeur dans le champ ci-dessous."
        , default: this.default || ""
        , ouiBtn: {name:'OK', onclick: this.execString.bind(this)}
        , nonBtn: {name:'Renoncer', onclick: this.execString.bind(this, ':abort:')}
      }
      new TextFieldDialog(ddata).show()
    }
  }

  execText(retour){
    if (retour) {
      this.setValue(retour)
    } else {
      const ddata = {
          title: this.title
        , message: this.q
        , errorMessage: this.errorMessage
        , ouiBtn: {name:'OK', onclick:this.execText.bind(this)}
        , nonBtn: {name: getMsg('Cancel'), onclick:this.execText.bind(this, ':abort:')}
      }
      new TextareaDialog(ddata).show()
    }
  }

  execDateTime(retour) {
    if (retour) {
      // Vérification du format
      var time
      this.format || (this.format = REG_DATETIME_JJ_MM_HH_MM);
      if ( datetime = Validator.datetime(retour, this.format, true) ){
        this.setValue(datetime)
      } else {
        const dataDial = {
          title: 'Date et heure'
          , message: this.q || getMsg('scserv-datetime-default-format')
          , ouiBtn: {name: 'OK', onclick: this.execDateTime.bind(this)}
          , nonBtn: {name: getMsg('Cancel'), onclick:this.execDateTime.bind(this, ':abort:')}
        }
        new TextFieldDialog(dataDial).show()
      }
    }
  }

  execCreateFolder(){
    server.send({action: 'create-folder', data: this.path, no_raise: true}, this.afterCreateFolder.bind(this))
  }

  execCreateFile(retour){
    if (retour) {
      if (retour.error) return this.addFatalError(getErr(retour.error))
      else this.setValue(true)
    } else {
      server.send({action: 'create-file', path: this.path, content: this.content}, this.execCreateFile.bind(this))
    }

  }

  execPhone(retour) {
    if (retour) {
      // phone valide
      retour = retour.replace(/\./, ' ')
      if (retour.match(/[0-9]{8}/)) retour = retour.match(/\d\d/g).join(" ")
      if (retour.match(/[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}/)) {
        this.setValue(retour)
      } else {
        this.errorMessage = getErr('invalid-phone-number', retour)
        this.execPhone(undefined)
      }
    } else {
      const ddata = {
          title: this.title || 'Numéro de téléphone'
        , message: this.q || 'Merci de bien vouloir fournir un numéro de téléphone valide.'
        , default: this.default || ""
        , errorMessage: this.errorMessage
        , ouiBtn: {name:'OK', onclick: this.execPhone.bind(this)}
        , nonBtn: {name:'Renoncer', onclick: this.execPhone.bind(this, ':abort:')}
      }
      new TextFieldDialog(ddata).show()
    }
  }

  /**
   * @return La valeur sélectionnée ('autre' pour création)
   * 
   * this.values définit le type de valeurs proposées
   */
  execSelect(retour) {
    try {
      if (retour) {
        if (retour.error) { return this.addFatalError(retour.error) }
        this.values = retour.data
      }
      if ( 'string' == typeof this.values ) {
        // this.values est un string => c'est un fichier contenant les données ou les renvoyant
        this.values = this.evaluateProp('values')
        this.getFileValues(this.values, this.execSelect.bind(this))
      } else if ( this.selectValuesAreValid() ) {
        // <= This.values validées et mises en forme
        // => On peut procéder au choix
        new SelectDialog(this.selectDialogData()).show()
      }
    } catch(err) {
      return this.addFatalError(err.message, err.params)
    }
  }

  /**
   * Méthode complexe permettant d'enregistrer une valeur dans un fichier
   * this.prefix : si défini
   * this.keys : les données à enregistrer, à reconstituer
   */
  execSaveData(retour){
    if (retour) {
      if (retour.error) { return this.addFatalError(retour.error) } 
      this.setValue(!retour.error)
    } else {
      if (this.prefix) {
        const obj = {}
        if (typeof this.keys == 'string') {
          this.keys = this.evaluateProp('keys')
        }
        this.keys.forEach(id => {
          Object.assign(obj, { [id]: this.scriptService.getValue(`${this.prefix}-${id}`) })
        })
        const path = this.path
        // console.info("Objet à enregistrer dans %s", this.path, obj)
        server.send({action:'save-in-file', path, obj, no_raise: true}, this.execSaveData.bind(this))
      }
    }
  }

  execGetData(retour){
    if(retour){
      const data = retour.data
      let value
      if (retour.error) { return this.addFatalError(retour.error) }
      else if (this.data_id){
        const data_id = this.evaluateProp('data_id')
        if (Object.isObject(data)) {
          value = data[data_id]
          console.log("[execGetData] avec objet[%s]", data_id, data, value)
        } else if (Array.isArray(data)) {
          value = data.find(c => { 
            console.log({c, data_id})
            return c.id == data_id 
          })
          console.log("[execGetData] avec array [%s]", data_id, data, value)
        } else {
          value = data
          console.log("[execGetData] ni object ni array", data)
        }
      } else {
        value = data
      }
      // console.log("Donnée finale", value)
      this.setValue(value)
    } else {
      this.path = this.expandPath(this.evaluateProp('path'))
      server.send({action: 'get-data', path: this.path, no_raise: true}, this.execGetData.bind(this))
    }
  }


  /************** /FIN DES MÉTHODES D'EXÉCUTION ******************/

  afterCreateFolder(retour){
    console.log("[afterCreateFolder] RETOUR", retour)
    if (retour.error) return this.addFatalError(retour.error)
    this.setValue(true)
  }

  // Appelé avec le résultat du choix
  // On le met dans le this.value de cette étape
  /**
   * TODO: Il faudrait un garde-fou quand la valeur '' : les
   * étapes suivantes doivent comporter "if: ${<this id>} = ''"
   */
  onChooseSelect(choix){
    this.setValue(choix)
  }

  // Vérifie que les données values pour le select sont valides et
  // les met en bonne forme
  selectValuesAreValid(){
    if ( Array.isArray(this.values) ) {
      // On va transformer this.values en le type parfait pour un 
      // select : [[value, title], ...]
      var keyAndTitleChecked = false
      this.values = this.values.map(value => {
        if (typeof value == 'string') {
          return [value, value]
        } else if (Object.isObject(value)){
          if (!keyAndTitleChecked) {
            this.key_value ?? raise('scserv-select-with-object-requires-key-values', [this.id, this.aideByType])
            this.key_title ?? raise('scserv-select-with-object-requires-title-values', [this.id, this.aideByType])
            keyAndTitleChecked = true
          }
          value[this.key_value]    ?? raise('scserv-select-with-object-unknown-key', [this.id, JSON.stringify(value), this.key_value, this.aideByType])
          value[this.key_title]  ?? raise('scserv-select-with-object-unknown-title', [this.id, JSON.stringify(value), this.key_title, this.aideByType])
          return [value[this.key_value], value[this.key_title]]
        } else if (Array.isArray(value) && value.length == 2) {
          return value
        } else {
          return this.addFatalError('scserv-param-bad-type', ['values', '[value, title]', typeof value])
        }
      })
    } else {
      return this.addFatalError('scserv-param-bad-type', ['values', 'array of object', typeof this.values])
    }
    return true
  }
  
  selectDialogData(){
    const data ={
        title: this.title
      , message: this.q
      , width: '620px'
      , values: this.values
      , ouiBtn: {name: 'Choisir', onclick: this.onChooseSelect.bind(this)}
      , nonBtn: {name: 'Renoncer', onclick: this.onChooseSelect.bind(this, ':abort:')}
    }
    if (this.create) {
      const btnName = this.create === true ? "Nouveau…" : this.create
      Object.assign(data, {
        midBtn: {name: btnName, onclick: this.onChooseSelect.bind(this, "")}
      })
    }
    return data
  }



  /**
   * Fonction chargeant les valeurs d'un fichier quelconque.
   * La donnée remontée peut être de tout type, mais en général, 
   * ce sera un <array-of-object> pour pouvoir choisir une
   * valeur
   */
  getFileValues(path, callback, retour) {
    // console.log("-> getFileValues, retour = ", retour)
    if (undefined == retour) {
      path = this.expandPath(path)
      server.send({action:'evaluate-file', path: path, no_raise: true}, this.getFileValues.bind(this, path, callback))
    } else if (retour.error) {
      return this.addFatalError('scserv-on-get-file-values', [retour.error, path, aide('script-service-file-values')])
    } else {
      callback(retour)
    }
  }


  constructor(scriptService, data){
    super(data)
    this.scriptService = scriptService
    this.projet = this.scriptService.projet
    this.isConditional = this.if
  }

  /**
   * "${<id etape>}" → value de l'étape
   * 
   * ATTENTION : Pour que la propriété +prop+ soit évaluée, il est 
   * impératif que dans ses données (ScriptServiceData.js) on trouve
   * 'evaluate: true'
   * 
   * Les formes évaluées
   * 
   *  ${<stepid>}       Remplacé par le .value de l'étape (qui peut être définit par le type 'set')
   *  ${stepid}.prop    Remplacé par la propriété +prop+ de la valeur de la value de l'étape stepid
   *                    Dans ce cas, le .value doit être une table (dict) et +prop+ sa propriété
   *  ${stepid}[prop]   Même que précédente, mais peut-être plus clair sur le fonctionnement.
   * 
   */
  evaluateProp(prop){
    if ('string' == typeof this[prop]) {
      var val = this[prop]
      val = val.replace(/\$\{([^}]+)\}\[([a-z_]+)\]/g, (match, stepId, property) => this.getPropertyInStepValue(stepId,property))
      val = val.replace(/\$\{([^}]+)\}\.([a-z_]+)/g, (match, stepId, property) => this.getPropertyInStepValue(stepId,property))
      val = val.replace(/\$\{(.+?)\}/g, (match, stepId) => {return this.serviceValue(stepId)})
      if ( val != this[prop]) {
        console.log("Valeur de '%s' transformée. Initiale: '%s'. Finale: '%s'", prop, this[prop], val)
      }
      return val
    } else {
      return this[prop]
    }
  }
  getPropertyInStepValue(stepId, property){
    const servValue = this.serviceValue(stepId)
    D.add( "Valeur du service $1 : $2", [stepId, JSON.stringify(servValue)])
    const value = servValue[property]
    D.add( "Valeur de la propriété $1 : $2", [property, value])
    return value
  }
  serviceValue(stepId) {return this.scriptService.getValue(stepId)}

  get dataType(){ return this._dtype || (this.dtype = SCRIPT_SERVICES_KNOWN_TYPES[this.type] )}
  get aideByType(){ return this._aidtype || (this._aidtype = aide(`script-service-type-${this.type}`) )}
  get paramsSpecs(){return this._pmsvalid || (this._pmsvalid = this.dataType.params)}
  // Retourne les données absolues de la propriété +prop+
  getAbsoluteData(prop) { return this.paramsSpecs[prop]}


  expandPath(path){
    if (path[0] == '/') {
      return path
    } else {
      return this.scriptService.resolvePath(path)
    }
  }
  resolvePath(path){return this.expandPath(path)}

  /**
   * Retourne true si la condition de l'étape n'est pas satisfaite,
   * true otherwise
   * 
   * Pour le moment une condition est toujours formée par 'expression evaluateur resultat'
   * evaluator : '=', '>' etc.
   */ 
  conditionNotSatisfied(){
    function toRealValue(value){
      switch(value) {
        case 'null':      return null
        case 'undefined': return undefined
        case 'empty':     return []
        default: return value
      }
    }
    var [expression, evaluator, expected] = this.if.split(' ')
    // console.log("évaluation terms", {expression, expected, evaluator})
    expression = expression.replace(/^\$\{(.*)\}$/, (match, idStep) => { return this.scriptService.getValue.call(this.scriptService, idStep) })
    expression = toRealValue(expression)
    expected = toRealValue(expected.replace(/^(['"])(.*)\1$/, '$2'))
    console.log("évaluation terms", {expression, expected, evaluator})
    switch(evaluator){
      case '==': case '=':
        return !(expression == expected)
      case '!=': case '≠':
        return (expression == expected)
      case '>':
        return !(expression > expected)
      case '<':
        return !(expression < expected)
      default:
        return this.addFatalError('scserv-unknown-evaluator', [this.id, evaluator, this.aideByType])
    }
  }

  // Retourne la liste des erreurs trouvées pour cette étape (vide = ok)
  validate(){
    const errors = []
    try {
      this.id_is_required()
      this.id_is_valid()
      this.type_is_required()
      this.type_is_known()
      this.has_all_required_params()
      this.other_params_are_valid()
    } catch(err) {
      console.log("err", err)
      // Object String (pas primitif) : se comporte comme une string partout
      // (affichage, template literals) mais peut porter la clé d'erreur brute
      // (err.message, non traduite) en propriété, pour l'identifier de façon
      // stable indépendamment du texte traduit (cf. tests unitaires).
      const message = new String(getErr(err.message, err.params))
      message.key = err.message
      errors.push(message)
    }
    return errors
  }


  id_is_required(){ this.id ?? raise('scserv-id-required', [JSON.stringify(this.data), aide('scripts-services')]) }
  id_is_valid() { this.id.replace(/[0-9a-z_\-]/gi, '') == '' || raise('scserv-id-invalid', [this.id, aide('script-service-valid-id')]) }
  type_is_required() { this.type ?? raise('scserv-type-required', [this.id, aide('scripts-services')]) }
  type_is_known() { SCRIPT_SERVICES_KNOWN_TYPES[this.type] || raise('scserv-step-type-unknowned', [this.type, aide('script-service-types-valides')]) }
  has_all_required_params() {
    this.required_params = {}
    for (var kparam in this.paramsSpecs){
      // Condition : le paramètre doit être défini
      if (! this.paramsSpecs[kparam].required === true) return
      Object.assign(this.required_params, {[kparam]: true})
      this[kparam] || raise('scserv-param-required', [kparam, this.type, this.aideByType])
    }
  }
  other_params_are_valid(){
    // On passe en revue tous les paramètres 
    for (var kparam of Object.getOwnPropertyNames(this.data)) {
      // On passe les paramètres universels (id, type…) et les 
      // paramètres de l'étape définis comme requis
      if (UNIV_KEYS[kparam] || this.required_params[kparam]) continue
      // On prend la donnée du param dans l'étape
      const dataParam = this.data[kparam]
      const paramSpec = this.paramsSpecs[kparam]
      // Le paramètre doit être connu (hum… de quoi je parle, là ?)
      // Par exemple du paramètre 'values' ou 'default' pour un type
      //  'select'
      // Si on rencontre dans les données le paramètre 'defaut', 
      // c'est un paramètre qui n'existe pas (un select n'a pas de 
      // paramètre 'defaut') et c'est donc une erreur
      paramSpec || addFatalError( 'scserv-unknown-param', [kparam, this.type, this.aideByType])
      // --- On s'arrête là pour la pré-validation ---
    }
    return true
  }
} // ServStep
ServStep.init()