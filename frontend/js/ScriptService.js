
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
    this.errors     = []
  }

  /** -- Point d'entrée secondaire --
   *
   * @param callback  Utilisé seulement par les outils qui utilisent
   *                  les scripts-service
   *                  La fonction est appelée en fin de run avec le service
   *                  en premier argument.
   */
  run(retour, callback){
    console.log("-> ScriptService.run(retour, callback=)", retour, callback)
    this.callback = callback
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
      // console.info("Nombre d'étapes : %i", this.steps.length)
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
      if (this.currentStep.aborted) return message(getMsg('script-service-canceled'))
    }
    const step = this.steps.shift()
    // console.log("step = ", step)
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
        console.log("this.getValue('conclusion')", this.getValue('conclusion'))
        const messageFin = this.getValue('conclusion') || getMsg('scserv-end')
        message(messageFin)
        new OKDialog({
          title: getMsg('Scripts-services'),
          message: messageFin
        }).show()
        // Si un callback est défini (cf. les outils)
        if (this.callback) this.callback(this)
        return
      } else {
        message(getMsg('script-service-canceled'))
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
    } else if (retour.error) {
      error(retour.error)
    } else {
      message(getMsg('file-opened', this.scriptPath.split('/').pop()))
    }
  }

  // Affichage des erreurs rencontrées
  displayErrors(errors){
    const data = {
        title:    getErr('Script-service-definition-error')
      , width:    '960px'
      , message:  getErr('Script-service-file-contains-errors')+"\n\n"
      , errors:   errors
      , ouiBtn:   {name: getMsg('modify-it'), onclick: this.openData.bind(this)}
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
      // console.info(`Valeur pour étape '${this.id} = ${(typeof value == 'object') ? JSON.stringify(value) : value}`)
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
      this.scriptService.setValue(this.set, this.value)
    }
  }

  // Dans l'exécution des étapes, il ne faut pas utiliser raise mais retourner
  // cette fonction.
  addFatalError(msg, params){
    this.setValue(':abort:')
    this.errors || (this.errors = []);
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
   * L'obtention de la valeur elle-même, selon le type de l'étape,
   * est entièrement déléguée à Prompter (cf. Prompter.js) : ServStep
   * ne connaît jamais le détail de cette obtention, seulement le
   * résultat (cf. onPrompted).
   *
   * @param errors Array Container pour les erreurs
   */
  exec(errors, callback){
    this.callback = callback
    this.errors = errors
    // Pour une étape conditionnelle
    if (this.isConditional && this.conditionNotSatisfied()){
      // console.info("La condition n'est pas satisfaite, je passe à la suite.")
      return callback()
    } else if (this.isConditional) {
      // console.info(`La condition est satisfaite, j'exécute l'étape ${this.id}.`)
    } else {
      // console.info("Étape inconditionnelle")
    }

    // Remplacements communs dans les paramètres
    Object.keys(this.data).forEach( param => {if (this[param]) { this[param] = this.evaluateProp(param)}})
    if (this.path) this.path = this.expandPath(this.path)
    if (this.value) this.ifSet() // pourra être modifié

    Prompter.prompt(this.promptSpec(), this.onPrompted.bind(this))
  }

  // Données transmises à Prompter pour obtenir la valeur de cette étape :
  // uniquement les champs que CETTE étape déclare réellement (this.data,
  // valeurs déjà évaluées), plus les quelques champs calculés.
  promptSpec(){
    const spec = {}
    Object.keys(this.data).forEach(key => { spec[key] = this[key] })
    return Object.assign(spec, {
        type: this.type
      , id: this.id
      , projet: this.projet
      , scriptService: this.scriptService
      , value: (this.type == 'translate' && this.step) ? this.scriptService.getValue(this.step) : this.value
    })
  }

  // Réception de la valeur obtenue par Prompter pour cette étape
  onPrompted(value, error){
    if (error) return this.addFatalError(error)
    if (value === null) return this.setValue(':abort:')
    // Types 'set' et 'translate' : quand this.step est défini, la valeur
    // est écrite dans une AUTRE étape, pas dans celle-ci.
    if (this.step && (this.type == 'set' || this.type == 'translate')) {
      this.scriptService.setValue(this.step, value)
      if (this.type == 'set') this.setValue(true)
      else this.callback()
      return
    }
    this.setValue(value)
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
  type_is_known() { SCRIPT_SERVICES_KNOWN_TYPES[this.type] || raise('scserv-step-type-unknowned', [this.id, this.type, aide('script-service-types-valides')]) }
  has_all_required_params() {
    this.required_params = {}
    for (var kparam in this.paramsSpecs){
      // Condition : le paramètre doit être défini
      if (! this.paramsSpecs[kparam].required === true) return
      Object.assign(this.required_params, {[kparam]: true})
      this[kparam] || raise('scserv-param-required', [this.id, kparam, this.type, this.aideByType])
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
      paramSpec || raise('scserv-unknown-param', [this.id, kparam, this.type, this.aideByType])
      // --- On s'arrête là pour la pré-validation ---
    }
    return true
  }
} // ServStep
ServStep.init()
