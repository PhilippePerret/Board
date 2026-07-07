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
    this.data     = this.service.data.reverse() // pour pouvoir poper
    this.callback = callback

  }

  // On commence
  start(){
    this.define()
  }

  // On finit
  resolve(){
    this.callback(service)
  }


  /**
   * Méthode principale de définition du service
   */
  define(retour){
    param = this.data.pop()
    if (param) this.defineByType(param)
    else this.resolve()
  }
  /**
   * Méthode de dispatch de définition en fonction du type
   */
  defineByType(param){
    switch(param.type){
      case 'finder-window':
        message("Je dois apprendre à définir une fenêtre de finder")
        break
      case 'path':
        message("Je dois apprendre à définir un chemin d'accès")
        break
      case 'app':
        message("Je dois apprendre à définir une application (CLI)")
        break
      case 'boolean':
        message("Je dois apprendre à régler une valeur booléenne")
        break
      default:
        error("Je ne connais pas le type " + param.type)
    }
  }


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