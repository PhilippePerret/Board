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
    this.remindedTasks = {}
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

  /**
   * Fonction qui ajoute un reminder pour une tâche
   * courante.
   * 
   * Noter qu'une même tâche peut tout à fait avoir plusieurs
   * reminder (tâche toutes les heures, par exemple)
   */
  static addReminderToTask(task, reminder){
    if (undefined == this.remindedTasks[task.id]){
      Object.assign(this.remindedTasks, {[task.id]: []})
    }
    this.remindedTasks[task.id].push(reminder)
  }

  /**
   * Destruction du rappel +reminder+
   */
  static remove(reminder) {
    const idx = this.__eo_ids.indexOf(reminder.id)
    this.__eo_ids.splice(idx, 1)
    this.__eo_items.splice(idx, 1)
    delete this.__eo_table[reminder.id]
  }
  /**
   * Suppression des reminders du type +type+
   * 
   * Fonction qui checke la validité des reminders courant
   * après une modification des tâches courantes.
   * Elle détruit ceux qui n'ont plus à être là.
   * 
   * Mais en fait, il vaut mieux tous les détruire et les
   * refaire avec les nouvelles tâches
   */
  static destroy(type){
    const newItems    = []
    const newTable    = {}
    const newIds      = []
    this.__eo_items = this.__eo_items.filter(reminder => {
      return reminder[type] == undefined
    })
    // Reminders restant
    this.__eo_items.forEach(reminder => {
      Object.assign(newTable, {[reminder.id]: reminder})
      newIds.push(reminder.id)
    })
    this.__eo_table     = newTable
    this.__eo_ids       = newIds
    this.remindedTasks  = {}
  }

  constructor(data){
    super(data)
    data.task && this.setAsTask()
    console.log("Reminder enregistré", this)
  }

  setAsTask(){
    this.buttons = [
        {name: 'Démarrée', onclick: Reminder.remove.bind(Reminder,this)}
      , {name: 'Supprimer', onclick: Reminder.remove.bind(Reminder,this)}
    ]
    this.task = data.task
    this.type = 'warning'
    Reminder.addReminderToTask(data.task, this)
  }

  /**
   * Fonction qui vérifie le temps +time+ avec le temps du rappel
   * et exécute le reminder si c'est l'heure
   */
  execIfTime(now) {
    // console.log("Temps comparés", now, this.time, this)
    if ( this.time <= now ){
      if ( DateUtils.close(this.time, now, 60) ) {
        this.exec()
      } else {
        // L'heure est trop éloignée : on détruit ce rappel
        this.constructor.remove(this)
      }
    }
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
        icon:       this.fullPathIcon()
      , title:      this.calcTitle()
      , message:    this.message
      , background: '#333333'
      , font_color: '#FFFFFF'
      , mode:       'floating'
      , delay:      this.delay
      , buttons:    this.buttons
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

  calcTitle(){
    if (this.title) return title
    if (this.project) return getMsg('title-project', this.project.title)
    return
  }

  fullPathIcon(){
    var icon;
    if ( icon = this.project?.get('icon')) {
      return this.project.getFullPath(icon, 'file://')
    } else {
      return this.icon
    }
  }
}
Reminder.init()