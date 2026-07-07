class ServiceExecuter {

  constructor(service){
    this.service  = service
    this.name     = service.name
    this.params   = service.params
    this.method   = 'exec' + kebabToPascalCase(this.id)
  }
  
  // Exécution du service
  exec(){
    this[method]()
  }

  execOpenFinderWindow(){
    message("Je dois exécuter " + this.name)
    server.send({action: `service-${this.id}`, params: params})
  }
}