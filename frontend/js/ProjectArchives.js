class ProjectArchives {

  static chooseArchivedProject(retour){
    if (undefined == retour) {
      // Il faut remonter la liste des projets archivés
      server.send({action: 'get-options-for-projects-out'}, this.chooseArchivedProject.bind(this))
    } else {
      new SelectDialog({
            title: getMsg('archived-projects')
          , message: getMsg('choose-project-to-restart')
          , values: retour.data
          , ouiBtn: {name: getMsg('This-one'), onclick: this.onChooseArchivedProject.bind(this)}
          , nonBtn: {name: getMsg('Cancel')}
        , 
      }).show()
    }

  }
  // Quand un projet a été choisi
  static onChooseArchivedProject(pid, retour){
    console.log("onChooseArchivedProject pid, retour:", pid, retour)
    if (undefined == retour) {
      // Remonter les données du projet en le remettant dans la liste
      // des projets courant
      if (!pid) raise("[SYSTEM] undefined ProjectId.")
      server.send({action: 'retreive-project-from-archives', projectId: pid},
        this.onChooseArchivedProject.bind(this, pid)
      )
    } else if (retour.data.error) {
      erreur(retour.data.error)
    } else {
      // Modifier projects-in et projects-out de App
      // Ajouter les données du projet
      const projet = new Project(retour.data.project)
      projet.buildCard()
      App.setData('projects-in', retour.data.newProjectsIn)
      App.setData('projects-out', retour.data.newProjectsOut)
    }
  }


  // Retourne la liste des [idProject, titre-projet]
  static optionsForSelect(){
    App.getData('projects-in').map(pId => {

    })
  }

}