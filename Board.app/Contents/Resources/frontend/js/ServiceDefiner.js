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
    console.log("service", service)
    this.service  = service
    this.params   = service.params.reverse() // pour pouvoir poper
    this.callback = callback

    // Donnée qui remplacement params dans le service pour le projet
    // C'est une liste de valeurs qui sera envoyée au script osascript (ou autre script bash)
    this.paramsValues = []

    // Mis à true quand on redéfinition un service (juste pour le titre)
    this.redefinition = false

    // Mis à false quand le service est renommé
    this.unnamed = true
  }

  // On commence
  start(){
    // console.log("-> start")
    this.define()
  }

  // Pour ajouter une valeur
  addParamValue(param, paramValue){
    this.paramsValues.push(paramValue)
    param.absolute && Project.current.addToAData({[param.id]: paramValue})
  }
  // Pour ajouter plusieurs valeurs
  addParamValues(param, paramsValues){
    this.paramsValues = [...this.paramsValues, ...paramsValues]
    param.absolute && Project.current.addToAData({[param.id]: paramsValues})
  }

  /**
   * Méthode principale de définition du service
   * Elle commence progressivement les paramètres à définir.
   */
  define(){
    if (this.unnamed) {
      this.params.unshift({
        id: 'service-name', type:'service-name', default: this.service.name
      })
    }
    const serviceDefiner = new ParamsDefiner(this.params, this.onDefined.bind(this))
    serviceDefiner.define()
  }
  onDefined(definers){
    if (definers) {
      console.info("Définers retournés", definers)
    } else {
      console.log("Définition abandonnée.")
    }
  }
  // define(){
  //   console.log("this.paramsValues au début de define", this.paramsValues)
  //   // Si le service n'est pas encore nommé, il faut le nommer
  //   if (this.unnamed) return this.fixCustomName() // service custom only
  //   const param = this.params.pop()
  //   // console.log("param", param)
  //   if (param){ 
  //     if (param.absolute){
  //       if ( undefined != Project.current.adata??[param.id] ) {
  //         console.log("Project.current.adata", Project.current.adata)
  //         this.addParamValues(param, Project.current.adata[param.id])
  //         return this.define()
  //       }
  //     }
  //     this.defineByType(param)
  //   } else this.resolve()
  // }

  // fixCustomName(name){
  //   console.log("->fixCustomName name = ", name)
  //   if (undefined == name) {
  //     new TextFieldDialog({
  //         title: ` ${this.redefinition ? "Renommage" : "Nom"} du service`
  //       , id: 'service_name'
  //       , message: `Comment renommer “${this.service.name}” spécialement pour ce projet ?`
  //       , defaultValue: this.service.name
  //       , ouiBtn: {name: 'OK', onclick: this.fixCustomName.bind(this)}
  //       , nonBtn: {name: 'Renoncer'}
  //     }).show()
  //   } else {
  //     this.service.name = name
  //     this.unnamed = false
  //     this.define() // poursuite de la définition
  //   }
  // }
}