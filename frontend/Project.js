class Project {
  static get container(){ return this._container || (this._container = document.querySelector('#project-cards-container'))}

  constructor(data){
    this.title = data.title ?? '-projet sans titre-'
    this.startupServices  = data.startup_services ?? []
    this.autresServices   = data.autres_services ?? []
  }

  buildCard(){
    const div = document.createElement('DIV')
    div.className = 'project-card'
    const tit = document.createElement('DIV')
    tit.className = 'title'
    tit.textContent = this.title
    div.appendChild(tit)
    const startup = document.createElement('FIELDSET')
    this.startupServices.forEach(service => {
      startup.appendChild(service.build())
    })
    div.appendChild(startup)
    const otherservices = document.createElement('FIELDSET')
    this.autresServices.forEach(service => {
      otherservices.appendChild(service.build())
    })
    div.appendChild(otherservices)

    this.constructor.container.appendChild(div)
  }
}