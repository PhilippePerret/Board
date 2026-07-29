/**
 * Reminder (Rappel)
 * 
 * Reminder peut être utilisé pour deux choses
 *  1. Afficher des rappels immédiat,
 *  2. Enregistre un rappel à donner plus tard.
 * 
 * @usage
 * 
 *    Reminder.register({
 *      time:     [Date] date où le rappel doit être donné
 *      -----------
 *      message:  [string]  Le message à afficher
 *      title:    [String] Le titre optionnel
 *      type:     [string] 'notice', 'warning', 'alert'
 *      icon:     [string] Path ou type de l'icône (en général l'icône du projet)
 *      -----------
 *      Toutes les données précédentes, à part +time+, peuvent être
 *      données par :
 *      notifier  [Notifier] Instance de notifier
 *    })
 */
class Reminder extends ExtendedObject {

  static init(){
    super()
    this.running  = false
    this.stack    = []
  }

  /**
   * @api
   * 
   * -- Point d'entrée pour enregistrer un reminder -- 
  */
  static register(data){
    const reminder = new Reminder(data)
    if (reminder.immediat) {
      reminder.exec()
    } else {
      reminder.schedule()
    }
  }

  /**
   * Vérifie tous les rappels pour voir ceux qui arriveraient à échéance
   */
  static poll() {
    this.each('execIfTime', [new Date().getDate()])
    if (this.count == 0) {
      this.stop()
    }
  }

  // Lancement du 
  static run(){
    this.runTimer = setInteval(this.poll.bind(this), 60 * 1000)
    this.running = true
  }
  static stop(){
    this.removeInterval(this.runTimer)
    delete this.runTimer
    this.running = false
  }

  constructor(data){
    super(data)
    this.time = this.date.getDate()
  }

  /**
   * Fonction qui vérifie le temps +time+ avec le temps du rappel
   * et exécute le reminder si c'est l'heure
   */
  execIfTime(time) {
    console.log("Temps comparés", time, this.time)
    if (this.time <= time) this.exec()
  }
  /**
   * Exécution du rappel
   */
  exec(){
    message(true, "Je dois apprendre à jouer le rappel", this)
    this.constructor.remove(this)
  }

}