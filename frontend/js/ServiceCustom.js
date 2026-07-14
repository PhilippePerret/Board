class ServiceCustom extends Service {
  static get serviceType(){ return 'custom'}
  static get klass(){ return ServiceCustom }
  static get oppositeButton(){return "Services communs"}

  static get SERVICES_DATA(){return CUSTOM_SERVICES_DATA}
  static get panel(){
    return this._panel || (this._panel = new MiniPanel(DGet(`div#custom-services-panel`)))
  }


}