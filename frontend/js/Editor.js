class Editor {

  static giveCode(code){

  }
  // 
  /**
   * === CRÉATION D'UN NOUVEAU PROJET ===
   * 
   * Appelé quand on clique sur le bouton "+"
   * 
   * La fonction affiche un panneau indiquant qu'il faut choisir le projet
   * dans le Finder puis cliquer "OK" pour le prendre en compte.
   */
  static addProject(){
    reset()
    const conf = new ConfirmDialog({
      title: "Importation d'un nouveau projet", 
      message: "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”.",
      width: '580px',
      ouiBtn: {title: 'OK', onclick: this.onProjectSelectedInFinder.bind(this), width: '160px'},
      nonBtn: {title: "Renoncer", onclick: null, width: '160px'},
    })
    conf.show()
  }
  static onProjectSelectedInFinder(){
    server.send({action: 'getInfoFinderSelection', type: 'folder'}, this.onRetourInfoFinderProjet.bind(this))
  }
  static onRetourInfoFinderProjet(retour){
    // console.info("Retour : ", retour)
    if (retour.data.ok === false) {
      if (retour.data.error == 'Not a folder') return error('Il faut impérativement choisir un dossier.')
    }
    const projet = new Project(Object.assign(retour.data, {
      id: Project.uniqId(),
      title: retour.data.name,
      workTime: 0
    })).buildCard()
    const confirm = new ConfirmDialog({
      title: "Confirmation de l'import",
      message: "Si tu es d'accord avec ces données, clique le bouton “Importer”", // TODO ajouter les infos
      ouiBtn: {name:"Importer", onclick: projet.save.bind(projet), w: '160px'},
      nonBtn: {name: "Renoncer", w: '160px'}
    }).show()
  }

  static close(){this.panel.close()}

  static get panel(){
    return this._panel || (this._panel = new MiniPanel(document.querySelector('div#edit-panel')))
  }
}

class MiniPanel {
  constructor(obj){
    this.obj = obj
    console.log("obj", obj)
  }
  open(){ this.obj.classList.remove('closed')}
  close(){this.obj.classList.add('closed')}

}