class Service {

  static init(){
    // juste pour les instancier
    this.CustomPanel
    this.CommonPanel
  }

  static get CustomPanel(){ return this._cuspanel || (this._cuspanel = new CustomPanel())}
  static get CommonPanel(){ return this._companel || (this._companel = new CommonPanel())}
  /**
   * Fonction appelée par le "bouton des services"
   * Il permet de basculer entre le panneau des services communs et
   * le panneau des services personnalisés
   */
  static togglePanel(){
    this.activePanel = this.activePanel.toggle()
  }
  static get btnToggleService(){return this._btntogserv || ( this._btntogserv = DGet('#btn-toggle-common-services-panel'))}

  // Parce qu'on commence toujours par celui-ci
  static showCommonPanel(){
    this.activePanel = this.CustomPanel
    this.togglePanel()
  }
  static maskCommonPanel(){this.activePanel.close()}

  /**
   * Construit la liste des services
   * Dans COMMON_SERVICES_DATA et CUSTOM_SERVICES_DATA
   * 
   */

  // // Construction complète du panneau
  // static build(){
  //   this.buildServiceList()
  //   this.built = true
  // }

  // static openPanel(){
  //   this.built || this.build()
  //   this.panel.open()
  // }
  // static closePanel(){this.panel.close()}



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
    this.id     = data.id || raise("Il faut fournir un identifiant au service.")
    this.group  = data.group ?? null
    /**
     * Les paramètres du service. Attention, là aussi les données des services réels (dans projet)
     * sont différentes des données abstraites qui définissent ce qu'il faut pour
     * définir le service.
     */
    this.params     = data.params || raise("Il faut définir les :params du servive " + this.id)
    this.uuid       = data.uuid ?? null // seulement les services de projets
    this.stype      = data.stype || 'custom' // plus tard : raise("Le service-type (stype) doit être défini.") // 'custom'|'common'
    this.type       = data.type ?? null // idem (others ou startup)
    this.projectId  = data.projectId ?? null // pas encore mis (voir si utile)
    this.scType     = data.scType ?? '.scpt'
    this.script     = data.script ?? (kebabToPascalCase(this.id) + this.scType)
    this.front      = data.front ?? null
    this.constructor.get(this.uuid || this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.name = data.name || raise("Un service doit avoir un :name.")

    this.isCommonService = this.stype === 'common'
  }

  /**
   * Construction dans le listing des services
   */
  build(contenant){
    const div = DCreate('DIV', {class:'service', id: this.id})
    div.setAttribute('draggable', true)
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    console.log("this.constructor", this.constructor)
    contenant.appendChild(div)
    this.observe()
  }

  observe(){
    listen(this.obj, 'dragstart', e => e.dataTransfer.setData("id", this.id))
    if (this.isCommonService) {
      listen(this.obj, 'click', this.execCommonServiceOn.bind(this, null))
    }
  } 

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

  /**
   * Observation de la carte insérée dans le projet
   */
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
    new ServiceExecuter(this).exec(callback)
    console.log("Service#exec se termine bien")
  }



  /**
   ********************* SERVICES COMMUNS *************************
   */


  /**
   * Fonction qui exécute le service commum sur le projet +projet+
   * après s'être assuré que le projet définissait tous les
   * paramètres requis.
   * 
   */
  execCommonServiceOn(projet, ev){
    projet = projet ?? Project.current
    if (ev?.metaKey) {
      return this.defineCommonServiceParameters(projet, true) // rappellera cette fonction
    } else if (!this.ensureServiceData(projet)) {
      return null
    }
    new ServiceExecuter(this).execOnProject(projet)
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








class MiniPanel {
  constructor(obj){
    this.obj = obj
    console.log("obj", obj)
  }
  open(){ this.obj.classList.remove('closed')}
  close(){this.obj.classList.add('closed')}

}