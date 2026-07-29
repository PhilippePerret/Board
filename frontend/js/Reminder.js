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
    super.init()
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
    } else if ( !this.running ) {
      this.run()
    }
  }

  /**
   * Vérifie tous les rappels pour voir ceux qui arriveraient à échéance
   */
  static poll() {
    // console.log("-> Reminder::poll", new Date())
    this.each('execIfTime', [new Date()])
    if (this.count == 0) {
      this.stop()
    }
  }

  // Lancement du reminder
  static run(){
    // console.log("-> Reminder::run")
    this.runTimer = setInterval(this.poll.bind(this), 60 * 1000)
    this.running = true
  }
  static stop(){
    // console.log("-> Reminder::stop")
    clearInterval(this.runTimer)
    delete this.runTimer
    this.running = false
  }

  constructor(data){
    super(data)
  }

  /**
   * Fonction qui vérifie le temps +time+ avec le temps du rappel
   * et exécute le reminder si c'est l'heure
   */
  execIfTime(date) {
    // console.log("Temps comparés", date, this.time)
    if (this.time <= date) this.exec()
  }
  /**
   * Exécution du rappel
   */
  exec(){
    // console.log("-> Reminder.exec", this)
    Notifier.notify(this.dataNotifierByType(this.type))
    if (this.onDue) {
      console.info("La fonction à jouer lors de l'échéance a été appelée.")
      this.onDue()
    }
    this.constructor.remove(this)
  }

  dataNotifierByType(type) {
    const data = {
        icon:       this.icon || this.project?.get('icon')
      , title:      this.title
      , message:    this.message
      , background: '#333333'
      , font_color: '#FFFFFF'
      , mode:       'floating'
      , delay:      this.delay
    }
    var sup
    switch(type){
      case 'notice':
        sup = {background: '#0000FF'}
        break
      case 'warning':
        sup = {background: '#ffc400'}
        break
      case 'error':
        sup = {background: '#e60000'}
        break

    }
    return Object.assign(data, sup)
  }
}