/**
 * Panneau de réglage des données de l'application (APP_DATA, cf.
 * frontend/js/AppData.js) — ouvert/fermé en cliquant sur "Tableau de bord"
 * (#app-name, cf. App.js).
 */
class AppDataPanel extends SidePanelDefiner {
  get title(){ return 'Réglages de l’application' }
  get domId(){ return 'app-data-panel' }
  get prefixDom() { return 'project-extradata'}
  get PARAMS_DATA() { return APP_DATA }
  
  currentValue(dParam){
    return App.getData(dParam.id) ?? dParam.default ?? '(non défini)'
  }

  // buildRow(dParam){
  //   dParam.default = this.currentValue(dParam)
  //   const row = DCreate('DIV', {class: 'service app-data-row', id: `app-data-${dParam.id}`})
  //   row.appendChild(DCreate('DIV', {class: 'name', text: dParam.name}))
  //   const valueDomEl = DCreate('DIV', {class: 'app-data-value', text: dParam.default})
  //   row.appendChild(valueDomEl)
  //   this.listingEl.appendChild(row)
  //   Object.assign(dParam, {valueDomEl, currentValue: dParam.default})
  //   listen(row, 'click', this.onClickRow.bind(this, dParam))
  // }

  // // Appelé quand on clique sur la propriété dans le panneau
  // onClickRow(dParam){
  //   const definer = new ParamsDefiner([dParam], this.onEdited.bind(this, dParam))
  //   definer.define()
  // }

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
