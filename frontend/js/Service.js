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

  // Parce qu'on commence toujours par celui-ci
  static showCommonPanel(){
    this.activePanel = this.CustomPanel
    this.togglePanel()
  }
  static maskCommonPanel(){this.activePanel.close()}

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

  // Retirer le service défini
  static remove(serviceUUID){
    delete this.services[serviceUUID]
  }



  constructor(data){
    // console.log("data Service", data)
    this.id     = data.id || raise("Il faut fournir un identifiant au service.")
    this.data   = data
    /**
     * Les paramètres du service. Attention, là aussi les données des services réels (dans projet)
     * sont différentes des données abstraites qui définissent ce qu'il faut pour
     * définir le service.
     */
    this.params     = data.params || raise("Il faut définir les :params du servive " + this.id)
    this.uuid       = data.uuid ?? null
    this.type       = data.type ?? null // idem (others ou startup)
    this.projectId  = data.projectId ?? null // pas encore mis (voir si utile)
    this.oneShot    = data.oneShot ?? false // service common depuis panneau
    this.constructor.get(this.uuid || this.id) && raise(`L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.afterDefinedParams = data.afterDefinedParams ?? null
    this.isCommonService = this.stype === 'common'
  }

  get(key, defValue = null) {return this.data[key] ?? this.absData[key] ?? defValue}

  get name()    { return this.get('name') || raise("Un service doit avoir un :name.") }
  get group()   { return this.get('group', null) }
  get stype()   { return this.get('stype', 'custom') }
  get front()   { return this.get('front', null) }
  get script()  { return this.get('script', (kebabToPascalCase(this.id) + this.scType)) }
  get scType()  { return this.get('scType', '.scpt') }

  // Seules données à persister pour un service attaché à un projet — tout
  // le reste (script, name, group…) se retrouve via absData.
  toPersistData(){
    return {id: this.id, name: this.name, uuid: this.uuid, params: this.params}
  }

  // Donnée abstraite du service (ServiceData.js), retrouvée par id — jamais
  // de find(...) dans ALL_SERVICES_DATA, lookup direct dans la table.
  get absData(){ return SERVICES_DATA_TABLE[this.id] ?? raise(`[ERREUR SYSTÉMIQUE] Service introuvable : ${this.id}`) }

  /**
   * Construction dans le listing des services
   */
  build(contenant){
    const div = DCreate('DIV', {class:'service', id: this.id})
    div.setAttribute('draggable', true)
    const name = DCreate('DIV', {class:'name', text: this.name})
    div.appendChild(name)
    this.obj = div
    // console.log("this.constructor", this.constructor)
    contenant.appendChild(div)
    this.observe()
  }

  observe(){
    listen(this.obj, 'dragstart', e => e.dataTransfer.setData("id", this.id))

    // Pour les services communs, on les rend sensibles au click
    if (this.isCommonService) {
      listen(this.obj, 'click', this.duplicAndExecCommonServiceOn.bind(this, null))
    }
  } 

  // Appelée pour définir le service pour le projet, +projet+
  define(projet, callback){
    new ServiceDefiner(this, callback).define()
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
      message("Je dois apprendre à redéfinir le service")
      console.error("La redéfinition du service n'est pas encore implémentée.")
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
   * Appelée depuis le panneau
   * 
   * Cette fonction doit utiliser un duplicata du service, avec un 
   * uuid unique, pour ne pas changer params
   * 
   */
  duplicAndExecCommonServiceOn(projet, ev){
    const duplicat = this.duplicateService()
    duplicat.execCommonServiceOn(projet, ev)
  }
  
  duplicateService(){
    const dataDupService = Object.assign({}, this.data, {
      uuid: uniqId(), 
      oneShot: true /* destruction après exécution */
    })
    return new Service(dataDupService)
  }

  execCommonServiceOn(projet, ev){
    historize('-> execCommonServiceOn')
    projet = projet ?? Project.current
    if (ev?.metaKey) {
      return this.defineCommonServiceParameters(projet, true)
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
    if (projet.service_common_data && projet.service_common_data[this.id]) return true
    return this.defineCommonServiceParameters(projet, false /* 1re définition */)
  }

  defineCommonServiceParameters(projet, redefine = false){
    historize('-> defineCommonServiceParameters')
    this.unnamed = false // Pour ne pas redemander le nomage
    const definer = new ServiceDefiner(this, this.onReturnFromDefineProjetParams.bind(this, projet, this))
    definer.redefinition = redefine
    definer.define()
    return false    
  }

  onReturnFromDefineProjetParams(projet, service){
    projet.service_common_data = projet.service_common_data ?? {}
    Object.assign(projet.service_common_data, {[service.id]: service.params})
    console.log("Projet après définition des paramètres", projet, service)
    projet.save(this.execCommonServiceOn.bind(this, projet))
  }

}