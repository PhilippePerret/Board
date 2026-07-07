class Project {

  static uniqId(){
    return Date.now() + Math.random().toString(16).slice(2);
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
      if (retour.data.error == 'Not a folder') return error('Il faut impérativement choisir un dossier.')
    }
    const projet = new Project(Object.assign(retour.data, {
      id: Project.uniqId(),
      title: retour.data.name,
      workTime: 0
    })).buildCard()
    const confirm = new ConfirmDialog({
      title: "Confirmation de l'import",
      message: "Si tu es d'accord avec ces données, clique le bouton “Importer”", // TODO ajouter les infos
      ouiBtn: {name:"Importer", onclick: projet.save.bind(projet), w: '160px'},
      nonBtn: {name: "Renoncer", w: '160px'}
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
  
  static dispatch(retour){
    // console.log("retour", retour)
    message("Travaux courants chargés.")
    feedback(JSON.stringify(retour))
    retour.data.forEach(projectCard => new Project(projectCard).buildCard())
    message("Projets courants affichés.")
    } 
  static get container(){ return this._container || (this._container = document.querySelector('#project-cards-container'))}



  constructor(data){
    console.log("data", data)
    this.id         = data.id ?? Project.uniqId()
    this.title      = data.title ?? '-projet sans titre-'
    this.path       = data.path ?? raise("Le path du projet est obligatoire.")
    this.createdAt  = data.createdAt
    this.updatedAt  = data.updatedAt
    this.workTime   = data.workTime ?? 0
    this.services   = data.services ?? {startup: [], others: []}
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
    const card = service.projectCard()
    this.observeServiceCard(service, card)
    return card
  }
  observeServiceCard(service, card){
    listen(card, 'dragstart', e => this.draggedService = service)
    listen(card, 'dragend', e => {
      if (e.dataTransfer.dropEffect != "none") return
      this.removeServiceFromListe();
    })
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
    const div = DCreate('DIV', {id: this.id, class: 'project'})
    this.obj = div
    const tit = DCreate('DIV', {class:'title', text: this.title})
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

    this.startupField = DCreate('FIELDSET')
    const legendstartup = DCreate('LEGEND', {text:'Services au démarrage'})
    this.startupField.appendChild(legendstartup)
    ;(this.services.startup ?? []).forEach((service) => {
      this.startupField.appendChild(this.getServiceCard(service))
    })
    div.appendChild(this.startupField)

    this.othersField = DCreate('FIELDSET')
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
    this.constructor.deselect(this)
    this.obj.remove()
    message("Le projet “" + this.title + "” a été retiré du tableau de bord.")
  }
}