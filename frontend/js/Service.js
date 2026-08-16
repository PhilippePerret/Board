class Service {

  static init(){
    // Construire les deux panneaux avant de les build : chacun a besoin de
    // l'autre déjà construit (this.oppositePanel) au moment de son build()
    // pour savoir s'il doit créer son bouton de bascule.
    const custom = this._cuspanel = new CustomPanel()
    const common = this._companel = new CommonPanel()
    custom.build()
    common.build()
  }

  static get CustomPanel(){ return this._cuspanel || (this._cuspanel = this.defineAndBuildCustomPanel() )}
  static get CommonPanel(){ return this._companel || (this._companel = this.defineAndBuildCommonPanel())}
  static defineAndBuildCustomPanel(){
    const pan = new CustomPanel()
    pan.build()
    return pan
  }
  static defineAndBuildCommonPanel(){
    const pan = new CommonPanel()
    pan.build()
    return pan
  }
  // Parce qu'on commence toujours par celui-ci
  static showCommonPanel(){
    this.CommonPanel.open()
  }
  static maskCommonPanel(){
    this.CommonPanel.close()
    this.CustomPanel.close()
  }

  /**
   * Jouer un service hors d'un click
   * 
   * Inauguré par exemple pour le panneau d'erreur, quand le bouton
   * "OK" permet une action. Lors de l'actualisation de la docu, si
   * une erreur survient, on peut demander l'édition de cette docu
   * par ce biai en jouant le service 'edit-documentation'
   */
  static runService(serviceId) {
    console.error("Je dois apprendre à jouer un service", serviceId)
    const serv = this.get(serviceId)
  }

  /**
   * Jouer un code javascript lors d'un click
   */
  static evalJavascript(project, params){
    console.log("project, params", project, params)
    const code = params[0]
    try {
      eval(code)
    } catch(err) {
      new ErrorsDialog({
        errors: err?.message?.split("\n") || err
      }).show()
    }
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

  // Retirer le service défini
  static remove(serviceUUID){
    delete this.services[serviceUUID]
  }

  constructor(data){ D.on && D.trace(data)
    // console.log("data Service", data)
    this.id     = data.id || raise("[System] Il faut fournir un identifiant au service.")
    this._ownData = data
    /**
     * Les paramètres du service. Attention, là aussi les données des services réels (dans projet)
     * sont différentes des données abstraites qui définissent ce qu'il faut pour
     * définir le service. (??? qu'est-ce que ça signifie ???)
     */
    this.params     = data.params || raise("[SYSTEM] Il faut définir les :params du servive " + this.id)
    this.uuid       = data.uuid ?? null
    this.type       = data.type ?? null // idem (others ou startup)
    this.onError    = data.onError
    this.beforeExec = data.beforeExec
    this.bypassExec = data.bypassExec
    this.projectId  = data.projectId ?? null // pas encore mis (voir si utile)
    this.afterDefinedParams = data.afterDefinedParams ?? SERVICES_DATA_TABLE[data.id]?.afterDefinedParams ?? null
    this.constructor.get(this.uuid || this.id) && raise(`[SYSTEM] L'id '${this.id}' existe déjà…`)
    this.constructor.add(this)
    this.isCommonService = (this.stype === 'common')
    this.isCustomService = (this.stype === 'custom')
    this.isScriptService = (this.id == 'run-script-service')
    // Pour essayer, j'ajoute le service dans tous les paramètres
    this.params.forEach(param => Object.assign(param, {service: this}))
  }


  /************************************************************/
  /*            EXÉCUTION DU SERVICE                          */
  /************************************************************/
  exec(projet, ev, callback){ D.on && D.trace([projet, ev, callback], 'Service.')
    // console.log("callback dans Service#exec", this, callback)
    new ServiceExecuter(this).exec(projet, callback)
    // console.log("Service#exec se termine bien")
  }


  get data(){ return Object.assign({}, this.absData, this._ownData) }
  setData(prop, value){ this._ownData[prop] = value }

  get(key, defValue = null) {return this.data[key] ?? this.absData[key] ?? defValue}

  get name()    { return this.get('name') || raise(getErr('service-requires-a-name', this.id)) }
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
    var nameLabel = this.name
    if (this.data.aide) nameLabel += aide(this.data.aide)
    const divName = DCreate('DIV', {class:'name', text: nameLabel})
    div.appendChild(divName)
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
    new ServiceDefiner(this, callback, projet).define()
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
   *
   * Un service "startup" reste individuellement cliquable (au même titre
   * qu'un service "others") : lancés tous ensemble au démarrage, ils
   * doivent quand même pouvoir être relancés un par un (ex. rouvrir une
   * seconde fois une fenêtre du projet) ou redéfinis (cmd+clic).
   */
  observeServiceCard(projet, card){
    listen(card, 'click', this.onClickOnProjectService.bind(this, projet))
    listen(card, 'dragstart', e => {
      projet.draggedService = this
      // La carte elle-même (celle qui se déplace en direct entre les
      // autres pendant le survol, cf. dragover ci-dessous) doit rester
      // reconnaissable — sinon confondue avec un bouton normal une fois
      // "posée" entre deux autres services. setTimeout(0) : WebKit capture
      // l'image de glissé (le bouton "volant" qui suit le curseur) juste
      // APRÈS ce handler dragstart, pas avant — sans ce délai, le bouton
      // volant récupère aussi le bord pointillé rouge, ce qu'il ne doit
      // JAMAIS faire (lui doit garder l'aspect normal, seule la carte
      // intercalée entre les autres doit changer d'aspect).
      setTimeout(() => card.classList.add('service-drag-ghost'), 0)
    })
    // Réordonnement : lâché sur un AUTRE service de la même liste (même
    // .type, startup ou others) — le nœud DOM du service glissé est
    // déplacé dès le survol, pas seulement au drop (retour visuel
    // immédiat). preventDefault() ici change dropEffect (plus "none"),
    // ce qui empêche le retrait ci-dessous de se déclencher.
    listen(card, 'dragover', e => {
      const dragged = projet.draggedService
      if (!dragged || dragged === this || dragged.type !== this.type) return
      e.preventDefault()
      const rect = card.getBoundingClientRect()
      const before = (e.clientY - rect.top) < rect.height / 2
      card.parentNode.insertBefore(dragged.projectCard, before ? card : card.nextSibling)
    })
    listen(card, 'dragend', e => {
      card.classList.remove('service-drag-ghost')
      if (e.dataTransfer.dropEffect != "none") {
        projet.persistServiceOrder(this.type)
        return
      }
      projet.removeServiceFromListe();
    })
  }

  onClickOnProjectService(projet, ev){
    if (ev.shiftKey) {
      message(getMsg('Learn-to-select-the-service'))
    } else if (ev.metaKey) {
      this.redefine(projet)
    } else {
      this.exec(projet, ev)
    }
  }

  /**
   * RE-DÉFINITION D'UN SERVICE (après affection déjà opérée)
   * (répond à cmd+clic sur service dans le projet)
   * 
   * Note : si c'est un *script-service*, on demande d'abord s'il ne
   * faut pas tout simplement l'ouvrir.
   */
  redefine(projet, retour){
    historize('-> Service#redefine')
    // Si c'est un script-service, on demande d'abord s'il faut
    // ouvrir le script
    if ( this.isScriptService ) {
      if (retour === true) {
        server.send({action:'open-file', path: this.params[0][0]}, null)
        return
      } else if (retour === false) {
        // On poursuit pour définir les autres paramètres
      } else {
        new ConfirmDialog({
            title: getMsg('Opening-script-file') 
          , message: getMsg('ask-for-modify-script-file')
          , ouiBtn: {name: getMsg('btn-yes'), onclick: this.redefine.bind(this, projet, true)}
          , nonBtn: {name: getMsg('btn-no'), onclick: this.redefine.bind(this, projet, false)}
        }).show()
        return
      }
    }
    const schemaParams = this.absData.afterDefinedParams
      ? this.absData.params
      : this.absData.params.map((p, i) => {
          const current = this.params[i]
          if (Array.isArray(current)) {
            return current.length === 1 ? Object.assign({}, p, {actual: current[0]}) : p
          }
          return current === undefined ? p : Object.assign({}, p, {actual: current})
        })

    this.unnamed = true
    this.params  = schemaParams
    projet.lockSave()

    const definer = new ServiceDefiner(this, () => {
      const nameEl = this.projectCard?.querySelector?.('.name')
      if (nameEl) nameEl.textContent = this.name
      projet.unlockSave()
      projet.save()
    }, projet)
    definer.define()
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
        uuid: uniqId()
      , params: this.data.params.map(p => Object.assign({}, p))
    })
    return new Service(dataDupService)
  }

  execCommonServiceOn(projet, ev){
    historize('-> execCommonServiceOn')
    projet = projet ?? Project.current
    if (ev?.metaKey) {
      return this.defineCommonServiceParameters(projet)
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
    historize("-> ensureServiceData", projet)
    const stored = projet.common_services_data && projet.common_services_data[this.id]
    if (!stored) return this.defineCommonServiceParameters(projet)
    // this.params.length = nombre de paramètres attendus par le schéma
    // courant (ServiceData.js) : peut avoir grandi depuis la dernière
    // définition persistée pour ce projet (ex. ajout d'un paramètre).
    if (stored.length !== this.params.length) {
      return error('project-data-invalid-bad-count', [
          projet.title, this.name, this.params.length, stored.length
        , this.params.length == 1 ? '' : 's', stored.length == 1 ? '' : 's'
      ])
    }
    return true
  }

  defineCommonServiceParameters(projet){
    historize('-> defineCommonServiceParameters')
    this.unnamed = false // Pour ne pas redemander le nomage
    const definer = new ServiceDefiner(this, this.onReturnFromDefineProjetParams.bind(this, projet, this), projet)
    definer.define()
    return false
  }

  onReturnFromDefineProjetParams(projet, service){
    const realParamsValues = [...service.params]
    projet.common_services_data = projet.common_services_data ?? {}
    Object.assign(projet.common_services_data, {[service.id]: realParamsValues})
    console.log("Projet après définition des paramètres", projet, service)
    projet.save(() => {
      new ServiceExecuter(this).execOnProject(projet)
    })
  }

}