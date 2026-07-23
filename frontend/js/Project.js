class Project {

  // Toutes les propriétés des projets doivent être définies ici
  // common_services_data : données pour les services communs
  static PROPERTIES = [
    'id', 'title', 'path', 'common_services_data', 'workTime', 'createdAt', 'updatedAt',
    'services', 'background', 'icon', 'genre',
    // documentation
    'docu-folder', 'docu-main-file-adoc', 'docu-main-file-html',
    // Pour les services (notamment les script-services)
    'service_data'

  ]

  static get current(){ return this._current}
  static set current(p){
    this._current = p
    this.markCurrentProject.textContent = p?.title ?? ""
  }
  static get markCurrentProject(){
    return this._markcurproj || (this._markcurproj = DGet('#current-project-mark'))
  }

  /**
   * Chargement de tous les projets
   * ------------------------------
   * On remonte les données de tous les projets + leur ordre, 
   * défini dans appdata['projects-in']
   */
  static initAllProjects(projectsData){
    historize("-> Project#initAllProjects")
    // Note : les projest sont remontés classés
    this.sortedProjects = projectsData
    this.sortedProjects.map(dataProjet => {
      new Project(dataProjet).buildCard()
    })
    message("Projets courants affichés.")
  } 

  // Boucler une méthode sur tous les projets
  static mapAll(method) {
    if ('string' == typeof method) {
      this.sortedProjects.map(projet => projet[methdod].call(projet))
    } else {
      this.sortedProjects.map(projet => method(projet))
    }
  }

  // 
  /**
   * === CRÉATION D'UN NOUVEAU PROJET ===
   * 
   * Appelé quand on clique sur le bouton "+"
   * 
   * La fonction affiche un panneau indiquant qu'il faut choisir le projet
   * dans le Finder puis cliquer "OK" pour le prendre en compte.
   */
  static addProject(){
    reset()
    new ConfirmDialog({
        title: "Importation d'un nouveau projet"
      , message: "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”."
      , width: '580px'
      , ouiBtn: {name: 'OK', onclick: this.onProjectSelectedInFinder.bind(this), width: '160px'}
      , midBtn: {name: 'Archives…', onclick: ProjectArchives.chooseArchivedProject.bind(ProjectArchives), enable: App.getData('projects-out').length > 0}
      , nonBtn: {name: "Renoncer", onclick: null, width: '160px'}
    }).show()
  }

  /**
   * Fonction appelée par le bouton "Extra data"
   * 
   * Définition des extra-data du projet courant
   */
  static defineExtraData(){
    if (this.current) {
      this.current.defineExtraData.call(this.current)
    } else {
      // Ne devrait pas arriver
      erreur("Aucun projet courant.")
    }
  }

  // Sélection du projet dans le Finder
  static onProjectSelectedInFinder(){
    server.send({action: 'getInfoFinderSelection', type: 'folder'}, this.onRetourInfoFinderProjet.bind(this))
  }
  static onRetourInfoFinderProjet(retour){
    // console.info("Retour : ", retour)
    if (retour.data.ok === false) {
      if (retour.data.error == 'Not a folder') return error(getErr('folder-required'))
      else if (retour.data.error == 'No selection') return error(getErr('project-folder-not-selected'))
    }
    const projet = new Project(Object.assign(retour.data, {
        id: uniqId()
      , title: retour.data.name
      , workTime: 0
    }))
    new TextFieldDialog({
        title: "Nom du nouveau projet"
      , message: "Nom à donner à ce projet"
      , defaultValue: retour.data.name
      , ouiBtn: {name: "Appliquer", onclick: this.buildCardNewProject.bind(this, projet.id)}
    }).show()
    // Pour définir le titre à donner
  }
  static buildCardNewProject(idProject, title){
    const projet = Project.get(idProject)
    // console.log("idProjet", idProject, "projectName", projectName, "projet", projet)
    projet.title = title
    projet.buildCard()
    const confirm = new ConfirmDialog({
        title: "Confirmation de l'import"
      , message: "Si tu es d'accord avec ces données, clique le bouton “Importer”"
      , ouiBtn: {name:"Importer", onclick: projet.save.bind(projet), w: '160px'}
      , nonBtn: {name: "Renoncer", w: '160px'}
      , unscrimmed: true

    }).show()
  }


  // Pour afficher et masquer les boutons du projet sélectionné
  static affProjectButtons(){
    this.divButtons.classList.remove('invisible')
    Service.showCommonPanel()
  }
  static maskProjectButtons(){
    this.divButtons.classList.add('invisible')
    Service.maskCommonPanel()
  }
  static get divButtons(){return this._dbutons || (this._dbutons = DGet('span#project-buttons')) }

  /**
   * Méthode pour retirer le projet (appelé par le bouton moins)
   * 
   * Deux solutions : soit archiver le projet, soit le retirer complètement
   */
  static removeCurrentProject(projet){
    projet = this.current
    if (!projet) return error("Il faut sélectionner le projet à retirer.")
    new ConfirmDialog({
        title: "Confirmation du retrait du projet"
      , width: '660px'
      , message: getMsg('expli-retrait-projet', projet.title)
      , ouiBtn: {name: `${svg('archive', 'btn')}Archiver`, onclick: projet.archive.bind(projet)}
      , midBtn: {name: `${svg('bagx','btn')}Retirer`, onclick: projet.remove.bind(projet)}
      , nonBtn: {name: 'Renoncer'}
    }).show()
  }

  /**
   * Appelée quand on clique sur une carte de projet
   */
  static onSelect(projet){
    const same = (projet.id === this.current?.id)
    const reopenExtraData = !same && App.currentPanel instanceof ProjectExtraDataPanel
    this.current && this.deselect(this.current)
    same || this.select(projet)
    if (reopenExtraData) projet.defineExtraData()
  }

  static select(projet){
    projet.obj.classList.add('selected')
    this.current = projet
    this.affProjectButtons()
  }
  static deselect(projet){
    projet.obj.classList.remove('selected')
    if (App.currentPanel instanceof ProjectExtraDataPanel) App.currentPanel.close()
    this.current = null
    this.maskProjectButtons()
  }
  
  static get container(){ return this._container || (this._container = document.querySelector('#project-cards-container'))}

  static get ensureProjects() {
    return this._projects ?? (this._projects = {})
  }
  static get(idProject){
    return this.ensureProjects[idProject]
  }
  static add(project){
    Object.assign(this.ensureProjects, {[project.id]: project})
  }
  static remove(idProject){
    if (idProject.id) idProject = idProject.id
    delete this.ensureProjects[idProject]
    if (this.current?.id  == idProject) this.constructor.deselect(this.current)
    message("Projet retiré de la liste des projets.")
  }



  // ---- Pour déplacer le projet couvant
  static moveCurrentToLeft(){
    const proj = this.current
    proj.obj.parentNode.insertBefore(proj.obj, proj.obj.previousSibling)
    App.updateData('projects-in')
  }
  static moveCurrentToRight(){
    const proj = this.current
    proj.obj.parentNode.insertBefore(proj.obj, proj.obj.nextSibling?.nextSibling)
    App.updateData('projects-in')
  }
  // Retourne le nouvel ordre
  static getProjectsOrder(){
    return DGetAll('div.project', this.container).map( div => div.dataset.projectId)
  }


  constructor(data){
    console.log("data", data)
    this.constructor.PROPERTIES.forEach(prop => this[prop] = data[prop])
    this.data = data
    if (!this.id ) this.id = uniqId()
    if (!this.title) this.title = '-projet sans titre-'
    if (!this.path ) raise("Le path du projet est obligatoire.")
    if (!this.services) this.services = {startup: [], others: []}
    this.constructor.add(this)
    this.initServices()
    
  }

  get(key){ return this[key] ?? this.data[key] ?? (this.service_data && this.service_data[key])}
  set(key, val, callback = false){ // ça part du principe que s'il faut enregistrer, il faut un callback
    if (this.constructor.PROPERTIES.indexOf(key) > -1) {
      this[key] = val
    } else {// une donnée service
      this.service_data = this.service_data ?? {}
      Object.assign(this.service_data, {[key]: val})
    }
    callback && this.save(callback)
  }

  initServices(){
    this.services.startup = (this.services.startup ?? []).map(ds => new Service(Object.assign({}, ds, {type: 'startup'})))
    this.services.others  = (this.services.others  ?? []).map(ds => new Service(Object.assign({}, ds, {type: 'others'})))
  }

  save(callback){
    const newData = {}
    this.constructor.PROPERTIES.forEach(prop => {
      if (prop === 'services') {
        newData.services = {
            startup: (this.services?.startup ?? []).map(s => s.toPersistData())
          , others:  (this.services?.others  ?? []).map(s => s.toPersistData())
        }
      } else {
        newData[prop] = this[prop]
      }
    })
    server.send(
        {action: "save-project", data: newData}
      , this.afterSave.bind(this, callback))
  }
  afterSave(callback, retour){
    console.log("retour Project.afterSave et callback", retour, callback)
    message("Projet « " + this.title + ' » enregistré avec succès à ' + heureCourante() + '.')
    callback && callback()
  }

  get extraDataPanel(){ return this._extradatapan || (this._extradatapan = new ProjectExtraDataPanel(this) )}
  
  defineExtraData(){
    this.extraDataPanel.toggle()
  }

  /**
   * Quand on clique sur le bouton de démarrage, on doit lancer tous
   * les services de démarrage
   */
  startStartupServices(ev){
    if (undefined == this.startupservices) this.startupservices = [...this.services.startup].reverse()
    const startupservice = this.startupservices.pop()
    if (startupservice) {
      message(`Lancement du service ${startupservice.name}…`)
      startupservice.exec(this, null /* event */, this.startStartupServices.bind(this))
    } else {
      message("Fin de démarrage du projet.")
    }
    return stopEvent(ev)
  }

  /* Modification du titre (click sur titre) */
  modifyTitle(ev, aryData) {
    if (undefined == aryData) {
      stopEvent(ev)
      new TextFieldDialog({
          title: "Modification du titre du projet"
        , message: "Nom à donner à ce projet"
        , defaultValue: this.title
        , ouiBtn: {name: "Appliquer", onclick: this.modifyTitle.bind(this, null)}
      }).show()
      return false
    } else {
      // Enregistrement du titre
      this.title = aryData
      this.divTitle.textContent = this.title
      this.save()
    }
  }
  /**
   * 
   * === MÉTHODES D'AJOUT DES SERVICES ===
   */
  addStartupService(service){
    this.preAddService(service, 'startup')
  }
  addOtherService(service){
    this.preAddService(service, 'others')
  }
  preAddService(service, where){
    console.log("-> preAddService", service)
    service = service.duplicateService()
    service.define(this, this.addService.bind(this, service, where))
  }
  addService(service, where /* others ou startup */){
    service.type = where
    this.services[where].push(service)
    const card = this.getServiceCard(service)
    if (where == 'startup') {
      // Premier service au démarrage ajouté en direct (glisser-déposer, pas
      // au chargement) : le bouton "GO !" et son conteneur n'existent pas
      // encore (buildCard() ne les crée que si hasStartup était vrai AU
      // CHARGEMENT) — on les construit ici à la demande, une seule fois.
      this.buildStartupContainer()
      this.divSServices.appendChild(card)
    } else {
      this.othersField.appendChild(card)
    }
    this.save()
  }

  getServiceCard(service){
    return service.projectCard(this)
  }

  // Construit le bouton "GO !" + son conteneur masqué (révélé par
  // meta+clic, cf. _dev/Manuel/adocs/_TODO_.adoc) — qui reçoit les cartes des
  // services au démarrage. Idempotent, pour être appelable aussi bien depuis
  // buildCard() (chargement, services déjà présents) que depuis addService()
  // (premier ajout en direct).
  buildStartupContainer(){
    if (this.startupContainer) return this.startupContainer
    const startupContainer = DCreate('DIV', {id:`${this.obj.id}-startup-container`, class:'startup-services', role: 'group'})
    const divSServices = DCreate('DIV', {id:`${this.obj.id}-startup-services`, class: 'startup-services-panel hidden', role: 'group'})
    const divBtnStartup = DCreate('DIV', {class:'service'})
    this.btnStartup = DCreate('DIV', {text: 'GO !', id:`${this.obj.id}-btn-startup`, class:'name'})
    divBtnStartup.appendChild(this.btnStartup)
    startupContainer.appendChild(divBtnStartup)
    startupContainer.appendChild(divSServices)
    this.startupField.appendChild(startupContainer)
    // → survol : astuce dans le footer (message(), pas un div sous le bouton)
    listen(startupContainer, 'mouseenter', ev => message('Meta+clic pour montrer les services'))
    listen(startupContainer, 'mouseleave', ev => message(''))
    listen(startupContainer, 'click', ev => {
      if (!ev.metaKey) return
      divSServices.classList.toggle('hidden')
    })
    // → meta+clic sur GO lui-même : révèle seulement, ne lance rien
    listen(this.btnStartup, 'click', ev => {
      if (ev.metaKey) return
      this.startStartupServices()
    })
    this.startupContainer = startupContainer
    this.divSServices = divSServices
    return startupContainer
  }

  /**
   * SUPPRIMER UN SERVICE
   * ---------------------
   */
  removeServiceFromListe(){
    const service = this.draggedService
    service.projectCard.remove()
    message(`Service supprimé (${service.uuid})`)
    this.services[service.type] = this.services[service.type].filter(s => s.uuid != service.uuid)
    Service.remove(service.uuid)
    // Plus aucun service au démarrage : le bouton "GO !" (et son conteneur)
    // n'a plus lieu d'être — le retirer, et remettre à zéro les références
    // pour que buildStartupContainer() le reconstruise proprement si un
    // service au démarrage est réattaché ensuite.
    if (service.type == 'startup' && this.services.startup.length == 0 && this.startupContainer) {
      this.startupContainer.remove()
      this.startupContainer = null
      this.divSServices = null
      this.btnStartup = null
    }
    this.save()
  }

  buildIcon(){
    const iconPath = `file://${this.path}/${this.icon}`
    const icon = DCreate('IMG', {src: iconPath, style: 'width:32px;float:left;margin-right:0.4em'})
    return icon
  }

  buildCard(){
    if (this.obj) this.obj.remove()
    const divId = `project-${this.id}`
    this.divId = divId
    const div = DCreate('DIV', {id: divId, class: 'project', role: 'group'})
    div.dataset.projectId = this.id
    if (this.background) {
      this.setBackground(div, this.background)
    }
    this.obj = div
    if (this.icon){
      div.appendChild(this.buildIcon())
    }
    const tit = DCreate('DIV', {id: `${divId}-title`, class:'title', text: this.title, title: 'Cliquer pour modifier le titre', style: 'display:inline-block;z-index:1;'})
    this.divTitle = tit
    div.appendChild(tit)
    const path  = DCreate('DIV', {class:'path', text: this.path})
    div.appendChild(path)
    const dates = DCreate('DIV', {class: 'dates'})
    div.appendChild(dates)
    const crea  = DCreate('SPAN', {class: 'date', text: 'créé : ' + this.createdAt})
    dates.appendChild(crea)
    const upda  = DCreate('SPAN', {class: 'date', text: '/mod.: ' +this.updatedAt})
    dates.appendChild(upda)
    const work = DCreate('DIV', {class: 'worktime', text: 'Temps de travail : ' + this.workTime})
    div.appendChild(work)

    this.startupField = DCreate('FIELDSET', {id: `${divId}-startup-field`, class:'services'})

    /**
     * Fieldset des SERVICES AU DÉMARRAGE
     * 
     * S'il n'y en a pas, on fait l'affichage normal. S'il y en a,
     * on les met dans un div qui sera masqué et l'on mettra un gros
     * bouton "Démarrer" qui lancera tous les services. Quand on laissera
     * la souris sur le bouton, le div contenant tous les services 
     * apparaitra, permettant d'en choisir un.
     */
    const legendstartup = DCreate('LEGEND', {text:'Services au démarrage'})
    this.startupField.appendChild(legendstartup)
    const startupServices = this.services.startup ?? []
    const hasStartup = startupServices.length > 0
    if ( hasStartup ) {
      this.buildStartupContainer()
      // Avec des services au démarrage
      startupServices.forEach((service) => {
        this.divSServices.appendChild(this.getServiceCard(service))
      })
    }
    div.appendChild(this.startupField)

    this.othersField = DCreate('FIELDSET', {id: `${divId}-others-field`, class:'services'})
    const legendautre = DCreate('LEGEND', {text: 'Autres services'})
    this.othersField.appendChild(legendautre)
    ;(this.services.others ?? []).forEach((service) => {
      this.othersField.appendChild(this.getServiceCard(service))
    })
    div.appendChild(this.othersField)

    this.constructor.container.appendChild(div)
    this.observe()
  }

  // Détacché pour pouvoir être actualisé
  setBackground(div, background){
    const imgId       = `${this.divId}-bgimg`
    const imgDomFond  = DGet(`#${imgId}`)
    div = div ?? this.obj
    console.log("background, DIV, imgDomFond", {background:background, div:div, imgFond:imgDomFond})
    if (background == 'none')  {
      div.style.background = ''
      imgDomFond && imgDomFond.remove()
      return 
    } else if (background[0] == '#' || background.startsWith('rgb')) {
      // Appliqué ci-dessous
    } else {
      // Puisqu'il n'y a pas de paramètre opacity pour l'image de fond,
      // on utile un détour : on affiche vraiment une image
      const imgFond     = DCreate('IMG', {id: imgId, src: this.background, style:'opacity:0.5;position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;'})
      if ( imgDomFond ) {
        // Update
        imgDomFond.replaceWith(imgFond)
      } else {
        // Création
        div.appendChild(imgFond)
      }
      background = ''
    }
    div.style.background = background

  }

  observe(){

    // Pour pouvoir modifier le titre
    listen(this.divTitle, 'click', this.modifyTitle.bind(this))
    this.obj.addEventListener('dblclick', this.onDblClick.bind(this))
    this.obj.addEventListener('mousedown', this.onMouseDown.bind(this))
    
    let dragged = null

    this.startupField.addEventListener("dragover", e => {e.preventDefault()})
    this.startupField.addEventListener("drop", e => {
        e.preventDefault();
        const service = Service.get(e.dataTransfer.getData("id"))
        // console.log("Drop sur la zone startup", service)
        this.addStartupService(service)
      })

    this.othersField.addEventListener("dragover", e => e.preventDefault())
    this.othersField.addEventListener("drop", e => {
          e.preventDefault();
          const service = Service.get(e.dataTransfer.getData("id"))
          // console.log("Drop sur la zone autres services", service)
          this.addOtherService(service)
      })
  }

  onDblClick(ev){
    message("Édition du projet " + this.title)
  }
  onMouseDown(ev){
    if (!ev.target.closest(".service")) {
      this.constructor.onSelect(this)
      return stopEvent(ev)
    } else {
      return true
    }
  }

  remove(){
    server.send({action: 'remove-project', projectId: this.id}, this.afterRemove.bind(this))
  }
  // Archivage du projet
  archive(){
    server.send({action: 'archive-project', projectId: this.id}, this.afterRemove.bind(this))

  }
  afterRemove(retour){
    this.obj.remove()
    if (this.id == this.constructor.current.id) this.constructor.deselect(this)
    App.setData('projects-in', retour.data.newProjectsIn)
    App.setData('projects-out', retour.data.newProjectsOut)
  }
}