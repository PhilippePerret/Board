class Editor {

  static giveCode(code){

  }
  // Appelé quand on clique sur le bouton "+"
  static addProject(){
    this.panel.open()
  }

  static get panel(){
    return {
      obj: document.querySelector("#edit-panel"),
      open(){ this.obj.classList.toggle('closed', 'opened')},
      close(){this.obj.classList.toggle('opened', 'closed')}
    }
  }
}