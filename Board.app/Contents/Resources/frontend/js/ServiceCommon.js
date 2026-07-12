/**
 * Gestion des services communs
 */
class ServiceCommon extends Service {
  static get serviceType(){ return 'common'}
  static get klass(){ return ServiceCommon}

  static get SERVICES_DATA(){return COMMON_SERVICES_DATA}

  static get oppositeButton(){return "Services personnalisés"}
  static get panel(){
    return this._panel || (this._panel = new MiniPanel(DGet(`div#common-services-panel`)))
  }
  
  constructor(serviceData){
    super(serviceData)
  }

  observe(){
    listen(this.obj, 'click', this.execOn.bind(this, Project.current))
  } 

  /**
   * Fonction qui exécute le service commum sur le projet +projet+
   * après s'être assuré que le projet définissait tous les
   * paramètres requis.
   * 
   */
  execOn(projet){
    if (!this.ensureServiceData(projet)) return
    this.executor.execReally()
  }


  /**
   * Fonction qui s'assure que toutes les informations requises sont
   * bien définies pour le projet +projet+. Dans le cas contraire, on
   * les définis
   */
  ensureServiceData(projet){
    if (projet.sdata) {
      var projetIsDefined = true
      for (var param of this.params) {
        if (undefined == projet.sdata[param.id]){
          // Si une donnée utile au service commun n'est pas définie
          // par le projet, il faut les définir.
          projetIsDefined = false
        }
      }
      if ( projetIsDefined ) return true
    }
    const definer = new ServiceDefiner(this, this.onReturnFromDefineProjetParams.bind(this, projet))
    definer.define()
    return false
  }

  onReturnFromDefineProjetParams(projet, _service){
    const values = _service.params
    projet = Object.assign(projet, values)
    console.log("Projet après définition des paramètres", projet)
    projet.save(this.execOn.bind(this, projet))
  }
}