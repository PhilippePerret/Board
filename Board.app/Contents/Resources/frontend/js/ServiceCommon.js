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
    console.log("exécution (really) de ", this)
    this.executor.execOnProject(projet)
  }

  /**
   * Fonction qui s'assure que toutes les informations requises sont
   * bien définies pour le projet +projet+. Dans le cas contraire, on
   * les définis
   */
  ensureServiceData(projet){
    console.log("-> ensureServiceData avec projet : ", projet, this)
    if (projet.sdata && projet.sdata[this.id]) return true
    const definer = new ServiceDefiner(this, this.onReturnFromDefineProjetParams.bind(this, projet))
    definer.define()
    return false
  }

  onReturnFromDefineProjetParams(projet, _service){
    projet.sdata = projet.sdata ?? {}
    Object.assign(projet.sdata, {[_service.id]: _service.params})
    console.log("Projet après définition des paramètres", projet)
    projet.save(this.execOn.bind(this, projet))
  }
}