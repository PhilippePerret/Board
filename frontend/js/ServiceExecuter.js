class ServiceExecuter {

  constructor(service){
    this.service  = service
    this.id       = service.id
    this.name     = service.name
    this.params   = service.params
    this.scType   = service.scType ?? '.scpt'
    this.script   = kebabToPascalCase(this.id) + this.scType
  }
  
  // Exécution du service
  exec(){
    // message("Je dois apprendre à exécuter " + this.name)
    // console.log("Je dois exécuter ", this.service)
    // Note : pour le moment, ça ne joue que des osascript
    server.send({action: `exec-service`, script: this.script, params: this.params}, this.afterRunService.bind(this))
  }


  // Appelée après avoir exécuté le service
  afterRunService(retour){
    console.log("retour du run de service", retour)
    message("Service " + this.name + " joué avec succès.")
  }
}