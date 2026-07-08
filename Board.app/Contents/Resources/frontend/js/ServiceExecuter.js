class ServiceExecuter {

  constructor(service, callback){
    this.service  = service
    this.id       = service.id
    this.name     = service.name
    this.params   = service.params
    this.scType   = service.scType ?? '.scpt'
    this.script   = kebabToPascalCase(this.id) + this.scType
    this.callback = callback ?? null
  }
  
  // Exécution du service
  exec(callback){
    if (typeof callback == 'function') this.callback = callback
    const SDATA = SERVICES_DATA.filter(d => d.id == this.id)[0]
    // S'il existe des paramètres dynamiques, il faut les traiters
    if (SDATA.dynParams) {
      this.dynParams = SDATA.dynParams.reverse()
      this.treateDynParams()
      return
    } else {
      this.execReally()
    }
  }

  execReally(){
    // message("Je dois apprendre à exécuter " + this.name)
    // console.log("Je dois exécuter ", this.service)
    // Note : pour le moment, ça ne joue que des osascript
    server.send({action: `exec-service`, script: this.script, params: this.params}, this.afterRunService.bind(this))
  }

  // Appelée après avoir exécuté le service
  afterRunService(retour){
    console.log("retour du run de service", retour)
    message(retour.message + ` <span class="tiny">(service ${this.id})</span>` || "Service " + this.name + " joué avec succès.")
    if (typeof this.callback == 'finder') { setTimeout(this.callback, 2000) }
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



}