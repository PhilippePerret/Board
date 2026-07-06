class Project {

  static uniqId(){
    return Date.now() + Math.random().toString(16).slice(2);
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
    const div = DCreate('DIV', {id: this.id, class: 'project-card'})
    this.obj = div
    const tit = document.createElement('DIV')
    tit.className = 'title'
    tit.textContent = this.title
    div.appendChild(tit)
    const startup = document.createElement('FIELDSET')
    const legendstartup = document.createElement('LEGEND')
    legendstartup.textContent = 'Services au démarrage'
    startup.appendChild(legendstartup)
    this.startupServices.forEach(service => {
      startup.appendChild(service.build())
    })
    div.appendChild(startup)

    const otherservices = document.createElement('FIELDSET')
    const legendautre = document.createElement('LEGEND')
    legendautre.textContent = 'Autres services'
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
    return stopEvent(ev)
  }
}