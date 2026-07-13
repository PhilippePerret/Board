class Service {

  /**
   * Fonction appelée par le "bouton des services"
   * Il permet de basculer entre le panneau des services communs et
   * le panneau des services personnalisés
   */
  static toggle(){
    console.log("-> Service#toggle this.activeService.serviceType = %s", String(this.activeService.serviceType))
    this.activeService.closePanel()
    if (this.activeService.serviceType == 'custom'){
      console.log("this.serviceType est 'custom'", this.activeService.serviceType)
      this.activeService = ServiceCommon
    } else {
      this.activeService = ServiceCustom
    }
    this.activeService.openPanel()
    this.btnToggleService.textContent = this.activeService.oppositeButton
  }
  static get btnToggleService(){return this._btntogserv || ( this._btntogserv = DGet('#btn-toggle-common-services-panel'))}

  static showCommonPanel(){
    this.activeService = ServiceCustom
    this.toggle()
  }
  static maskCommonPanel(){
    console.log("this.activeService", this.activeService)
    this.activeService.closePanel()
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
  static closePanel(){this.panel.close()}


  static get listing(){ return DGet('.services-listing', this.panel.obj) }

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
    this.params     = data.params || raise("Il faut définir les :params du servive " + this.id)
    this.uuid       = data.uuid ?? null // seulement les services de projets
    this.type       = data.type ?? null // idem (others ou startup)
    this.projectId  = data.projectId ?? null // pas encore mis (voir si utile)
    this.scType     = data.scType ?? '.scpt'
    this.script     = data.script ?? (kebabToPascalCase(this.id) + this.scType)
    this.constructor.get(this.uuid || this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.name = data.name || raise("Un service doit avoir un :name.")
  }

  get stype(){ return this.constructor.serviceType }

  /**
   * Construction dans le listing des services
   */
  build(){
    const div = DCreate('DIV', {class:'service', id: this.id})
    div.setAttribute('draggable', true)
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    console.log("this.constructor", this.constructor)
    this.constructor.listing.appendChild(div)
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
    } else if (ev.metaKey) {
      message("Je dois apprendre à redéfinir le service personnalisé")
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