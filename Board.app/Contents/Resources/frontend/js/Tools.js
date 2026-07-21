/**
 * Implémentation des outils du panneau "Outils" (déclarés dans
 * ToolsData.js). Premier outil : position + taille de la fenêtre de
 * premier plan d'une application choisie parmi les applications ouvertes,
 * copiées dans le presse-papier (backend/scripts/GetAppWindowBounds.scpt).
 */
class Tools {

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

}
