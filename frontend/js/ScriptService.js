
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
      if ( this.serviceSeemsValid() /* Premier contrôle rapide */) {
        this.errors = []
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
      , style: 'margin-top:2em;'
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
    switch(this.type){
      case 'select':
        errors.push("Je ne sais pas traiter le type 'select'.")
        break
      case 'string':
        errors.push("Je ne sais pas traiter le type 'string'.")
        break
      case 'create-folder':
        return this.execCreateFolder(callback)
        break
    }
    // Si on arrive ici quand même, il faut jouer l'étape suivante
    callback()
  }



  constructor(scriptService, data){
    this.scriptService = scriptService
    this.data           = data
    this.id             = data.id
    this.type           = data.type
    this.params         = data.params
  }
  get dataType(){ return this._dtype || (this.dtype = SCRIPT_SERVICES_KNOWN_TYPES[this.type] )}
  get aideByType(){ return this._aidtype || (this._aidtype = aide(`script-service-type-${this.type}`) )}
  get paramsSpecs(){return this._pmsvalid || (this._pmsvalid = this.dataType.params)}


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
      this.data[kparam] || raise('scserv-param-required', [kparam, this.type, this.aideType])
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
      paramSpec || raise( 'scserv-unknown-param', [kparam, this.type, this.aideType])
      // --- On va s'arrêter là pour la pré-validation ---
      return true

      // // Test du type de la valeur du paramètre (et définition si c'est un fichier)
      // if (Array.isArray(paramSpec.type)) {
      //   // La valeur doit être un de ces types
      //   for( var i = 0; i < paramSpec.type.length; ++i) {

      //   }
      //   this.preCheckParamTypeAgainst(kparam, dataParam, mainType, altType, this.aideType)
      // } else {
      //   this.checkParamTypeAgainst(kparam, dataParam, paramSpec.type, this.aideType)
      // }
    }

  }

  /**
   * Fonction chargeant les valeurs d'un fichier quelconque.
   * La donnée remontée peut être de tout type, mais en général, 
   * ce sera un <array-of-object> pour pouvoir choisir une
   * valeur
   */
  getFileValues(path, callback, retour) {
    if (undefined == retour) {
      server.send({action:'evaluate-file', path: path}, this.getFileValues.bind(this, path, callback))
    } else if (retour.error) {
      raise('scserv-on-get-file-values', [retour.error, path, aide('script-service-file-values')])
    } else {
      callback(retour.data)
    }
  }

  execCreateFolder(callback){
    const path = this.scriptService.resolvePath(this.data.path)
    server.send({action: 'create-folder', data: path}, () => callback())
  }


} // ServStep
