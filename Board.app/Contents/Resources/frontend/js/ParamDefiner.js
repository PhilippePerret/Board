
/**
 * Classe qui permet de définir des paramètres
 * (paramètres tel que définis dans params des Services par exemple)
 * 
 * Utilisation
 * ------------
 * on crée une instance ParamsDefiner en lui transmettant en premier
 * argument, une liste des paramètres redéfinir, tel que défini dans 
 * les listes de paramètres de l'application, du projet, du service, 
 * etc., et en second argument, la fonction callback qui devra être 
 * appelée en fin de processus. 
 * 
 * La fonction +callback+ reçoit en fin de processus la liste des 
 * instances ParamDefiner qui correspondent à chaque paramètre. Il 
 * suffit de passer en revue cette liste en récupérant l'identifiant 
 * (id) et la valeur (value) pour obtenir les valeurs définies.
 */

class ParamsDefiner {
  /**
   * @param params Array des paramètres (p.e. {id: 'mon-id', name: 'Nome' ………})
   * @param callback Function à appeler enfin de processus avec la liste des
   *                  ParamDefiner créer pour chaque paramètre.
   */
  constructor(params, callback){
    this.params   = [...params].reverse()
    this.definers = []
    this.callback = callback
  }
  define(){
    historize('-> ParamsDefiner.define', this)
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
    historize('-> ParamsDefiner.resolve', this)
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
    this.q        = param.q       ?? null
    this.message  = param.message ?? this.q ?? null
    this.default  = param.default ?? null
    this.values   = param.values  ?? null
  }

  define() {
   historize('-> ParamDefiner.define', this)
   this.defineByType()
  }

  setValue(value){
    this.value = value
    this.paramLister.define()
  }
  // Méthode appelée quand on renonce ou qu'on fait non
  onNonButton(value) {
    if ( value === null ) {
      this.abort()
    } else {
      this.setValue(value)
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
    this.setValue(this.value || this.default)
  }

  onApp(){
    const value = App.getData([this.id])
    if (!value) {
      console.error("Je dois apprendre à définir une valeur application.")
    } else {
      this.setValue(value)
    }
  }

  onProject(){
    const value = Project.current[this.id]
    if (!value) {
      const definers =  new ParamsDefiner([Object.assign(this.param.if_undefined, {id: this.param.id})], this.onDefineProjectValue.bind(this))
      definers.define()
    } else {
      this.setValue(value)
    }
  }
  onDefineProjectValue(definers){
    historize('-> ParamDefiner.onDefineProjectValue')
    const valueDefiner = definers[0]
    const prop = valueDefiner.id
    // S'assurer que la propriété est dans la liste, sinon => erreur développer
    Project.PROPERTIES.indexOf(prop) > -1 || raise(`La propriété ${prop} doit être ajoutée Project.PROPERITES, la liste des propriétés des projets, pour pouvoir être enregistrée.`)
    Project.current[prop] = valueDefiner.value
    console.info("Propriété '%s' mises à %s", prop, Project.current[prop])
    Project.current.save()
    this.setValue(valueDefiner.value) // Fixe aussi la valeur de ce definer, puis poursuit
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
    let defaultValue = this.default
    if (this.param.useLastAsDefault) {
      // this.paramLister.definers contient déjà ce definer (poussé avant
      // define() par ParamsDefiner#define) : l'avant-dernier est le param précédent
      const previous = this.paramLister.definers[this.paramLister.definers.length - 2]
      if (previous) defaultValue = previous.value
    }
    new TextFieldDialog({
        title: this.name
      , id: this.id
      , message: this.message
      , defaultValue: defaultValue
      , ouiBtn: {name: 'OK', onclick: this.onIntegerResponse.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this, null)}
    }).show()

  }

  onPath(){
    this.waitForWindow(this.q || "Sélectionner l'élément dans le Finder et cliquer sur OK.",
      this.getPathOfFinderSelection.bind(this)
    )
  }

  onUrl(){
    new TextFieldDialog({
        title:        'Définition d’URL'
      , id:           this.id
      , message:      this.message || "Quelle URL faut-il rejoindre ?"
      , defaultValue: this.default || 'https://'
      , ouiBtn:       {name: 'OK', onclick: this.setValue.bind(this)}
      , nonBtn:       {name: 'Annuler', onclick: this.onNonButton.bind(this, null /* valeur reçue par setValue */)}
    }).show()

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
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this, null)}
    }).show()
  }

  onString(){
    new TextFieldDialog({
        title:    this.name
      , id:       this.id
      , message:  this.message
      , defaultValue: this.default
      , ouiBtn: {name: 'OK', onclick: this.setValue.bind(this)}
      , nonBtn: {name: 'Annuler', onclick: this.onNonButton.bind(this, null)}
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
    this.waitForWindow(
      this.q || "Positionner la fenêtre dans le Finder et cliquer “OK”.",
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
      , nonBtn: {name: options?.nonBtn ?? 'Annuler' , onclick: this.onNonButton.bind(this, null)}
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
    this.setValue(parseInt(values[0], 10))
  }

  // Va chercher les informations sur la fenêtre courante dans le Finder
  // Puis poursuit la définition
  /**
   * @param properties 'bounds' ou 'all'
   * @param retour Retourne du serveur avec les informations
   */
  getInfoFinderWindow(properties, retour){
    if (undefined == retour) {
      return server.send({action: 'getInfoFinderWindow', type: 'folder'}, this.getInfoFinderWindow.bind(this, properties))
    } else {
      // console.log("retour", retour)
      let value
      const data = retour.data
      if (properties == 'all') {
        value = {
            path:       data.path
          , position:   data.position
          , left:       data.position[0]
          , top:        data.position[1]
          , size:       data.size
          , width:      data.size[0]
          , height:     data.size[1]
          , viewType:   data.view
          , sidebarWidth: data.sidebarWidth
        }
      } else {
        value = properties.reduce((accu, property) => {
            Object.assign(accu, {[property]: data[property]})
            return accu
          }, {})
      }
      this.setValue(value)
    }
  }


  // Va cherche le chemin d'accès de la sélection du finder
  getPathOfFinderSelection(retour){
    if (undefined == retour) {
      server.send({action: 'run-osascript', 'script-name': 'getPathOfFinderSelection'}, this.getPathOfFinderSelection.bind(this))
    } else {
      // console.log("retour", retour)
      this.setValue(retour.data.filepath)
    }
  }

  /*
   ****** /FIN DE MÉTHODES DE RÉCUPÉRATION DES INFORMATIONS *********
   **/

}