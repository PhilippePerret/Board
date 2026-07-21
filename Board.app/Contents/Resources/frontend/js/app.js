window.onload = function(ev){
  historize("Application chargée.")
  App.init()
}

class App {

  static NAME = /* tag::app-name[] */"Tableau de bord"/* end::app-name[] */

  // this.data = les données de appdata.json

  static init(retour){
    historize("-> App#init")
    if (undefined == retour) {
      return server.send({action: 'load-all'}, this.init.bind(this))
    } else {
      this.observe()
      Service.init()
      this.data = retour.data.appData
      Project.initAllProjects(retour.data.projectsData)
    }
  }

  static observe(){
    listen(DGet('#app-name'), 'click', (ev) => {stopEvent(ev); this.appDataPanel.toggle()})
    listen(DGet('#tools-button'), 'click', (ev) => {stopEvent(ev); this.toolsPanel.toggle()})
    listen(DGet('#help-link'), 'click', (ev) => {stopEvent(ev); window.webkit.messageHandlers.openHelp.postMessage({})})
  }

  static get appDataPanel(){ return this._appdatapan || (this._appdatapan = new AppDataPanel()) }
  static get toolsPanel(){ return this._toolspan || (this._toolspan = new ToolsPanel()) }

  static getData(key){
    return this.data[key]
  }
  static setData(key, value){
    Object.assign(this.data, {[key]: value})
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