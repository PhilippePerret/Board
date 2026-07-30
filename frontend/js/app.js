window.onload = function(ev){
  historize("Application chargée.")
  D.start()
  App.init()
}

class App {

  static NAME = /* tag::app-name[] */"Tableau de bord"/* end::app-name[] */

  // this.data = les données de appdata.json

  // Le panneau courant
  static get currentPanel()  { return this._currentPanel }
  static set currentPanel(p) { this._currentPanel = p }
  static closeCurrentPanel(){ D.on && D.trace('App::closeCurrentPanel')
    if (this.currentPanel) {
      this.currentPanel.close()
      this.currentPanel = null
    }
  }

  static init(retour){ D.on && D.trace(retour, 'App::')
    if (undefined == retour) {
      return server.send({action: 'load-all'}, this.init.bind(this))
    } else {
      this.observe()
      Service.init()
      this.data = retour.data.appData
      Project.initAllProjects(retour.data.projectsData)
    }

    retarde(this.editConfigData.bind(this), 3) // essai direct
  }

  static editConfigData(ev) {
    stopEvent(ev)
    // ON ajoute les valeurs actuelles
    const props = APP_DATA.map(prop => {
      return Object.assign(prop, {value: this.getData(prop.id)})
    })
    new ConfigDialog({
        title: 'Configuration de l’application'
      , props: props
      , ouiBtn: {name: getMsg('Save'), onclick: this.onSaveConfig.bind(this)}
      , nonBtn: {name: getMsg('Cancel')}
    }).show()
  }
  static onSaveConfig(modos /* array de {id, value} */){
    console.log("-> onSaveConfig pour enregistrement de la config", modos)
    if (modos.length ) {
      modos.forEach( modo => this.setData(modo.id, modo.value) )
      this.saveData()
    }
  }


  static openToolsPanel(ev) {
    stopEvent(ev)
    this.toolsPanel.toggle()
  }

  static observe(){
    listen(DGet('#app-name')    , 'click' , this.editConfigData.bind(this))
    listen(DGet('#tools-button'), 'click' , this.openToolsPanel.bind(this))
    listen(DGet('#debug-button'), 'click' , D.toggle.bind(D))
    listen(DGet('#help-link')   , 'click' , (ev) => {stopEvent(ev); Aide.open()})
  }

  static get appDataPanel(){ return this._appdatapan || (this._appdatapan = new AppDataPanel()) }
  static get toolsPanel(){ return this._toolspan || (this._toolspan = new ToolsPanel()) }

  static getData(key){
    return this.data[key]
  }
  static setData(key, value){
    Object.assign(this.data, {[key]: value})
    this.apply(key, value)
  }

  /**
   * Certains valeurs de configuration doivent s'appliquer tout de suite
   */
  static apply(key, value) {
    switch(key){
      case 'une prop à appliquer': break
      case 'remember-last-project': 
        if (value == 'true') {
          if (Project.current) { this.setData('last-project', Project.current.id) }
        } else {
          this.setData('last-project', "")
        }
        break
      default:
        // rien à faire avec +key+
    }
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