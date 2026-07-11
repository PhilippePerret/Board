class Project {

  static uniqId(){
    return Date.now() + Math.random().toString(16).slice(2);
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
    const conf = new ConfirmDialog({
      title: "Importation d'un nouveau projet", 
      message: "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”.",
      width: '580px',
      ouiBtn: {title: 'OK', onclick: this.onProjectSelectedInFinder.bind(this), width: '160px'},
      nonBtn: {title: "Renoncer", onclick: null, width: '160px'},
    })
    conf.show()
  }

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
      id: Project.uniqId(),
      title: retour.data.name,
      workTime: 0
    }))
    new TextFieldDialog({
        title: "Nom du nouveau projet"
      , message: "Nom à donner à ce projet"
      , defaultValue: retour.data.name
      , ouiBtn: {name: "Appliquer", onclick: this.buildCardNewProject.bind(this, projet.id)}
    }).show()
    // Pour définir le titre à donner
  }
  static buildCardNewProject(idProject, aryTransData){
    const projet = Project.get(idProject)
    // console.log("idProjet", idProject, "projectName", projectName, "projet", projet)
    projet.title = aryTransData[0]
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
  }
  static maskProjectButtons(){
    this.divButtons.classList.add('invisible')
  }
  static get divButtons(){return this._dbutons || (this._dbutons = DGet('span#project-buttons')) }

  static removeProject(projet){
    reset()
    if (!projet) return error("Il faut sélectionner le projet à retirer.")
    new ConfirmDialog({
      title: "Confirmation du retrait du projet",
      message: "Ce retrait ne touche pas du tout le dossier du projet lui-même. Il est juste retiré du tablau de bord",
      ouiBtn: {name: "Retirer", onclick: projet.remove.bind(projet), w: '160px'},
      nonBtn: {name: 'Renoncer', w: '160px'}
    }).show()
  }

  /**
   * Appelée quand on clique sur une carte de projet
   */
  static onSelect(projet){
    const same = true && (projet.id === this.current?.id)
    this.current && this.deselect(this.current)
    if (same) return // simple désélection
    this.select(projet)
  }
  static select(projet){
    projet.obj.classList.add('selected')
    this.current = projet
    this.affProjectButtons()
  }
  static deselect(projet){
    projet.obj.classList.remove('selected')
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
    this.id         = data.id ?? Project.uniqId()
    this.title      = data.title ?? '-projet sans titre-'
    this.path       = data.path ?? raise("Le path du projet est obligatoire.")
    this.createdAt  = data.createdAt
    this.updatedAt  = data.updatedAt
    this.workTime   = data.workTime ?? 0
    this.services   = data.services ?? {startup: [], others: []}
    this.constructor.add(this)
    this.initServices()
    
  }

  initServices(){
    this.services.startup = (this.services.startup ?? []).map(ds => new Services(ds))
    this.services.others  = (this.services.others  ?? []).map(ds => new Services(ds))
  }

  save(){
    server.send({
      action: "save-project",
      data: {
        id:         this.id,
        title:      this.title,
        path:       this.path,
        workTime:   this.workTime,
        createdAt:  this.createdAt,
        updatedAt:  this.updatedAt,
        services:   this.services
      }
    }, this.afterSave.bind(this))
  }
  afterSave(retour){
    console.log("retour", retour)
    message("Projet « " + this.title + ' » enregistré avec succès à ' + heureCourante() + '.')
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
      startupservice.exec(null /* event */, this.startStartupServices.bind(this))
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
      this.title = aryData[0]
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
    // console.log("-> preAddService", service)
    service.define(this, this.addService.bind(this, service, where))
  }
  addService(service, where /* others ou startup */){
    service.uuid = Project.uniqId()
    service.type = where
    this.services[where].push(service)
    const startup = (where == 'startup')
    const card = this.getServiceCard(service)
    this[startup?'startupField':'othersField'].appendChild(card)
    this.save()
  }

  getServiceCard(service){
    return service.projectCard(this)
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
    Services.remove(service.uuid)
    this.save()
  }



  buildCard(){
    if (this.obj) this.obj.remove()
    const divId = `project-${this.id}`
    const div = DCreate('DIV', {id: divId, class: 'project', role: 'group'})
    div.dataset.projectId = this.id
    this.obj = div
    const tit = DCreate('DIV', {id: `${divId}-title`, class:'title', text: this.title, title: 'Cliquer pour modifier le titre', style: 'display:inline-block;'})
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

    this.startupField = DCreate('FIELDSET', {class:'services'})

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
      const startupContainer = DCreate('DIV', {class:'startup-services', style:'position:relative;min-height:100px;'})
      const divSServices = DCreate('DIV', {id:'startup-services', class: 'hidden'})
      const divBtnStartup = DCreate('DIV', {class:'service'})
      this.btnStartup = DCreate('DIV', {class:'name', text: 'GO !'})
      // Avec des services au démarrage
      startupServices.forEach((service) => {
        divSServices.appendChild(this.getServiceCard(service))
      })
      divBtnStartup.appendChild(this.btnStartup)
      startupContainer.appendChild(divBtnStartup)
      startupContainer.appendChild(divSServices)
      this.startupField.appendChild(startupContainer)
      listen(startupContainer, 'mouseenter', function(ev){
        setTimeout(function(){divSServices.classList.remove('hidden')}, 1000)
      })
      listen(startupContainer, 'mouseleave', ev => {divSServices.classList.add('hidden')})
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


  observe(){

    // Lancer les sercices de démarrage
    if (this.btnStartup) {
      listen(this.btnStartup, 'click', this.startStartupServices.bind(this))
    }
    // Pour pouvoir modifier le titre
    listen(this.divTitle, 'click', this.modifyTitle.bind(this))
    this.obj.addEventListener('dblclick', this.onDblClick.bind(this))
    this.obj.addEventListener('mousedown', this.onMouseDown.bind(this))
    
    let dragged = null

    this.startupField.addEventListener("dragover", e => {e.preventDefault()})
    this.startupField.addEventListener("drop", e => {
        e.preventDefault();
        const service = Services.get(e.dataTransfer.getData("id"))
        // console.log("Drop sur la zone startup", service)
        this.addStartupService(service)
      })

    this.othersField.addEventListener("dragover", e => e.preventDefault())
    this.othersField.addEventListener("drop", e => {
          e.preventDefault();
          const service = Services.get(e.dataTransfer.getData("id"))
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
  afterRemove(retour){
    this.obj.remove()
    message("Le projet “" + this.title + "” a été retiré du tableau de bord.")
  }
}