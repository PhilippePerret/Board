/**
 * Implémentation des outils du panneau "Outils" (déclarés dans
 * ToolsData.js). Premier outil : position + taille de la fenêtre de
 * premier plan d'une application choisie parmi les applications ouvertes,
 * copiées dans le presse-papier (backend/scripts/GetAppWindowBounds.scpt).
 */
class Tools {

  /**
   * Programmation d'un alerte
   * 
   * 2 dialogs vont s'enchainer et l'on reviendra à la fin à 
   * celui-là.
   *    - demande de la date et l'heure de l'alerte
   *    - demande du message de l'alerte
   *    - retour avec les deux informations.
   */
  static toolScheduleAlert(dataAlert){
    console.log("Je dois apprendre à jouer l'outil Schedule alerte")
    console.log("Data outils", TOOLS_DATA['alerte'])
  }
  static ____toolScheduleAlert(dataAlert, message){
    if (dataAlert) {
      if (message) {
        
      }
      dataAlert.message = message
      console.log("composer l'alerte avec : ", dataAlert)
    } else {
      var dataAlert = {
        datetime: null
        , message: null
        , error: null
      }
      
      const data = {
        id: 'scheduled-alert'
        , title: "Programmation d'alerte"
        , q: "Merci d'entrer l'alerte sous la forme : [JJ MM ]H:MM"
        , error: dataAlert.error
        , ouiBtn: {name: 'Programmer', onclick: this.askForMessage.bind(this, dataAlert)}
        , nonBtn: {name: getMsg('Cancel')}
      }
      new TextFieldDialog(data).show()
    }
  }
  static askForMessage(dataAlert, datetime) {
    var error
    if ( datetime = Validator.datetime(datetime, REG_DATETIME_JJ_MM_HH_MM)) {
      console.log("Time", datetime)
        // TODO On la programme
        // TODO Si dans le futur (demain, après) on l'enregistre
        dataAlert.datetime = datetime
    } else {
      dataAlert.error = "Le format est invalide."
      return this.toolScheduleAlert(dataAlert)
    }
    const dataMessage = {
      title: "Programmation d'alerte"
      , q: "Quel message afficher ?"
      , ouiBtn: {name: 'Programmer', onclick: this.toolScheduleAlert.bind(this, dataAlert)}
      , nonBtn: {name: getMsg('Cancel')}
    }
    new TextFieldDialog(dataMessage).show()
  }

  /**
   * @api
   * 
   * Pour obtenir la dimension d'une fenêtre dans l'application 
   * choisie
   */
  static toolGetWindowBounds(retour){
    if (undefined == retour) {
      server.send({action: 'list-running-apps'}, this.toolGetWindowBounds.bind(this))
    } else {
    new SelectDialog({
        title: 'Position et taille de fenêtre'
      , id: 'tools_app_window_bounds'
      , message: 'De quelle application faut-il prendre en compte la fenêtre au premier plan ?' + '<div class="small">Sa taille et sa position seront mises dans le presse-papier</div>'
      , values: retour.data.apps
      , ouiBtn: {name: 'Valider', onclick: this.onAppChosen.bind(this)}
      , nonBtn: {name: 'Annuler'}
    }).show()

    }
  }


  static onAppChosen(appName){
    server.send({action: 'get-app-window-bounds', appName: appName}, this.onWindowBounds.bind(this))
  }

  static onWindowBounds(retour){
    const data = retour.data
    if (data.ok === false) { message(data.error); return }
    message(`Position/taille copiées dans le presse-papier : ${data.x}, ${data.y}, ${data.width}, ${data.height}`)
  }

  // Appelé par un bouton outil qui ne définit pas de :run, peut-être
  // parce que c'est un script-service (il est défini comme un 
  // script-service)
  static onClick(dataTool){
    new Tools(dataTool).run()
  }


  constructor(data){
    this.data = data
    this.type = data.type
  }
  run(){
    console.log("Je joue l'outil", this)
    switch(this.type){
      case 'script_service': return this.execAsScriptService()
    }
  }

  execAsScriptService(){
    const service = new ScriptService(null, null)
    service.run({data: this.data.steps})
  }

}
