class ServicePanel extends SidePanel {
  buildContent(){
    var currentGroup, currentGroupName // pour les communs
    this.SERVICES_DATA
      .map(dataService => new Service(Object.assign(dataService, {stype: this.serviceType})))
      .forEach( service => {
        if (service.group != currentGroupName) {
          currentGroup = DCreate('FIELDSET', {class:'services-group'})
          const legend = DCreate('LEGEND', {text: service.group})
          currentGroup.appendChild(legend)
          this.listing.appendChild(currentGroup)
          currentGroupName = String(service.group)
        }
        service.build(currentGroup || this.listing)
      })
  }
  get listing(){ return DGet('.services-listing', this.obj) }
}

class CommonPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.commonPanel = this
  }
  get title(){ return 'Services communs'}
  get serviceType(){return 'common'}
  get domId(){ return 'common-services-panel'}
  get SERVICES_DATA(){ return COMMON_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.customPanel}
  get oppositeButton(){ return 'Services personnalisés'}
  get closeLabel(){ return null}
}

class CustomPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.customPanel = this
  }
  get title(){ return 'Services personnalisés'}
  get serviceType(){return 'custom'}
  get domId(){ return 'custom-services-panel'}
  get SERVICES_DATA(){ return CUSTOM_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.commonPanel}
  get oppositeButton(){ return 'Services communs'}
  get closeLabel(){ return null}

}