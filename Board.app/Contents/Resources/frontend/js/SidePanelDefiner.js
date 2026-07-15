class SidePanelDefiner extends SidePanel {

  currentValue(dParam){
    return this.project.get(dParam.id) ?? dParam.default ?? '(non défini)'
  }

  buildContent(){
    this.PARAMS_DATA.forEach(dParam => this.buildRow(dParam))
  }
  buildRow(dParam){
    const prefix = this.prefixDom
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
