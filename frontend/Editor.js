class Editor {

  static giveCode(code){

  }
  // Appelé quand on clique sur le bouton "+"
  static addProject(){
    this.panel.open()
  }

  static close(){this.panel.close()}

  static get panel(){
    return this._panel || (this._panel = new Panel(document.querySelector('div#edit-panel')))
  }
}

class Panel {
  constructor(obj){
    this.obj = obj
    console.log("obj", obj)
  }
  open(){ this.obj.classList.remove('closed')}
  close(){this.obj.classList.add('closed')}

}