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

    // Donnée qui remplacement params dans le service pour le projet
    // C'est une liste de valeurs qui sera envoyée au script osascript (ou autre script bash)
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
    if (definers) {
      console.info("Définers retournés", definers)

      // Pour savoir si les valeurs projets on été
      // modifiées => save
      var projectHasNewValue = false
      // Boucle sur tous les paramètres.
      // On définit ceux qui sont des propriétés du projet
      // et l'on rassemble tous les paramètres pour pour service
      let paramsValues = []
      definers.forEach(definer => {
        switch(definer.type){
          case 'service-name':
            this.service.name = definer.value
            break
          case 'project':
            if (Project.current[definer.id] != definer.value){
              projectHasNewValue = true
              Project.current[definer.id] = definer.value
            }
            break
          case 'finder-window':
            paramsValues = [...paramsValues, ...definer.value.position, ...definer.value.size, definer.value.viewType]
            break
          case 'bounds':
            paramsValues = [...paramsValues, ...definer.value.position]
            break
          default:
            paramsValues.push(definer.value)
        }
      })
      this.service.params = paramsValues

      // Si des propriétés projet ont été modifiées, il 
      // faut enregistrer le projet
      if (projectHasNewValue) {
        Project.current.save(this.callback /* ajout ou jeu */)
      } else {
        this.callback.call(this) // Ajout ou jeu
      }

    } else {
      // <= Il n'y a pas de definers
      // => Procédure abandonnée

      message('Définition abandonnée.')
      console.log("Définition abandonnée.")

    }
  }
}