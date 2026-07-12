class ServiceCustom extends Service {
  static get panelId(){ return 'custom-services-panel'}
  
  static get SERVICES_DATA(){return CUSTOM_SERVICES_DATA}

  constructor(data){
    super(data)
  }

  observe(){
    listen(this.obj, 'dragstart', e => e.dataTransfer.setData("id", this.id))
  } 


}