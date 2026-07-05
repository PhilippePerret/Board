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
    const pos  = jsonize(retour.data.position)
    const size = jsonize(retour.data.size)
    const view = retour.data.view
    // Mettre dans l'éditeur à copier-coller
    Editor.giveCode(`services:
        - service: set-finder-window
          position: ${pos}
          size: ${size}
          view: "${view}"`)
  }

}