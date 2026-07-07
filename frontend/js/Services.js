class Services {

  static defineService(service, callback){
    if (service.method) {
      new ServiceDefiner(service, callback).start()
    } else { return callback() }
  }

  /**
   * Construit la liste des services en la relevant en backend
   * 
   */
  static buildServiceList(retour){
    SERVICES_DATA
      .map(dataService => new Services(dataService))
      .forEach( service => service.build())
  }
  // Construction complète du panneau
  static build(){
    this.buildServiceList()
    this.built = true
  }

  static open(){
    this.built || this.build()
    this.panel.open()
  }
  static close(){this.panel.close()}

  static giveCode(code){

  }


  static get ServicesListing(){
    return this._servlist || (this._servlist = DGet('#services-panel .services-listing'))
  }
  static get panel(){
    return this._panel || (this._panel = new MiniPanel(DGet('div#services-panel')))
  }

  /**
   * Ajout du service dans le dictionnaire
   * 
   * ATTENTION
   * ---------
   * Que ce soit les services des projets (où les valeurs sont définies) 
   * ou les services abstraits, ils passent tous par là. La différence
   * se fait au niveau de l'identifiant.
   *  Service abstrait : id sert de key dans la table
   *  Service définit  : uuid sert de key dans la table
   * 
   */
  static add(service){
    this.services || (this.services = {})
    Object.assign(this.services, {[service.uuid ?? service.id]: service})
  }
  static get(serviceId){return this.services && this.services[serviceId]}

  // Retirer le service défini (ne sert à rien vraiment, mais bon…)
  static remove(serviceUUID){
    delete this.services[serviceUUID]
  }



  constructor(data){
    this.id = data.id || raise("Il faut fournir un identifiant au service.")
    this.uuid = data.uuid ?? null // seulement les services de projets
    this.type = data.type ?? null // idem (others ou startup)
    this.constructor.get(this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.name = data.name || raise("Un service doit avoir un :name.")
  }

  //'open-finder-window' => defineOpenFinderWindow
  defineMethod(){ return ServiceDefiner['defined' + kebabToPascalCase(this.id)].bind(ServiceDefiner)}
  execMethod(){return ServiceExecuter['exec' + kebabToPascalCase(this.id)].bind(ServiceExecuter)}

  build(){
    const div = DCreate('DIV', {class:'service', id: this.id})
    div.setAttribute('draggable', true)
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    this.constructor.ServicesListing.appendChild(div)
    this.observe()
  }
  observe(){
    this.obj.addEventListener("dragstart", e => e.dataTransfer.setData("id", this.id));
  } 
  
  // Retourne la carte à insérer dans le projet
  projectCard(){
    const div = DCreate('DIV', {class: 'service'})
    const name = DCreate('DIV', {class:'name',text: this.name})
    div.appendChild(name)
    div.draggable = true
    this.projectCard = div
    return div
  }
}








class MiniPanel {
  constructor(obj){
    this.obj = obj
    console.log("obj", obj)
  }
  open(){ this.obj.classList.remove('closed')}
  close(){this.obj.classList.add('closed')}

}