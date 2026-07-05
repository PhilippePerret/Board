class Services {

  getInfosFinderWindow(){
    server.send({
      action:'run-osascript', 
      'script-name': "finder-front-window-infos"
      }, onRetourEssai
    )
  }

}