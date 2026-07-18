/**
 * 
 * =============================================
 *    D É F I N I T I O N   D U   S E R V I C E
 * =============================================
 *
 */
class ServiceDefiner {
  
  constructor(service, callback){
    console.log("service à définir", service)
    this.id       = service.id
    this.service  = service
    this.params   = [...service.params]
    this.callback = callback
    this.afterDefinedParams = service.afterDefinedParams

    // Donnée qui remplaceront params dans le service pour le projet
    // C'est une liste de valeurs qui sera envoyée au script osascript (ou autre script bash)
    // Maintenant, elles sont groupées par paramètre.
    this.paramsValues = []

    // Mis à true quand on redéfinition un service (juste pour le titre)
    this.redefinition = false

    // Mis à false quand le service est renommé
    this.unnamed = service.unnamed ?? true
    // console.log("this.unamed (false attendu)", this.unnamed)
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
    console.log("[ServiceDefiner.params", this.params)
    const serviceDefiner = new ParamsDefiner(this.params, this.onDefined.bind(this))
    serviceDefiner.define()
  }
  /**
   * Méthode appelée à la fin de la définition des valeurs de 
   * paramètres.
   */
  onDefined(definers){
    console.log('-> onDefined avec definers = ', definers)
    if (definers) {
      console.info("Définers retournés", definers)

      // Pour savoir si les valeurs projets on été
      // modifiées => save
      var projectHasNewValue = false
      // Boucle sur tous les paramètres.
      // On définit ceux qui sont des propriétés du projet
      // et l'on rassemble tous les paramètres pour service
      let paramsValues = []
      definers.forEach(definer => {
        switch(definer.type){
          case 'service-name':
            // console.log("define pour service-name", definer)
            this.service.data.name = definer.value
            break
          case 'project':
            if (Project.current[definer.id] != definer.value){
              projectHasNewValue = true
              Project.current[definer.id] = definer.value
            }
            paramsValues.push([definer.value])
            break
          case 'finder-window':
            // console.log("'finder-window', definer = ", definer)
            definer.value.position = definer.value.position.map(n => n - 20)
            paramsValues.push([definer.value.path, ...definer.value.position, ...definer.value.size, definer.value.sidebarWidth, definer.value.viewType])
            break
          case 'bounds': {
            // console.log("'bounds', define =", definer)
            definer.value.position = definer.value.position.map(n => n - 20)
            const [boundsX, boundsY] = definer.value.position
            const [boundsW, boundsH] = definer.value.size
            paramsValues.push([boundsX, boundsY, boundsX + boundsW, boundsY + boundsH])
            break
          }
          default:
            paramsValues.push([definer.value])
        }
      })
      if (this.afterDefinedParams){
        paramsValues = this.afterDefinedParams(paramsValues)
      }
      this.service.params = paramsValues

      // Si des propriétés projet ont été modifiées, il 
      // faut enregistrer le projet
      if (projectHasNewValue) {
        Project.current.save(this.callback)
      } else {
        this.callback.call(this)
      }

    } else {
      // <= Il n'y a pas de definers
      // => Procédure abandonnée
      message('Définition abandonnée.')
      console.log("Définition abandonnée.")
    }
  }
}