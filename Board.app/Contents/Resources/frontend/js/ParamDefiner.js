
/**
 * Classe qui permet de définir des paramètres
 * (paramètres tel que définis dans params des Services par exemple)

ANCIENS APPELS À FONCTION :
*/
        /* pour 'bounds'
        this.addParamValues(param, [
          ...data.position, ...data.size, data.view
        ])
        */
        /* pour 'all'
        this.addParamValues(param, [
          // path: data.path, position: data.position, size: data.size, sidebarWidth: data.sidebarWidth, view: data.view
          data.path, ...data.position, ...data.size, data.sidebarWidth, data.view
        ])
        */


/**
 * DÉFINITION D'UNE LISTE DE PARAMÈTRES
 */
class ParamsDefiner {
  constructor(params, callback){
    this.params   = [...params].reverse()
    this.definers = []
    this.callback = callback
  }
  define(){
    const param = this.params.pop()
    if (param) {
      const thedefiner = new ParamDefiner(this, param)
      this.definers.push(thedefiner)
      thedefiner.define()
    } else {
      this.resolve()
    }
  }

  abort(){ 
    this.callback(null)
    return error('Définition abandonnée')
  }
  resolve(){
    this.callback(this.definers)
  }
}

/**
 * DÉFINITION D'UN PARAMÈTRES
 */
class ParamDefiner {

  constructor(paramLister, param){
    this.paramLister = paramLister
    console.log("param dans constructeur", param)
    this.param = param
    this.id       = param.id      ?? raise('Un identifiant est obligatoire.', param)
    this.name     = param.name    ?? param.id
    this.type     = param.type    ?? raise('Le type doit être défini.', param)
    this.message  = param.message ?? this.q ?? null
    this.default  = param.default ?? null
    this.values   = param.values  ?? null
  }

  define() {
    this.defineByType()
  }

  setValue(ev, value){
    this.value = value
    this.paramLister.define()
  }
  // Méthode appelée quand on renonce ou qu'on fait non
  onNonButton(ev, value) {
    if ( value === null ) {
      this.abort()
    } else {
      this.value = value
      this.paramLister.define()
    }
  }

  // Pour abandonner les définitions
  abort(){
    this.value = '--aborted--'
    this.paramLister.abort() // interrompra la définition sans rien faire
  }

  /**
   * Grande méthode qui va récupérer toutes les valeurs en fonction
   * de leur type
   */
  defineByType(){
    const methodName = `on${kebabToPascalCase(this.type)}`
    const method = this[methodName].bind(this)
    'function' == typeof method || raise(`La méthode '${methodName}' doit être définie.`)    
    method()
  }

  /**
   *************** MÉTHODES ON-<TYPE> ******************
   */


  onRaw(){
    this.value = this.value || this.default
  }

  onApp(){
    this.value = App.getData([this.id])
  }

  onProject(){
    this.value = Project.current[this.id]
  }

  onBoolean(){
    new ConfirmDialog({
        title: this.name
      , message: this.message
      , ouiBtn: {name: 'Oui' , onclick: this.setValue.bind(this, true)}
      , nonBtn: {name: 'Non' , onclick: this.setValue.bind(this, false)}
    }).show()
  }

