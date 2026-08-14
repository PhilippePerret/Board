/**
 * 
 * =============================================
 *    D É F I N I T I O N   D U   S E R V I C E
 * =============================================
 *
 */
class ServiceDefiner {
  
  constructor(service, callback, projet = null){
    console.log("service à définir", service)
    this.id       = service.id
    this.service  = service
    this.params   = service.params
    this.callback = callback
    this.projet   = projet

    // Données qui remplaceront params dans le service pour le projet
    // C'est une liste de valeurs qui sera envoyée au script osascript (ou autre script bash)
    // Maintenant, elles sont groupées par paramètre (array de arrays).
    // NB : Si l'on désire obtenir les valeurs par identifiant de 
    // paramètre, utiliser dictParamsValues
    this.arraysParamsValues = []

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
    // console.log("[ServiceDefiner.params", this.params)
    // Dictionnaire des valeurs des paramètres (fixes et dynamiques) en cours d'exécution, par identifiant de paramètre.
    const dictParamsValues = {}
    this.params.forEach(p => { if (p.actual !== undefined && p.actual !== null) dictParamsValues[p.id] = p.actual })
    const serviceDefiner = new ParamsDefiner(this.params, this.onDefined.bind(this), this.projet, dictParamsValues)
    serviceDefiner.define()
  }
  /**
   * Méthode appelée à la fin de la définition des valeurs de 
   * paramètres.
   */
  onDefined(definers, dictParamsValues){
    // console.log('-> onDefined avec definers = ', definers)
    if (definers) {
      // console.info("Définers retournés", definers)

      // Le projet CIBLE de cette définition, pas forcément le projet
      // courant (l'utilisateur a pu changer de sélection pendant qu'un
      // dialogue de cette définition était ouvert).
      const targetProjet = this.projet ?? Project.current

      // Pour savoir si les valeurs projets on été
      // modifiées => save
      var projectHasNewValue = false
      // Boucle sur tous les paramètres.
      // On définit ceux qui sont des propriétés du projet
      // et l'on rassemble tous les paramètres pour service
      let arraysParamsValues = []
      try {
        definers.forEach(definer => {
          switch(definer.type){
            case 'service-name':
              // console.log("define pour service-name", definer)
              this.service.setData('name', definer.value)
              break
            case 'project':
              if (targetProjet[definer.id] != definer.value){
                projectHasNewValue = true
                targetProjet[definer.id] = definer.value
              }
              arraysParamsValues.push([definer.value])
              break
            case 'finder-window':
              // console.log("'finder-window', definer = ", definer)
              definer.value.position = definer.value.position.map(n => n - 20)
              arraysParamsValues.push([definer.value.path, ...definer.value.position, ...definer.value.size, definer.value.sidebarWidth, definer.value.viewType])
              break
            case 'bounds': {
              // console.log("'bounds', define =", definer)
              definer.value.position = definer.value.position.map(n => n - 20)
              const [boundsX, boundsY] = definer.value.position
              const [boundsW, boundsH] = definer.value.size
              arraysParamsValues.push([boundsX, boundsY, boundsX + boundsW, boundsY + boundsH])
              break
            }
            default:
              arraysParamsValues.push([definer.value])
          }
        })
      } catch (e) {
        // Sans ce catch, une erreur ici (ex. definer.value.position
        // undefined si le backend a renvoyé une erreur au lieu des bounds)
        // est avalée silencieusement par le listener de clic — aucune trace,
        // exec-service jamais appelé, échec impossible à diagnostiquer.
        message(`[ServiceDefiner] ${e.message}`)
        console.error('[ServiceDefiner.onDefined] erreur pendant le traitement des definers :', e, definers)
        return
      }
      this.service.params = arraysParamsValues

      // Si des propriétés projet ont été modifiées, il
      // faut enregistrer le projet
      if (projectHasNewValue) {
        targetProjet.save(this.callback)
      } else {
        this.callback.call(this)
      }

    } else {
      // <= Il n'y a pas de definers
      // => Procédure abandonnée
      message(getMsg('aborted-definition'))
    }
  }
}