class Project {

  static uniqId(){
    return Date.now() + Math.random().toString(16).slice(2);
  }

  /**
   * Appelée quand on clique sur une carte de projet
   */
  static onSelect(projet){
    const same = projet.id == this.current?.id
    this.current && this.deselect(this.current)
    if (same) return // simple désélection
    this.select(projet)
  }
  static select(projet){
    projet.obj.classList.add('selected')
    this.current = projet
  }
  static deselect(projet){
    projet.obj.classList.remove('selected')
    this.current = null
  }
  
  static dispatch(retour){
    console.log("retour", retour)
    message("Travaux courants chargés.")
    feedback(JSON.stringify(retour))
    retour.data.forEach(projectCard => new Project(projectCard).buildCard())
    message("Projets courants affichés.")
    } 
  static get container(){ return this._container || (this._container = document.querySelector('#project-cards-container'))}



  constructor(data){
    this.id     = data.id ?? Project.uniqId()
    this.title = data.title ?? '-projet sans titre-'
    this.path  = data.path ?? raise("Le path du projet est obligatoire.")
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.workTime   = data.workTime ?? 0
    this.startupServices  = data.startup_services ?? []
    this.autresServices   = data.autres_services ?? []
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
        services: {
          startup:  this.startupServices,
          autres:   this.autresServices
        }
      }
    }, this.afterSave.bind(this))
  }
  afterSave(retour){
    console.log("retour", retour)
    message("Projet « " + this.title + ' » enregistré avec succès.')
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
    const upda  = DCreate('SPAN', {class: 'date', text: 'modifié : ' +this.updatedAt})
    dates.appendChild(upda)
    const work = DCreate('DIV', {class: 'worktime', text: 'Temps de travail : ' + this.workTime})
    div.appendChild(work)

    const startup = DCreate('FIELDSET')
    const legendstartup = DCreate('LEGEND', {text:'Services au démarrage'})
    startup.appendChild(legendstartup)
    this.startupServices.forEach(service => {
      startup.appendChild(service.build())
    })
    div.appendChild(startup)

    const otherservices = DCreate('FIELDSET')
    const legendautre = DCreate('LEGEND', {text: 'Autres services'})
    otherservices.appendChild(legendautre)
    this.autresServices.forEach(service => {
      otherservices.appendChild(service.build())
    })
    div.appendChild(otherservices)

    this.constructor.container.appendChild(div)
    this.observe()
  }
  observe(){
    this.obj.addEventListener('dblclick', this.onDblClick.bind(this))
    this.obj.addEventListener('mousedown', this.onMouseDown.bind(this))
  }

  onDblClick(ev){
    message("Édition du projet " + this.title)
  }
  onMouseDown(ev){
    Project.select(this)
    return stopEvent(ev)
  }
}