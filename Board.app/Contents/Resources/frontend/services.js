class Services {

  static getInfosFinderWindow(){
    server.send({
      action:'run-osascript', 
      'script-name': "finder-front-window-infos"
      }, 
      this.setInfosFinderWindow.bind(this)
    )
  }

  static setInfosFinderWindow(retour){
    feedback(retour.data)
  }

}