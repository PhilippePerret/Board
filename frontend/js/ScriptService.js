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

  run(){
    console.error("Je dois apprendre à jouer un script-service.")
    // TODO : On fait la liste des étapes (instances ServStep), en testant 
    // leur validité.
  }

}

class ServStep {

  constructor(scriptService, data){
    this.scriptService = scriptService
    this.data           = data
    this.id             = data.id ?? null
    this.type           = data.type
  }

  exec(){

  }

}