  onInteger(){
    new TextFieldDialog({
        title: this.name
      , id: this.id
      , message: this.message
      , defaultValue: this.default
      , ouiBtn: {name: 'OK', onclick: this.onIntegerResponse.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this)}
    }).show()

  }

  onPath(){
    this.waitForWindow(this.q || "Sélectionner l'élément dans le Finder et cliquer sur OK.",
      this.getPathOfFinderSelection.bind(this)
    )
  }

  onUrl(){
    this.waitForText(this.q || "Quelle URL faut-il rejoindre ?")
  }

  onSelect(){
    new SelectDialog({
        title: this.name
      , id: this.id
      , message: this.message
      , idValues: [this.id]
      , values: this.values
      , defaultValue: this.default
      , ouiBtn: {name: 'OK', onclick: this.setValue.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this)}
    }).show()
  }

  onString(){
    new TextFieldDialog({
        title:    this.name
      , id:       this.id
      , message:  this.message
      , defaultValue: this.default
      , ouiBtn: {name: 'OK', onclick: this.setValue.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this)}
    }).show()
  }

  // type 'service-name'
  onServiceName(){
    new TextFieldDialog({
        title:    'Nouveau nom du service'
      , id:       this.id
      , message: 'Quel nouveau nom donner à ce service pour le projet ?'
      , defaultValue: this.default
      , ouiBtn: {name: 'OK', onclick: this.setValue.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this, null)}
    }).show()
  }

  // type 'finder-window'
  onFinderWindow(){
    this.waitForWindow(this.q || "Ouvrir la fenêtre dans le Finder et la régler comme voulue (position, taille, type de vue) puis cliquer OK.",
      this.getInfoFinderWindow.bind(this, 'all')
    )
  }

  // type 'bounds'
  onBounds(){
    this.attend(
      param.q || "Positionner la fenêtre dans le Finder et cliquer “OK”.",
      this.getInfoFinderWindow.bind(this, ['position', 'size'])
    )
  }

  // type 'path-or-null'
  onPathOrNull(){
    new ConfirmDialog({
      title: `${this.redefinition?'Red':'D'}éfinition de paramètre`,
      message: this.q || "Sélectionner l'élément dans le Finder ou cliquer 'Aucun'.",
      ouiBtn: {name: 'OK'   , onclick: this.getPathOfFinderSelection.bind(this)},
      nonBtn: {name: 'Aucun', onclick: this.setValue.bind(this, null)}
    }).show()
  }

  /* 
   *************** FIN DES MÉTHODES on<Type>
   **/




  /**
   *************** MÉTHODES D'ATTENTES ******************
   */

  waitForWindow(message, callback, fallback = null, options = null){
    new ConfirmDialog({
        title: `${this.redefinition?'Red':'D'}éfinition de paramètre`
      , message: message
      , ouiBtn: {name: options?.ouiBtn ?? 'OK'        , onclick: callback}
      , nonBtn: {name: options?.nonBtn ?? 'Annuler'   , onclick: fallback}
    }).show()
  }

  waitForText(message, options = null){
    new TextFieldDialog({
        title: `${this.redefinition?'Red':'D'}éfinition de l’URL`
      , message: message
      , ouiBtn: {name: options?.ouiBtn ?? 'OK'      , onclick: this.setValue.bind(this)}
      , nonBtn: {name: options?.nonBtn ?? 'Annuler' , onclick: this.onNonButton.bind(this)}
    }).show()
  }
  
  /*
   ************* /FIN DES MÉTHODES D'ATTENTES *****************
   **/


  /**
   ******** MÉTHODES DE RÉCUPÉRATION DES INFORMATIONS ***********
   */

  // Reçoit la réponse à une question demandant un entier (minutes, etc.)
  onIntegerResponse(values){
    this.value = parseInt(values[0], 10)
  }

  // Va chercher les informations sur la fenêtre courante dans le Finder
  // Puis poursuit la définition
  /**
   * @param what 'bounds' ou 'all'
   * @param retour Retourne du serveur avec les informations
   */
  getInfoFinderWindow(properties, retour){
    if (undefined == retour) {
      return server.send({action: 'getInfoFinderWindow', type: 'folder'}, this.getInfoFinderWindow.bind(this, properties))
    } else {
      // console.log("retour", retour)
      const data = retour.data
      if (properties == 'all') {
        this.value = {
            path:       data.path
          , position:   data.position
          , left:       data.position[0]
          , top:        data.position[1]
          , size:       data.size
          , width:      data.size[0]
          , height:     data.size[1]
          , viewType:   data.view
        }
      } else {
        this.value = properties.reduce((accu, property) => {
            Object.assign(accu, {[property]: data[property]})
            return {}
          })
      }
    }
  }


  // Va cherche le chemin d'accès de la sélection du finder
  getPathOfFinderSelection(retour){
    if (undefined == retour) {
      server.send({action: 'run-osascript', 'script-name': 'getPathOfFinderSelection'}, this.getPathOfFinderSelection.bind(this))
    } else {
      // console.log("retour", retour)
      this.value = {path: retour.data.filepath, name: retour.data.filename}
    }
  }

  /*
   ****** /FIN DE MÉTHODES DE RÉCUPÉRATION DES INFORMATIONS *********
   **/

}