const PROJECT_EXTRA_DATA = [

    {id: 'icon', type: 'path', name: 'Icône du projet'}
  , {id: 'background', type: 'color-or-image', name: 'Fond du projet'}
]

class ProjectExtraDataPanel extends SidePanel {
  get title() { return "Données supplémentaires du projet" }
  get domId() { return 'projet-extradata-panel'}
  get prefixDom() { return 'project-extradata'}
  get PARAMS_DATA() { return PROJECT_EXTRA_DATA }

  constructor(projet){
    super()
    this.project = projet
  }

  currentValue(dParam){
    return this.project.get(dParam.id) ?? dParam.default ?? '(non défini)'
  }

  updateValue(id, value){
    this.project[id] = Value
    this.project.save()
  }
}
