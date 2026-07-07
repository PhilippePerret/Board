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
   */
  define(){
    console.log("this.paramsValues au début de define", this.paramsValues)
    const param = this.params.pop()
    console.log("param", param)
    if (param) this.defineByType(param)
    else this.resolve()
  }
  /**
   * Méthode de dispatch de définition en fonction du type
   * 
   */
  defineByType(param){
    switch(param.type){
      case 'finder-window':
        this.attend(param.q || "Ouvrir la fenêtre dans le Finder et la régler comme voulue (position, taille, type de vue) puis cliquer OK.",
          this.getInfoFinderWindow.bind(this)
        )
        break
      case 'path':
        message("Je dois apprendre à définir un chemin d'accès")
        this.attend(param.q || "Sélectionner l'élément dans le Finder et cliquer sur OK.",
          this.getPathOfFinderSelection.bind(this)
        )
        break
      case 'app':
        message("Je dois apprendre à définir une application (CLI)")
        break
      case 'boolean':
        this.attend(param.q, this.onBooleanResponse.bind(this, param, true), this.onBooleanResponse.bind(this, param, false), {nomBtn: 'Non'})
        message("Je dois apprendre à régler une valeur booléenne")
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
  getInfoFinderWindow(retour){
    if (undefined == retour) {
      return server.send({action: 'getInfoFinderWindow', type: 'folder'}, this.getInfoFinderWindow.bind(this))
    } else {
      console.log("retour", retour)
      const data = retour.data
      this.addParamValues([
        // path: data.path, position: data.position, size: data.size, sidebarWidth: data.sidebarWidth, view: data.view
        data.path, ...data.position, ...data.size, data.sidebarWidth, data.view
      ])
      this.define()
    }
  }


  attend(message, callback, fallback = null, options = null){
    new ConfirmDialog({
      title: "Définition du service",
      message: message,
      ouiBtn: {name: 'OK', onclick: callback},
      nonBtn: {name: options?.nonBtn ?? 'Annuler', onclick: fallback}
    }).show()
  }
  
  // Fonction de retour des données
  onReturnedData(retour){
    console.log("retour", retour)
    this.service.data = retour.data
    this.resolve()
  }
}