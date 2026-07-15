window.onload = function(ev){
  historize("Application chargée.")
  App.init()
}

class App {

  // this.data = les données de appdata.json

  static init(retour){
    historize("-> App#init")
    this.observe()
    Service.init()
    if (undefined == retour) {
      server.send({action: 'load-all'}, this.init.bind(this))
    } else {
      this.data = retour.data.appData
      Project.initAllProjects(retour.data.projectsData)
    }
  }

  static observe(){
    listen(DGet('#app-name'), 'click', () => AppDataPanel.open())
  }

  static getData(key){
    return this.data[key]
  }

  static get saveData(){ return this._savedata || (this._savedata = debounce(this.execSaveData.bind(this), 1000))}
  static execSaveData(){
    // historize("-> execSaveData")
    server.send({action: 'save-app-data', data: this.data}, this.afterSaveData.bind(this))
  }
  static afterSaveData(retour){
    message(retour.message)
  }

  // Pour actualiser une clé (et une seule) de appData.json 
  static updateData(keyInAppData, save = true){
    const method = `update${kebabToPascalCase(keyInAppData)}`
    this.data[keyInAppData] = this[method]()
    if (save) this.saveData()
  }
  static updateProjectsIn() {
    return Project.getProjectsOrder()
  }
}