/**
 * 
 * =============================================
 *    D É F I N I T I O N   D U   S E R V I C E
 * =============================================
 * Cette méthode permet de définir les données nécessaires
 * au service.
 * 
 * Fonctionnement
 * --------------
 * À la base, +service+ est une table contenant :id, :name et
 * :method
 * :method est la méthode à appeler pour 1) définir et 2) exécuter le service
 * 
 * Le parcours se fait par : 
 *  start ->
 *  (boucle) define -> defineByType -> attend -> <methode de récupération> -> backend -> <methode de récupération> -> define (avec data)
 *  -> resolve (mise des nouveau :params dans service)

 */
class ServiceDefiner {
  
  constructor(service, callback){
    this.service  = service
    this.params   = service.params.reverse() // pour pouvoir poper
    this.callback = callback

    // Donnée qui remplacement params dans le service pour le projet
    // C'est une liste de valeurs qui sera envoyée au script osascript (ou autre script bash)
    this.paramsValues = []

    // Tant que le nom propre du service n'est pas donné par l'utilisateur
    this.unnamed = true

  }

  // On commence
  start(){
    console.log("-> start")
    this.define()
  }

  // On finit
  resolve(){
    this.service.params = this.paramsValues
    console.log("[resolve] Service %s après définition", this.service.id, this.service)
    this.callback(this.service)
  }


  // Pour ajouter une valeur
  addParamValue(paramValue){
    this.paramsValues.push(paramValue)
  }
  // Pour ajouter plusieurs valeurs
  addParamValues(paramsValues){
    this.paramsValues = [...this.paramsValues, ...paramsValues]
  }

  /**
   * Méthode principale de définition du service
   * Elle commence progressivement les paramètres à définir.
   */
  define(){
    console.log("this.paramsValues au début de define", this.paramsValues)
    // Si le service n'est pas encore nommé, il faut le nommer
    if (this.unnamed) return this.fixCustomName()
    const param = this.params.pop()
    console.log("param", param)
    if (param) this.defineByType(param)
    else this.resolve()
  }

  fixCustomName(name){
    console.log("->fixCustomName name = ", name)
    if (undefined == name) {
      new TextFieldDialog({
          title: "Nom du service"
        , id: 'service_name'
        , message: `Comment renommer “${this.service.name}” spécialement pour ce projet ?`
        , defaultValue: this.service.name
        , ouiBtn: {name: 'OK', onclick: this.fixCustomName.bind(this)}
        , nonBtn: {name: 'Renoncer'}
      }).show()
    } else {
      this.service.name = name
      this.unnamed = false
      this.define() // poursuite de la définition
    }
  }
  /**
   * Méthode de dispatch de définition en fonction du type
   * 
   */
  defineByType(param){
    switch(param.type){
      case 'finder-window':
        this.attend(param.q || "Ouvrir la fenêtre dans le Finder et la régler comme voulue (position, taille, type de vue) puis cliquer OK.",
          this.getInfoFinderWindow.bind(this, 'all')
        )
        break
      case 'bounds':
        this.attend(
          param.q || "Positionner la fenêtre dans le Finder et cliquer “OK”.",
          this.getInfoFinderWindow.bind(this, 'bounds')
        )
        console.error("Je dois apprendre à demander le bounds d'une fenêtre Finder")
        break
      /**
       * Quand on doit choisir un chemin d'accès ou retourner NULL
       * quand on en choisit pas, mais en continuant
       */
      case 'path-or-null':
        new ConfirmDialog({
          title: "Définition du service",
          message: param.q || "Sélectionner l'élément dans le Finder ou cliquer 'Aucun'.",
          ouiBtn: {name: 'OK'   , onclick: this.getPathOfFinderSelection.bind(this)},
          nonBtn: {name: 'Aucun', onclick: this.returnNull.bind(this)}
        }).show()
        break
      /**
       * Demande un chemin d'accès (en le sélectionnant dans le Finder)
       * La touche "Annuler", interrompt l'opération, contrairement à
       * 'path-or-null'
       */
      case 'path':
        this.attend(param.q || "Sélectionner l'élément dans le Finder et cliquer sur OK.",
          this.getPathOfFinderSelection.bind(this)
        )
        break
      case 'url':
        message("")
        this.attendsPourTexte(param.q || "Quelle URL faut-il rejoindre ?"),
          this
        break
      case 'app':
        message("Je dois apprendre à définir une application (CLI, bash, ruby, zsh, python3, etc.)")
        break
      case 'boolean':
        this.attend(
          param.q, 
          this.onBooleanResponse.bind(this, param, true), 
          this.onBooleanResponse.bind(this, param, false), 
          {ouiBtn: 'Oui', nonBtn: 'Non'})
        break
      default:
        error("Je ne connais pas le type " + param.type)
    }
  }


  // Reçoit la réponse à une question booléenne
  onBooleanResponse(param, trueOrFalse, retour){
    console.log("retour dans onBooleanResponse", retour)
    this.addParamValue(trueOrFalse)
    this.define()
  }

  /**
   * Quand on doit juste retourner une valeur null
   */
  returnNull() {
    this.addParamValue(null)
    this.define()
  }

  // Va cherche le chemin d'accès à la sélection du finder
  getPathOfFinderSelection(retour){
    if (undefined == retour) {
      server.send({action: 'run-osascript', 'script-name': 'getPathOfFinderSelection'}, this.getPathOfFinderSelection.bind(this))
    } else {
      console.log("retour", retour)
      this.addParamValues([retour.data.filepath, retour.data.filename])
      this.define()
    }
  }

  // Va chercher les informations sur la fenêtre courante dans le Finder
  // et les ajouter à this.paramsValues
  // Puis poursuit la définition
  /**
   * @param what 'bounds' ou 'all'
   * @param retour Retourne du serveur avec les informations
   */
  getInfoFinderWindow(what, retour){
    if (undefined == retour) {
      return server.send({action: 'getInfoFinderWindow', type: 'folder'}, this.getInfoFinderWindow.bind(this, what))
    } else {
      console.log("retour", retour)
      const data = retour.data
      if (what === 'bounds'){
        this.addParamValues([
          ...data.position, ...data.size
        ])
      } else {
        this.addParamValues([
          // path: data.path, position: data.position, size: data.size, sidebarWidth: data.sidebarWidth, view: data.view
          data.path, ...data.position, ...data.size, data.sidebarWidth, data.view
        ])
      }
      this.define()
    }
  }

  attendsPourTexte(message, callback, fallback = null, options = null){
    new TextFieldDialog({
        title: "Définition d'URL"
      , message: message
      , ouiBtn: {name: options?.ouiBtn ?? 'OK', onclick: callback}
      , nonBtn: {name: options?.nonBtn ?? 'Annuler', onclick: fallback}
    }).show()
  }
  attend(message, callback, fallback = null, options = null){
    new ConfirmDialog({
        title: "Définition du service"
      , message: message
      , ouiBtn: {name: options?.ouiBtn ?? 'OK', onclick: callback}
      , nonBtn: {name: options?.nonBtn ?? 'Annuler', onclick: fallback}
    }).show()
  }
  
  // Fonction de retour des données
  onReturnedData(retour){
    console.log("retour", retour)
    this.service.data = retour.data
    this.resolve()
  }
}