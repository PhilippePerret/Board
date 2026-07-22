class ScriptService {

  static run(projet, data){
    const scriptPath = data[0]
    const service = new ScriptService(projet, scriptPath)
    service.run()
  }

  constructor(projet, scriptPath){
    this.projet     = projet
    this.scriptPath = scriptPath
    this.values     = {}
  }

  run(retour){
    if (undefined == retour) {
      server.send({action: 'load-yaml-file', path: this.scriptPath, no_raise: true}, this.run.bind(this))
    } else if (retour.error) {
      this.displayErrors([retour.error])
    } else {
      if (!Array.isArray(retour.data)) {
        return error(`Script-service invalide (${this.scriptPath}) : ce n’est pas une liste d’étapes.`)
      } else {
        this.execSteps(retour.data)
      }
    }
  }

  execSteps(serviceData){
    this.steps = serviceData.map(data => new ServStep(this, data))
    if (this.serviceIsValid()) { this.execNextStep() }
  }

  // Pré-analyse : chaque étape est vérifiée AVANT de commencer à en exécuter
  // une seule (un type inconnu ou une étape mal formée doit être vu tout de
  // suite, pas en cours de route).
  serviceIsValid(){
    const errors = this.steps.flatMap(step => step.validate())
    if (errors.length > 0) { return this.displayErrors(errors) }
    return true
  }

  /************************************************************/
  /*              BOUCLE SUR CHAQUE ÉTAPE                     */
  /************************************************************/
  execNextStep(){
    const step = this.steps.shift()
    if ( step ) { 
      step.exec(this.execNextStep.bind(this))
    } else {
      message('Script-service terminé.'); return 
    }
  }

  resolvePath(relativePath){
    return `${this.projet.path}/${relativePath.replace(/^\.\//, '')}`
  }


  /******************************************************************/
  /*                    USEFULL METHODS                             */
  /******************************************************************/

  // Pour éditer le fichier de données
  openData(retour){
    if (undefined == retour) {
      server.send({action: 'open-file-yaml', path: this.scriptPath}, this.openData.bind(this))
    } else {
      message(getMsg('file-opened', this.scriptPath.split('/').pop()))
    }
  }

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
    this.id             = data.id ?? null
    this.type           = data.type
    this.params         = data.params
  }

  // Retourne la liste des erreurs trouvées pour cette étape (vide = ok)
  validate(){
    const errors = []
    try {
      this.type ?? raise(`Le service '${this.id}' doit toujours avoir un type (${aide('scripts-services')}).`)
      this.id ?? raise(`Un script-service doit absolument avoir un identifiant (${aide('scripts-services')}).`)
      this.id.replace(/[0-9a-z]/gi, '') == '' || raise(`L’identifiant ${this.id} n'est pas valide (${aide('script-service-valid-id')})`)
      const dataType = SCRIPT_SERVICE_KNOWN_TYPES.includes(this.type) || raise(`type d’étape inconnu : ${this.type} ${aide('script-service-types-valides')}`)
      const keyAide = `script-service-type-${this.type}`
      const aideType = ` (${aide(keyAide)})`
      // Y a-t-il tous les paramètres requis
      const ValidifierParams = SCRIPT_SERVICES_KNOWN_TYPES[this.type].params
      for (var kparam in ValidifierParams){
        if (! ValidifierParams[kparam].required === true) return
        this.params[kparam] || raise(`Le paramètre '${kparam}' est requis, pour le type '${this.type}'${aideType}`)
      }
      // Les paramètres définis sont-ils valides
      for (kparam in this.params) {
        const dataParam = this.params[kparam]
        const validifier = ValidifierParams[kparam]
        validifier || raise(`Le paramètre '${kparam}' est inconnu du service de type '${this.type}'${aideType}`)
        typeof dataParam == validifier.type || raise(`Le paramètre '${kparam}' n'a pas le bon type. Attendu: ${validifier.type}, actuel: ${typeof dataParam}.${aideType}`)
      }
    } catch(err) {
      errors.push(err)
    }
    return errors
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
