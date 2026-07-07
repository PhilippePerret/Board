class ServicesTools {

  static getInfosFinderWindow(){
    server.send({
      action:'run-osascript', 
      'script-name': "getInfoFinderWindow"
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


  constructor(data){
    this.name = data.name ?? '-service sans nom-'
  }

  /* Retourne le div construit */
  build(){
    const div = document.createElement('DIV')
    div.className = 'service'
    const name = document.createElement('DIV')
    name.className = 'name'
    name.textContent = this.name
    div.appendChild(name)
    return div
  }

}