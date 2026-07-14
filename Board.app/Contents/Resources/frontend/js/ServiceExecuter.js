class ServiceExecuter {

  constructor(service, callback){
    this.service  = service
    this.id       = service.id
    this.name     = service.name
    this.front    = service.front ?? null
    this.params   = service.params
    this.script   = service.script
    this.callback = callback ?? null
    this.escapeParamsIfRequired()
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
   * commun, c'est dans le projet.sdata que ça se trouve.
   */
  execOnProject(projet){
    if (this.front) {
      this.front(projet, projet.sdata[this.id])
    } else {
      this.finalyExec(projet.sdata[this.id])
    }
  }

  finalyExec(params){
    console.log("finalyExec (script '%s') avec les paramètres : ", this.script, params)
    server.send({action: `exec-service`, script: this.script, params}, this.afterRunService.bind(this))
  }

  // Appelée après avoir exécuté le service
  afterRunService(retour){
    console.log("retour du run de service", retour)
    message(retour.message + ` <span class="tiny">(service ${this.id})</span>` || "Service " + this.name + " joué avec succès.")
    if (typeof this.callback == 'function') { setTimeout(this.callback, 2000) }
    console.log("ServiceExecuter#afterRunService termine normalement.")
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
  escapeParamsIfRequired(){
    if (this.script != 'ExecCommand.sh') return
    console.log("params non escapés : ", JSON.stringify(this.params))
    this.params = this.params.map(param => {
      if ('string' == typeof param) {
        param = param.replace(' ', '\ ')
      } 
      return param
    })
    console.log("params escapés : ", this.params)
  }



}