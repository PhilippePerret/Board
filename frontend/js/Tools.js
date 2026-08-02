/**
 * Implémentation des outils du panneau "Outils" (déclarés dans
 * ToolsData.js). Premier outil : position + taille de la fenêtre de
 * premier plan d'une application choisie parmi les applications ouvertes,
 * copiées dans le presse-papier (backend/scripts/GetAppWindowBounds.scpt).
 */
class Tools {

  /**
   * @api
   * 
   * Pour obtenir la dimension d'une fenêtre dans l'application 
   * choisie
   * 
   * TODO Utiliser plutôt le Prompter
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
    service.run({data: this.data.steps}, this.afterExecAsScriptService.bind(this))
  }

  // À la fin de l'outil joué comme script service
  /**
   * Pour le moment, on n'a rien besoin de faire, si le tool est bien
   * défini. Mais on pourrait peut-être plus tard, faire des trucs.
   */
  afterExecAsScriptService(service){
    // console.info("service", service)
  }

}
