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
    // Verrouillé pour toute la durée de la définition (pas seulement le save
    // final ci-dessous) : bloque un save EXTERNE (ex. Reminder.poll) tombant
    // pendant que les paramètres sont en cours de résolution — retiré dans
    // les deux issues possibles de onDefined (succès et abandon).
    this._lockedProjet = this.projet ?? Project.current
    this._lockedProjet.lockSave()
    const serviceDefiner = new ParamsDefiner(this.params, this.onDefined.bind(this), this.projet, dictParamsValues)
    serviceDefiner.define()
  }
  /**
   * Méthode appelée à la fin de la définition des valeurs de 
   * paramètres.
   */
  onDefined(definers, dictParamsValues){
    // console.log('-> onDefined avec definers = ', definers)
    // Déverrouillé ici, avant toute autre issue (succès, abandon, erreur de
    // traitement ci-dessous) : la définition des paramètres elle-même est
    // terminée dans tous les cas, jamais de sortie sans déverrouiller.
    this._lockedProjet.unlockSave()
    if (definers) {
      // console.info("Définers retournés", definers)

      // Le projet CIBLE de cette définition, pas forcément le projet
      // courant (l'utilisateur a pu changer de sélection pendant qu'un
      // dialogue de cette définition était ouvert).
      const targetProjet = this.projet ?? Project.current

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
              targetProjet[definer.id] = definer.value
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

      // Le save réel (unique) est à la charge du caller, dans this.callback
      // (cf. Service.js) — plus aucun save ici, pendant la définition.
      this.callback.call(this)

    } else {
      // <= Il n'y a pas de definers
      // => Procédure abandonnée
      message(getMsg('aborted-definition'))
    }
  }
}