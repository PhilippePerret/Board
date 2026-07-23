
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
        return this.displayErrors([msgErr('scserv-list-required',[aide('script-services-steps')])])
    } else {
      // ok
      this.stepById = {}
      this.steps = retour.data.map(stepData => {
        const step = new ServStep(this, stepData)
        if (step.id) { Object.assign(this.stepById, {[step.id]: step}) }
        return step
      })
      this.errors = []
      if ( this.serviceSeemsValid() /* Premier contrôle rapide */) {
        this.execNextStep() 
      } else {

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
    console.log("this.errors au retour de step.exec", this.errors)
    const step = this.steps.shift()
    if ( step ) { 
      /* ============  EXÉCUTION DE L'ÉTAPE  =============*/
      step.exec(this.errors, this.execNextStep.bind(this))
    } else {
      if (this.errors.length) {
        this.displayErrors(this.errors)
      } else {
        message(getMsg('scserv-end')); return 
      }
    }
  }

  // Retourne la valeur (value) d'une étape évaluée précédemment
  getValue(stepId){
    this.stepById[stepId] || raise('scserv-unknown-step', [stepId])
    return this.stepById[stepId].value
  }
  // Pour définir la valeur d'une étape
  setValue(stepId, stepValue){
    this.stepById[stepId] || raise('scserv-unknown-step', [stepId])
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
    console.log('-> displayErrors avec', errors)
    const containerErrors = DCreate('DIV', {
        class: 'error break-all small'
      , text: errors.map(error => {
          if (typeof error == 'string') {
            error = error
          } else {
            error = `Erreur de type ${typeof error}`
          }
          return `<div class="error">${error}</div>`
        }).join('')
      , style: 'margin:2em 0;'
    })
    const data = {
        title:    'Erreur de définition du Script-service'
      , width:    '960px'
      , message:  'Le fichier de définition du script-service contient des erreurs.'+"\n\n"
      , content:  containerErrors
      , ouiBtn:   {name: 'Modifier…', onclick: this.openData.bind(this)}
      , nonBtn:   {name: 'Renoncer'}
    }
    new ConfirmDialog(data).show()
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



class ServStep {

  // Pour définir la valeur finale et passer à l'étape suivante
  setValue(value) {
    // console.log("value finale = ", value)
    message(`Valeur pour étape '${this.id} = ${typeof value == 'object' ? JSON.stringify(value) : value}`)
    this.value = value
    this.callback()
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
      console.info("La condition est satisfaite, j'exécute l'étape.")
    } else {
      console.info("Étape inconditionnelle")
    }

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

  // Copie d'un fichier
  execCopyFile(retour){
    if (retour) {
      if (retour.error) raise(retour.error)
      else this.setValue(true)
    } else {
      const src = this.expandPath(this.evaluateProp('source'))
      const dst = this.expandPath(this.evaluateProp('dest'))
      console.log("source et dest", {src, dst})
      server.send({action:'copy-file', source: src, dest: dst}, this.execCopyFile.bind(this))
    }
  }

  // Etape d'affectation d'une valeur au projet
  execSetProjectData(retour){
    if (retour) {
      if (retour.error) raise(retour.error) // Ne peut pas encore passer par là
      this.setValue(true)
    } else {
      const value = this.evaluateProp('value')
      this.projet.set(this.project_key, value, this.execSetProjectData.bind(this))
      // On met la valeur dans l'étape de projet
      console.info("L'étape %s doit prendre la valeur %s", this.project_key, value)
      this.scriptService.setValue(this.project_key, value)
    }
  }

  // Pour récupérer une valeur projet
  execGetProjectData(){
    historize('-> execGetProjectData')
    this.setValue(this.projet.get(this.id) || null) // la clé dans les extradata du projet doit être l'id
  }

  /**
   * Fonction qui se contente de fixer la valeur d'une étape précédente
   * mais qui servira plus tard.
   */
  execSet(){
    var finalValue
    if (this.var_value.match(/\$\{.*\}/)) {
      finalValue = this.evaluateProp('var_value')
    } else {
      finalValue = this.var_value
    }
    this.scriptService.setValue(this.var_step, finalValue)
  }

  execString(retour){
    console.log("retour :", retour)
    if (retour) {
      if (this.required && retour == ':none:') {
        //=> une erreur
      }
      this.setValue(retour)
    } else {
      const ddata = {
          title: this.title
        , message: this.q
        , default: this.default || ""
        , ouiBtn: {name:'OK', onclick: this.execString.bind(this)}
        , nonBtn: {name:'Renoncer', onclick: this.execString.bind(this, ':none:')}
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
        , nonBtn: {name:'Abandonner', onclick:this.execText.bind(this, ':none:')}
      }
      new TextareaDialog(ddata).show()
    }
  }

  execCreateFolder(){
    const path = this.expandPath(this.evaluateProp('path'))
    server.send({action: 'create-folder', data: path}, this.callback.bind(this))
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
        , nonBtn: {name:'Renoncer', onclick: this.execPhone.bind(this, ':none:')}
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
        if (retour.error) raise(retour.error)
        this.values = retour.data
      }
      if ( 'string' == typeof this.values ) {
        // this.values est un string => c'est un fichier contenant les données ou les renvoyant
        this.getFileValues(this.values, this.execSelect.bind(this))
      } else if ( this.selectValuesAreValid() ) {
        // <= This.values validées et mises en forme
        // => On peut procéder au choix
        new SelectDialog(this.selectDialogData()).show()
      }
    } catch(err) {
      if (err.params) {
        this.errors.push(getErr(err.message, err.params))
      } else {
        this.errors.push(err.message)
      }
      this.callback()
    }
  }

  /**
   * Méthode complexe permettant d'enregistrer une valeur dans un fichier
   * this.prefix : si défini
   * this.values : les données à enregistrer, à reconstituer
   */
  execSaveData(retour){
    if (retour) {
      if (retour.error) { this.errors.push(retour.error) } 
      this.setValue(!retour.error)
    } else {
      if (this.prefix) {
        const obj = {}
        this.values.forEach(id => {
          Object.assign(obj, { [id]: this.scriptService.getValue(`${this.prefix}-${id}`) })
        })
        console.info("Objet à enregistrer dans %s", this.path, obj)
        const path = this.expandPath(this.path);
        server.send({action:'save-in-file', path, obj, no_raise: true}, this.execSaveData.bind(this))
      }
    }
  }

  // Appelé avec le résultat du choix
  // On le met dans le this.value de cette étape
  /**
   * TODO: Il faudrait un garde-fou quand la valeur '--other--' : les
   * étapes suivantes doivent comporter if: ${<this id>} = '--other--'
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
            this.key_values ?? raise('scserv-select-with-object-requires-key-values', [this.id, this.aideByType])
            this.title_values ?? raise('scserv-select-with-object-requires-title-values', [this.id, this.aideByType])
            keyAndTitleChecked = true
          }
          value[this.key_values]    ?? raise('scserv-select-with-object-unknown-key', [this.id, JSON.stringify(value), this.key_values, this.aideByType])
          value[this.title_values]  ?? raise('scserv-select-with-object-unknown-title', [this.id, JSON.stringify(value), this.title_values, this.aideByType])
          return [value[this.key_values], value[this.title_values]]
        } else if (Array.isArray(value) && value.length == 2) {
          return value
        } else {
          raise('scserv-param-bad-type', ['values', '[value, title]', typeof value])
        }
      })
    } else {
      raise('scserv-param-bad-type', ['values', 'array of object', typeof this.values])
    }
    return true
  }
  
  selectDialogData(){
    const data ={
        title: this.title
      , q: this.q
      , width: '620px'
      , values: this.values
      , ouiBtn: {name: 'Choisir', onclick: this.onChooseSelect.bind(this)}
      , nonBtn: {name: 'Renoncer', onclick: this.onChooseSelect.bind(this, null)}
    }
    if (this.create === true) {
      Object.assign(data, {
        midBtn: {name: 'Nouveau…', onclick: this.onChooseSelect.bind(this, '--other--')}
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
      callback({error: getErr('scserv-on-get-file-values', [retour.error, path, aide('script-service-file-values')])})
    } else {
      callback(retour)
    }
  }


  constructor(scriptService, data){
    this.scriptService = scriptService
    this.projet = this.scriptService.projet
    this.data = data
    for (var prop of Object.getOwnPropertyNames(data)) {
      this[prop] = data[prop]

      console.log("this[%s] = %s", prop, this[prop])
    }
    this.isConditional = this.if
  }

  evaluateProp(prop){
    if (this.getAbsoluteData(prop).evaluate) {
      const val = this[prop].replace(/\$\{(.*)\}/g, (match, stepId) => {return this.scriptService.getValue(stepId)})
      console.log("Valeur transformée de '%s'/ initial: %s, nouvelle: %s", prop, this[prop], val)
      return val
    } else {
      return this.prop
    }
  }
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
      case '>':
        return !(expression > expected)
      case '<':
        return !(expression < expected)
      default:
        raise('scserv-unknown-evaluator', [this.id, evaluator, this.aideByType])
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
      errors.push(getErr(err.message, err.params))
    }
    return errors
  }


  id_is_required(){ this.id ?? raise('scserv-id-required', aide('scripts-services')) }
  id_is_valid() { this.id.replace(/[0-9a-z_\-]/gi, '') == '' || raise('scserv-id-invalid', [this.id, aide('script-service-valid-id')]) }
  type_is_required() { this.type ?? raise('scserv-type-required', [this.id, aide('scripts-services')]) }
  type_is_known() { SCRIPT_SERVICES_KNOWN_TYPES[this.type] || raise('scserv-step-type-unknowned', [this.type, aide('script-service-types-valides')]) }
  has_all_required_params() {
    this.required_params = {}
    for (var kparam in this.paramsSpecs){
      // Condition : le paramètre doit être défini
      if (! this.paramsSpecs[kparam].required === true) return
      Object.assign(this.required_params, {[kparam]: true})
      console.log("this.data[%s] = ", kparam, this.data[kparam])
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
      paramSpec || raise( 'scserv-unknown-param', [kparam, this.type, this.aideByType])
      // --- On va s'arrêter là pour la pré-validation ---
      return true

      // // Test du type de la valeur du paramètre (et définition si c'est un fichier)
      // if (Array.isArray(paramSpec.type)) {
      //   // La valeur doit être un de ces types
      //   for( var i = 0; i < paramSpec.type.length; ++i) {

      //   }
      //   this.preCheckParamTypeAgainst(kparam, dataParam, mainType, altType, this.aideByType)
      // } else {
      //   this.checkParamTypeAgainst(kparam, dataParam, paramSpec.type, this.aideByType)
      // }
    }

  }
} // ServStep
