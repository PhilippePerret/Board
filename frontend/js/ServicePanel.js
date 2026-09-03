class ServicePanel extends SidePanel {
  // Construction des Service (une fois pour toutes) — l'affichage réel
  // (filtré/ordonné par projet, cf. ServiceVisibility.js) est délégué à
  // render(), rejouable à chaque changement de projet courant.
  buildContent(){
    this.SERVICES_DATA
      .map(dataService => new Service(Object.assign(dataService, {stype: this.serviceType})))
      .forEach(service => service.build(this.listing))
    this.render()
  }

  // Rejoue l'affichage (déjà construits, cf. buildContent) filtré/ordonné
  // pour Project.current — appelée au build initial et à chaque changement
  // de projet sélectionné (cf. Project.current=).
  render(){
    this.listing.innerHTML = ''
    var currentGroup, currentGroupName
    orderedVisibleServiceData(this.SERVICES_DATA, Project.current).forEach(dataService => {
      const service = Service.get(dataService.id)
      if (service.group != currentGroupName) {
        currentGroup = DCreate('FIELDSET', {class:'services-group'})
        const legend = DCreate('LEGEND', {text: service.group})
        currentGroup.appendChild(legend)
        this.listing.appendChild(currentGroup)
        currentGroupName = String(service.group)
      }
      currentGroup.appendChild(service.obj)
    })
  }

  refresh(){ this.built && this.render() }

  get listing(){ return DGet('.services-listing', this.obj) }
}

class CommonPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.commonPanel = this
    this.opened = true
  }
  get title(){ return getMsg('Common-services')}
  get serviceType(){return 'common'}
  get domId(){ return 'common-services-panel'}
  get SERVICES_DATA(){ return COMMON_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.customPanel}
  get oppositeButton(){ return getMsg('Custom-services')}
  get closeLabel(){ return null}
}

class CustomPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.customPanel = this
  }
  get title(){ return getMsg('Custom-services')}
  get serviceType(){return 'custom'}
  get domId(){ return 'custom-services-panel'}
  get SERVICES_DATA(){ return CUSTOM_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.commonPanel}
  get oppositeButton(){ return getMsg('Common-services')}
  get closeLabel(){ return null}

}