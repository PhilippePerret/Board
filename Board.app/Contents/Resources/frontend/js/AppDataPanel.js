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

  updateValue(id, value){
    App.data[id] = Value
    App.saveData()
  }

}
