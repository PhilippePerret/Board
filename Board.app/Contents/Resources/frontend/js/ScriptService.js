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
      server.send({action: 'load-yaml-file', path: this.scriptPath}, this.run.bind(this))
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
    if (errors.length > 0) {
      // TODO Il faudra un panneau pour afficher ça, avec de vraies explications.
      error(`Script-service invalide (${this.scriptPath}) :\n${errors.join('\n')}`)
      return false
    }
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

}

class ServStep {

  static KNOWN_TYPES = ['create-folder']

  constructor(scriptService, data){
    this.scriptService = scriptService
    this.data           = data
    this.id             = data.id ?? null
    this.type           = data.type
  }

  // Retourne la liste des erreurs trouvées pour cette étape (vide = ok)
  validate(){
    const errors = []
    if (!this.type) {
      errors.push(`étape sans 'type' : ${JSON.stringify(this.data)}`)
      return errors
    }
    if (!this.constructor.KNOWN_TYPES.includes(this.type)) {
      errors.push(`type d’étape inconnu : '${this.type}'`)
      return errors
    }
    switch(this.type){
      case 'create-folder':
        if (!this.data.path) errors.push(`étape 'create-folder' sans 'path'`)
        break
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

}
