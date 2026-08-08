window.onload = function(ev){
  historize("Application chargée.")
  D.start()
  App.init()
}

class App {

  static NAME = /* tag::app-name[] */"Super Board"/* end::app-name[] */
  // Changer aussi dans update.command pour Safari

  /**
   * @api
   * 
   * Point d'entrée
   */
  static init(retour){ D.on && D.trace(retour, 'App::')
    if (undefined == retour) {
      return server.send({action: 'load-all'}, this.init.bind(this))
    } else {
      this.setTitle()
      Spinner.start()
      this.data = retour.data.appData
      this.observe()
      Service.init()
      Reminder.init()
      Project.initAllProjects(retour.data.projectsData)
      // Réveil si nécessaire des rappels
      this.awakeReminders()
    }
  }

  static setTitle() {
    DGet('head title').textContent = App.NAME
    DGet('div#app-name').textContent = App.NAME
  }

  /**
   * @api
   * 
   * Enregistre le projet sélectionné au besoin
   */
  static rememberLastProjectIfRequired(projet){
    console.log("this.getData('remember-last-project')", this.getData('remember-last-project'), typeof this.getData('remember-last-project'))
    if (this.getData('remember-last-project') === true){
      this.setData('last-project', projet.id, true)
    }
  }
  static selectLastProjectIfRequired(){
    var lastProjectId, lastProject
    if (this.getData('remember-last-project') === true){
      if (lastProjectId = this.getData('last-project')) {
        if (lastProject = Project.get(lastProjectId)) {
          if (lastProject.collapsed) {
            this.setData('last-project', '', true)
          } else {
            Project.onSelect(lastProject)
          }
        } else {
          this.setData('last-project', '', true)
        }
      }
    }
  }

  // Le panneau courant
  static get currentPanel()  { return this._currentPanel }
  static set currentPanel(p) { this._currentPanel = p }
  static closeCurrentPanel(){ D.on && D.trace('App::closeCurrentPanel')
    if (this.currentPanel) {
      this.currentPanel.close()
      this.currentPanel = null
    }
  }

  static editConfigData(ev) {
    stopEvent(ev)
    // ON ajoute les valeurs actuelles
    const props = APP_DATA.map(prop => {
      return Object.assign(prop, {value: this.getData(prop.id)})
    })
    new ConfigDialog({
        title: getMsg('app-config')
      , id: 'app-config'
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

  static get toolsPanel(){ return this._toolspan || (this._toolspan = new ToolsPanel()) }

  static getData(key){
    return this.data[key]
  }

  static setData(key, value, saveIt = false){
    if (!this.data) return // rien à faire là
    Object.assign(this.data, {[key]: value})
    this.apply(key, value)
    saveIt && this.saveData()
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


  /**
   * Si un rappel concerne un autre jour, on l'enristre dans 
   * les données de l'application pour le reprogrammer le 
   * bon jour.
   */
  static saveReminders(){
    const reminders = Reminder.getRemindersToSave()
    console.log("Reminders à sauver", reminders)
    this.setData('reminders', reminders, true)
  }

  static awakeReminders(){
    console.info("Réveil des rappels")
    this.reminders = this.getData('reminders') ?? []
    this.reminders.forEach(dreminder => {
      dreminder = Object.assign(dreminder, {time: new Date(dreminder.time)})
      Reminder.register(dreminder)
    })
    const hadReminders = this.reminders.length > 0
    this.reminders = [] // Les futurs seront à nouveau enregistrés
    hadReminders && this.setData('reminders', this.reminders, true)
  }
}