/**
 * Panneau de réglage des données de l'application (APP_DATA, cf.
 * frontend/js/AppData.js) — ouvert/fermé en cliquant sur "Tableau de bord"
 * (#app-name, cf. App.js).
 */
class AppDataPanel extends SidePanel {
  get title(){ return 'Réglages de l’application' }
  get domId(){ return 'app-data-panel' }

  buildContent(){
    APP_DATA.forEach(entry => this.buildRow(entry))
  }

  currentValue(entry){
    return App.getData(entry.id) ?? entry.default ?? '(non défini)'
  }

  buildRow(entry){
    const row = DCreate('DIV', {class: 'service app-data-row', id: `app-data-${entry.id}`})
    row.appendChild(DCreate('DIV', {class: 'name', text: entry.name}))
    const valueEl = DCreate('DIV', {class: 'app-data-value', text: this.currentValue(entry)})
    row.appendChild(valueEl)
    this.listingEl.appendChild(row)
    listen(row, 'click', this.onClickRow.bind(this, entry, valueEl))
  }

  onClickRow(entry, valueEl){
    switch(entry.type) {
      case 'select':
        new SelectDialog({
            title: this.title
          , id: entry.id
          , message: entry.name
          , idValues: [entry.id]
          , values: entry.values
          , ouiBtn: {name: 'OK', onclick: this.onEdited.bind(this, entry, valueEl)}
          , nonBtn: {name: 'Annuler'}
        }).show()
        break
      case 'string': 
        new TextFieldDialog({
            title: this.title
          , id: entry.id
          , message: entry.name
          , defaultValue: this.currentValue(entry)
          , ouiBtn: {name: 'OK', onclick: this.onEdited.bind(this, entry, valueEl)}
          , nonBtn: {name: 'Annuler'}
        }).show()
        break;
      default: 
        console.error("Type de valeur inconnue dans les données de l'application : ", entry)
    }
  }

  onEdited(entry, valueEl, values){
    App.data[entry.id] = values[0]
    App.saveData()
    valueEl.textContent = App.data[entry.id]
  }
}
