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
  execOn(projet, ev){
    if (ev?.metaKey) {
      return this.defineCommonServiceParameters(projet, true) // rappellera cette fonction
    } else if (!this.ensureServiceData(projet)) {
      return null
    }
    console.log("exécution (really) de ", this)
    if (this.id === 'work-clock') { // C'EST QUOI CE MERDIER AJOUTÉ PAR CLAUDE ????
      Clock.open(projet, projet.sdata[this.id])
    } else {
      this.executor.execOnProject(projet)
    }
  }

  /**
   * Fonction qui s'assure que toutes les informations requises sont
   * bien définies pour le projet +projet+. Dans le cas contraire, on
   * les définis
   */
  ensureServiceData(projet){
    console.log("-> ensureServiceData avec projet : ", projet, this)
    if (projet.sdata && projet.sdata[this.id]) return true
    return this.defineCommonServiceParameters(projet, false /* 1re définition */)
  }

  defineCommonServiceParameters(projet, redefine = false){
    const definer = new ServiceDefiner(this, this.onReturnFromDefineProjetParams.bind(this, projet))
    definer.redefinition = redefine
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