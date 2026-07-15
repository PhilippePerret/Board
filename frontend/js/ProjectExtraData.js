const PROJECT_EXTRA_DATA = [

    {id: 'icon', type: 'path', name: 'Icône du projet'}
  , {id: 'background', type: 'color-or-image', name: 'Fond du projet'}
]

class ProjectExtraData {

}

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

  // buildContent(){
  //   PROJECT_EXTRA_DATA.forEach(dParam => this.buildRow(dParam))
  // }
  buildRow(dParam){
    const prefix = 'project-extradata'
    dParam.default = this.currentValue(dParam)
    const row = DCreate('DIV', {class: `service ${prefix}-row`, id: `${prefix}-${dParam.id}`})
    row.appendChild(DCreate('DIV', {class: 'name', text: dParam.name}))
    const valueDomEl = DCreate('DIV', {class: `${prefix}-value`, text: dParam.default})
    row.appendChild(valueDomEl)
    this.listingEl.appendChild(row)
    Object.assign(dParam, {valueDomEl, currentValue: dParam.default})
    listen(row, 'click', this.onClickRow.bind(this, dParam))
  }

    // Appelé quand on clique sur la propriété dans le panneau
  onClickRow(dParam){
    const definer = new ParamsDefiner([dParam], this.onEdited.bind(this, dParam))
    definer.define()
  }

  onEdited(dParam, definers){
    if (!definers) return // annulation
    const oldValue = dParam.currentValue
    const newValue = definers[0].value
    if (oldValue != newValue) {
      App.data[dParam.id] = newValue
      dParam.valueDomEl.textContent = App.data[dParam.id]
      App.saveData()
    }
  }

}
