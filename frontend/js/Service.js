class Service {

  /**
   * Fonction appelée par le "bouton des services"
   * Il permet de basculer entre le panneau des services communs et
   * le panneau des services personnalisés
   */
  static toggle(){
    if (this.panelId == 'common-services-panel'){
      this.panelId = 'custom-services-panel'
      ServiceCustom.openPanel()
    } else {
      this.panelId = 'common-services-panel'
      ServiceCommon.openPanel()
    }
  }

  /**
   * Construit la liste des services en la relevant en backend
   * 
   */
  static buildServiceList(retour){
    this.SERVICES_DATA
      .map(dataService => new this.klass(dataService))
      .forEach( service => service.build())
  }

  // Construction complète du panneau
  static build(){
    this.buildServiceList()
    this.built = true
  }

  static openPanel(){
    this.built || this.build()
    this.panel.open()
  }
  static close(){this.panel.close()}

  static giveCode(code){

  }


  static get ServicesListing(){
    return this._servlist || (this._servlist = DGet('.services-listing', this.panel))
  }
  static get panelId(){return this._panelid ?? 'custom-services-panel'}
  static set panelId(v){ this._panelid = v}
  static get panel(){
    return this._panel || (this._panel = new MiniPanel(DGet(`div#${this.panelId}`)))
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
    console.log("data Service", data)
    this.id = data.id || raise("Il faut fournir un identifiant au service.")
    /**
     * Les paramètres du service. Attention, là aussi les données des services réels (dans projet)
     * sont différentes des données abstraites qui définissent ce qu'il faut pour
     * définir le service.
     */
    this.params = data.params || raise("Il faut définir les :params du servive " + this.id)
    this.uuid   = data.uuid ?? null // seulement les services de projets
    this.type   = data.type ?? null // idem (others ou startup)
    this.projectId = data.projectId ?? null // pas encore mis (voir si utile)
    this.scType = data.scType ?? '.scpt'
    this.constructor.get(this.uuid || this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.name = data.name || raise("Un service doit avoir un :name.")
  }

  /**
   * Construction dans le listing des services
   */
  build(){
    const div = DCreate('DIV', {class:'service', id: this.id})
    div.setAttribute('draggable', true)
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    this.constructor.ServicesListing.appendChild(div)
    this.observe()
  }

  get executor(){ return this._executor || (this._executor = new ServiceExecuter(this))}
  
  // Appelée pour définir le service pour le projet, +projet+
  define(projet, callback){
    new ServiceDefiner(this, callback).start()
  }
  
  // Retourne la carte à insérer dans le projet
  projectCard(projet){
    const div = DCreate('DIV', {class: 'service', id: `service-${this.uuid}`})
    const name = DCreate('DIV', {class:'name',text: this.name})
    div.appendChild(name)
    div.draggable = true
    this.projectCard = div
    this.observeServiceCard(projet, div)
    return div
  }

  observeServiceCard(projet, card){
    listen(card, 'click', this.onClickOnProjectService.bind(this))
    listen(card, 'dragstart', e => projet.draggedService = this)
    listen(card, 'dragend', e => {
      if (e.dataTransfer.dropEffect != "none") return
      projet.removeServiceFromListe();
    })
  }

  onClickOnProjectService(ev){
    if (ev.shiftKey) {
      message("Apprendre à sélectionner le service")
    } else {
      this.exec(ev)
    }
  }
  // Exécution du service
  exec(ev, callback){
    console.log("callback dans Service#exec", callback)
    this.executor.exec(callback)
    console.log("Service#exec se termine bien")
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