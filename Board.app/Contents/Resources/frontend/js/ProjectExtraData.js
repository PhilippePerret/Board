const PROJECT_EXTRA_DATA = [
    {id: 'icon', type: 'path-in-project', name: 'Icône du projet', q: 'Choisir une icône SVG ou PNG en la sélectionnant dans le Finder.'}
  , {id: 'background', type: 'color-or-image', name: 'Fond de la carte du projet'}
  , {id: 'genre', type: 'select-or-string', name: 'Genre du projet', values: GENRES_PROJETS}
]

class ProjectExtraDataPanel extends SidePanelDefiner {
  get title() { return "Données supplémentaires du projet" }
  get domId() { return 'projet-extradata-panel'}
  get prefixDom() { return 'project-extradata'}
  get PARAMS_DATA() { return PROJECT_EXTRA_DATA }

  constructor(projet){
    super()
    this.project = projet
  }

  currentValue(dParam){
    return this.project.get(dParam.id) ?? dParam.default ?? ''
  }

  updateValue(id, value){
    this.project[id] = value
    this.apply(id, value)
    this.project.save()
  }

  // Pour appliquer tout de suite le choix
  apply(id, value) {
    switch(id){
      case 'background':
        this.project.obj.style.background = value
        break
      case 'icon':
        const icon = this.project.buildIcon()
        this.project.obj.insertBefore(icon, this.divTitle)
        break
    }
  }
}
