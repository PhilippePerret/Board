class Services {

  /**
   * Construit la liste des services en la relevant en backend
   * 
   */
  static buildServiceList(retour){
    if (undefined == retour){
      return server.send({action:'get-all-services'}, this.buildServiceList.bind(this))
    }
    console.log("retour", retour)
    retour.data
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

  static add(service){
    this.services ?? {}
    Object.assign(this.services, {[service.id]: service})
  }
  static get(serviceId){return this.services?[serviceId]}

  constructor(data){
    this.id = data.id || raise("Il faut fournir un identifiant au service.")
    this.constructor.get(this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.name = data.name || raise("Un service doit avoir un :name.")
  }

  build(){
    const div = DCreate('DIV', {class:'service', id: this.id})
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    this.constructor.ServicesListing.appendChild(div)
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