class ServiceExecuter {

  constructor(service, callback){
    this.service  = service
    this.id       = service.id
    this.name     = service.name
    this.front    = service.front ?? null
    this.params   = service.params
    this.script   = service.script
    this.callback = callback ?? null
  }
  
  // Exécution du service
  exec(callback){
    if (typeof callback == 'function') this.callback = callback
    const SDATA = (ALL_SERVICES_DATA).filter(d => d.id == this.id)[0]
    // S'il existe des paramètres dynamiques, il faut les traiters
    if (SDATA.dynParams) {
      this.dynParams = SDATA.dynParams.reverse()
      this.treateDynParams()
      return
    } else {
      this.execReally()
    }
  }

  /**
   * Exécution d'un service custom
   */
  execReally(){
    this.finalyExec(this.params)
  }

  /**
   * Exécution d'un service commun
   * 
   * La principale différence réside dans le fait que pour un service personnalisé,
   * les paramètres se trouvent dans son .params propre. Alors que dans le service
   * commun, c'est dans le projet.common_services_data que ça se trouve.
   */
  execOnProject(projet){
    if (this.front) {
      // Pas un script backend, mais un traitement frontend
      // Typiquement : le minuteur
      const flatParamsValues = this.flattenParamsValues(projet.common_services_data[this.id])
      this.front(projet, flatParamsValues)
    } else {
      // Un script backend
      this.finalyExec(projet.common_services_data[this.id])
    }
  }

  finalyExec(paramsValues){
    const flatParamsValues = this.flattenParamsValues(paramsValues)
    console.log("finalyExec (script '%s') avec les paramètres : ", this.script, flatParamsValues)
    server.send({action: `exec-service`, script: this.script, params: flatParamsValues}, this.afterRunService.bind(this))
  }

  // Appelée après avoir exécuté le service
  afterRunService(retour){
    console.log("retour du run de service", retour)
    if (retour.ok === false) { message(retour.error); return }
    message(retour.message + ` Service “${this.name}” joué avec succès <span class="tiny">(service ${this.id})</span>.`)
    console.log("ServiceExecuter # afterRunService termine normalement.")
    if (this.service.transient /* common service joué depuis panneau */) {
      Service.remove(this.service.uuid)
      historize("- Service supprimé du cache")
    }
    typeof this.callback == 'function' && this.callback() 
  }

  /**
   * Maintenant que les valeurs sont conservées groupées par 
   * paramètres il faut "applatir" la liste avant de l'envoyer.
   * 
   * régression : pour que les anciens projets passent, on doit
   * checker que les éléments sont bien des arrays.
   */
  flattenParamsValues(paramsValues){
    var params = []
    // console.log("paramsValues au départ : ", JSON.parse(JSON.stringify(paramsValues)))
    paramsValues.forEach(paramValues => {
      if (Array.isArray(paramValues)) {
        // console.log("Une liste : ", paramValues)
        params = [...params, ...paramValues]
      } else {
        // console.log("Pas une liste : ", paramValues)
        params.push(paramValues) // ancienne version
      }
    })
    // console.log("params À LA FIN : ", JSON.parse(JSON.stringify(params)))
    return this.escapeParamsIfRequired(params)
  }

  treateDynParams(){
    const param = this.dynParams.pop()
    if (param){
      this.defineByType(param)
    } else {
      this.execReally()
    }
  }

  onDefineDynParam(values){
    console.log("[onDefineDynParam] arguments", arguments)
    console.log("[onDefineDynParam] values", values)
    this.params = [...this.params, ...values]
    this.treateDynParams()
  }

  defineByType(param){
    switch(param.type) {
      case 'select':
        new SelectDialog({
            title: 'Paramètres du service'
          , id: param.id
          , message: param.q
          , idValues: [param.id]
          , values: param.values
          , ouiBtn: {name: 'OK', onclick: this.onDefineDynParam.bind(this)}
        }).show()
        break;
      default: 
        console.error('Type de paramètre dynamique inconnu :', param.type, param)
        return null
    }
  }

  /**
   * Pour tous les services utilisant le script ExecCommand.sh, il faut
   * échapper les espaces pour que les arguments soient bien pris en 
   * compte par la commande.
   */
  escapeParamsIfRequired(params){
    if (this.script != 'ExecCommand.sh') return params
    console.log("params non escapés : ", JSON.stringify(params))
    params = params.map(param => {
      if ('string' == typeof param) {
        param = param.replace(' ', '\ ')
      } 
      return param
    })
    console.log("params escapés : ", params)
    return params
  }



}