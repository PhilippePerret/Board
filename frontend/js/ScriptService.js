const UNIV_KEYS = {id: true, type: true, name: true}

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
      this.steps = retour.data.map(stepData => new ServStep(this, stepData))
      if ( this.serviceIsValid() ) { 
        this.execNextStep() 
      } else {

      }
    }
  }

  /**
   * Analyse de la validité du script-service (ses data)
   */
  serviceIsValid(){
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
    const step = this.steps.shift()
    if ( step ) { 
      step.exec(this.execNextStep.bind(this))
    } else {
      message(getMsg('scserv-end')); return 
    }
  }

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
    const containerErrors = DCreate('DIV', {
      class: 'error break-all small', 
      text: errors.map(error => `<div class="error">${error}</div>`).join('')
    })
    const data = {
        title: 'Erreur de définition de Script-service'
      , message: 'Le fichier de définition du script-service contient des erreurs.'
      , content: containerErrors
      , ouiBtn: {name: 'Modifier…', onclick: this.openData.bind(this)}
      , nonBtn: {name: 'Renoncer'}
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


  constructor(scriptService, data){
    this.scriptService = scriptService
    this.data           = data
    this.id             = data.id
    this.type           = data.type
    this.params         = data.params
  }

  // Retourne la liste des erreurs trouvées pour cette étape (vide = ok)
  validate(){
    const errors = []
    try {
      this.id ?? raise('scserv-id-required', aide('scripts-services'))
      this.id.replace(/[0-9a-z]/gi, '') == '' || raise('scserv-id-invalid', [this.id, aide('script-service-valid-id')])
      this.type ?? raise('scserv-type-required', [this.id, aide('scripts-services')])
      const dataType = SCRIPT_SERVICES_KNOWN_TYPES[this.type] || raise('scserv-step-type-unknowned', [this.type, aide('script-service-types-valides')])
      const keyAide = `script-service-type-${this.type}`
      const aideType = aide(keyAide)
      // Y a-t-il tous les paramètres requis
      const paramsValidator = SCRIPT_SERVICES_KNOWN_TYPES[this.type].params
      for (var kparam in paramsValidator){
        // Condition : le paramètre doit être défini
        if (! paramsValidator[kparam].required === true) return
        this.data[kparam] || raise('scserv-param-required', [kparam, this.type, aideType])
      }
      // À l'inverse, les paramètres définis sont-ils valides
      for (kparam of Object.getOwnPropertyNames(this.data)) {
        if (UNIV_KEYS[kparam]) continue
        const dataParam = this.data[kparam]
        const validator = paramsValidator[kparam]
        validator || raise( 'scserv-unknown-param', [kparam, this.type, aideType])
        // Test du type de la valeur du paramètre (et définition si c'est un fichier)
        if (Array.isArray(validator.type)) {
          const mainType = validator.type[0] // par exemple 'array-of-object
          const altType  = validator.type[1] // On part du principe qu'il ne peut y avoir qu'un second type… (Hasardeux, quand même)
          this.preCheckParamTypeAgainst(kparam, dataParam, mainType, altType, aideType)
        } else {
          this.checkParamTypeAgainst(kparam, dataParam, validator.type, aideType)
        }
      }
    } catch(err) {
      errors.push(err)
    }
    return errors
  }

  preCheckParamTypeAgainst(kparam, dataParam, mainType, altType, aideType) {
    // Pour le moment, on part du principe (hasardeux) que altType, s'il est défini,
    // est toujours un path
    if (altType == 'path' && typeof dataParam == 'string') {
      // La valeur est un path définissant un fichier : on doit le 
      // charger en l'évaluant pour obtenir une donnée de type mainType
      server.send({action:'evaluate-file', path: dataParam}, this.beforeCheckParamTypeAgainst.bind(this, kparam, mainType, aideType))
    } else {
      this.checkParamTypeAgainst(kparam, dataParam, mainType, aideType)
    }
  }

  // Retour de l'évaluation du fichier contenant les données
  beforeCheckParamTypeAgainst(kparam, mainType, aideType, retour){
    console.log("Retour dans beforeCheckParamTypeAgainst", retour)
    this.checkParamTypeAgainst(kparam, retour.data, mainType, aideType)  
    // On doit mettre les données dans le paramètre de l'étape
    this.data[kparam] = retour.data
  }

  checkParamTypeAgainst(kparam, dataParam, mainType, aideType){
    try {
      let pType
      switch(mainType){
        // Un typeof qui n'existe pas
        case 'array-of-object':
          Array.isArray(dataParam) || raise(typeof dataParam)
          for (var len = dataParam.length, i = 0; i < len; ++i) {
            Object.isObject(dataParam[i]) || raise(typeof dataParam[i])
          }
          break
        default:
          pType = typeof dataParam
      }
      pType == mainType || raise(pType)
    } catch (err) {
      raise('scserv-param-bad-type', [kparam, mainType, getErr(err), aideType])
    }

  }

  exec(callback){
    switch(this.type){
      case 'create-folder':
        return this.execCreateFolder(callback)
    }
  }

  execCreateFolder(callback){
    const path = this.scriptService.resolvePath(this.data.path)
    server.send({action: 'create-folder', data: path}, () => callback())
  }


} // ServStep
