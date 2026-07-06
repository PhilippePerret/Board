/**
 * 
 * =============================================
 *    D É F I N I T I O N   D U   S E R V I C E
 * =============================================
 * Cette méthode permet de définir les données nécessaires
 * au service.
 * 
 * Fonctionnement
 * --------------
 * À la base, +service+ est une table contenant :id, :name et
 * :method
 * :method est la méthode à appeler pour 1) définir et 2) exécuter le service
 */
class ServiceDefiner {
  
  constructor(service, callback){
    this.service  = service
    this.callback = callback
  }

  // On commence
  start(){
    this.service.method()
  }

  // On finit
  resolve(){
    this.callback(service)
  }

  /**
   * --------------------———————————————————————
   * Les fonctions de définition
   * (les 'method' des services)
   */
  defineOpenFinderWindow(retour){
    if (undefined == retour) {
      return this.attend(
        "Définir la fenêtre dans le finder, puis OK.", 
        this.defineOpenFinderWindow.bind(this))
    } else {
      server.send({action: 'getInfoFinderSelection'}, this.onReturnedData.bind(this))
    }
  }


/*
  /Fin des méthodes de définition
  --------------------———————————————————————
 **/
  attend(message, callback){
    new ConfirmationDialog({
      title: "Définition du service",
      message: message,
      ouiBtn: {name: 'OK', onclick: callback},
      nonBtn: {name: 'Annuler'}
    }).show()
  }
  
  // Fonction de retour des données
  onReturnedData(retour){
    console.log("retour", retour)
    this.service.data = retour.data
    this.resolve()
  }
}