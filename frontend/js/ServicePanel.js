class ServicePanel extends SidePanel {
  buildContent(){

  }
}

class CommonPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.commonPanel = this
  }
  get title(){ return 'Services communs'}
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
  get domId(){ return 'custom-services-panel'}
  get SERVICES_DATA(){ return CUSTOM_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.commonPanel}
  get oppositeButton(){ return 'Services communs'}
  get closeLabel(){ return null}

}