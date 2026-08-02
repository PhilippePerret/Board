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
   * 
   * Données requises : cf. @usage ci-dessus.
  */
  static register(data){
    const reminder = new Reminder(data)
    if (reminder.immediat) {
      reminder.exec()
    } else {
      // On enregistre TOUJOURS le rappel, même s'il est aujourd'hui
      // dans le cas où l'on doive redémarrer l'application.
      App.saveReminders()
      if ( reminder.onOtherDay || this.running ) {
        // Rien à faire
      } else {
        // Sinon on lance
        this.run()
      }
    }
      
  }

  /**
   * Appelé par App pour avoir la liste des reminders à 
   * sauvegarder
   */
  static getRemindersToSave(){
    const reminders = []
    this.each((reminder) => {reminders.push(reminder.savedData())})
    return reminders
  }

  /**
   * Vérifie tous les rappels pour voir ceux qui arriveraient à échéance
   */
  static poll() {
    // console.log("-> Reminder::poll", {now: new Date(), count: Number(this.count)})
    this.each('execIfTime', [new Date()])
    this.count > 0 || this.stop()
  }

  // Lancement du reminder
  static run(){
    // console.log("-> Reminder::run")
    // On lance pile à la minute
    this.startRunningTimer = setTimeout(setTimeout(() => { 
      clearTimeout(this.startRunningTimer)
      delete this.startRunningTimer
      this.runTimer = setInterval(this.poll.bind(this), 60 * 1000)
      this.running = true
      console.log("Lancement réel du poll", new Date())
    }, 60000 - (Date.now() % 60000)))
    
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
  static addReminderToTask(taskId, reminder){
    if (undefined == this.remindedTasks[taskId]){
      Object.assign(this.remindedTasks, {[taskId]: []})
    }
    this.remindedTasks[taskId].push(reminder)
  }

  /**
   * Destruction du rappel +reminder+
   */
  static remove(reminder) {
    // console.log("-> Reminder::remove(reminder=)", reminder)
    const idx = this.__eo_ids.indexOf(reminder.id)
    this.__eo_ids.splice(idx, 1)
    this.__eo_items.splice(idx, 1)
    delete this.__eo_table[reminder.id]
    App.saveReminders()
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
    data.task && this.setAsTask(data)
    // console.log("Reminder enregistré", this)
    if ('string' == typeof this.time){ this.time = new Date(this.time) }
    this.execCount = 0
    this.buttons && this.defineRealButtons()
  }

  set project(v) { this._project = v}
  get project() { return this._project ?? (this._project = this.getProject())}
  getProject(){
    if (this.projectId) { return Project.get(this.projectId) }
    else return null
  }

  /**
   * @return Un dict des données du rappel pour enregistrement, par
   * exemple lorsqu'il doit être déclenché plus 
   */
  savedData(){
    return {
        title: this.title
      , message: this.message
      , time: this.time.toISOString()
      , icon: this.icon
      , taskId: this.task?.id
      , type: this.type
      , delay: this.delay
      , projectId: this.project?.id
      , buttons: this.buttons
    }
  }

  /** Retourne true quand c'est une alerte qui doit être jouée
   * un autre jour
   * 
   * Note : si c'est le cas, elle a été enregistrée dans les données
   * de l'application.
  */
  get onOtherDay() {
    return this.time > DateUtils.endOfDay()
  }

  // Définir comme une tâche
  setAsTask(data){
    this.buttons = [
        {name: getMsg('remind-started'), onclick: 'Reminder.remove'}
      , {name: getMsg('remind-remove'), onclick: 'Reminder.remove'}
    ]
    this.defineRealButtons()
    const taskId = this.taskId || data?.task.id
    this.type = 'warning'
    Reminder.addReminderToTask(taskId, this)
  }

  /**
   * Les boutons étant enregistrés avec les autres informations, on
   * ne peut pas avec de fonction bindées à onclick. Pour gérer ça,
   * on utilise des clés associées aux fonctions.
   * 
   * Ces clés sont toujours composées de la même façon :
   *      <Classe>.<methode>
   * … qui sera transformé en 
   *      Classe.methode.bind(Classe, this)
   * … où this sera donc le rappel.
   */
  defineRealButtons(){
    this.realButtons = this.buttons?.map(button => {
      const [sklass, method] = button.onclick.split('.')
      const klass = eval(sklass)
      return Object.assign({}, button, {onclick: klass[method].bind(klass, this)})
    })
  }

  /**
   * Fonction qui : 
   *  - compare 
   *  - toutes les minutes 
   *  - le temps de maintenant avec le temps du rappel
   *  - et exécute le reminder si c'est l'heure
   */
  execIfTime(now) {
    // console.info("Temps comparés pour reminder", {now, time: this.time, rappel: this})
    if ( this.time <= now ){
      // console.info("Le temps est-il proche ?", {time: this.time, now: now, estProche: DateUtils.close(this.time, now, 60)})
      if ( DateUtils.close(this.time, now, 60) ) {
        // Pour ne répéter le message que toutes les 3 minutes s'il n'est pas
        // marqué exécuté.
        if ( this.execCount % 3 == 0 ) this.exec()
        ++ this.execCount
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
      // console.info("La fonction à jouer lors de l'échéance a été appelée.")
      this.onDue()
    }
  }

  /**
   * Appelé par Notifier pour signaler un clic sur la notification,
   * en dehors des boutons.
   * Pour le moment, +value+ vaut toujours ':remove:' et demande
   * l'annulation du rappel
   */
  onClickNotification(value){
    console.log("Reçu par onClickNotification:", value)
    switch(value){
      case ':remove:':
        Reminder.remove(this);
        console.log("Suppression du rappel")
        break
      case ':remindme:':
        // <= Quand on clique sur "me le rappeler plus tard"
        // => Mettre à 10 minutess de maintenant
        this.time.setMinutes(this.time.getMinutes() + 10)
        App.saveReminders()
        console.log("Rappel réglé à dans 10 minutes", this.time)
      break
    }
  }


  dataNotifierByType(type) {
    const data = {
        icon:       this.fullPathIcon()
      , title:      this.calcTitle()
      , message:    this.message
      , background: '#f7f7f7'
      , font_color: '#070707'
      , mode:       'floating'
      , delay:      this.delay
      , buttons:    this.realButtons
      , onclick:    this.onClickNotification.bind(this)
    }
    var sup
    switch(type){
      case 'notice':
        sup = {background: '#0000FF'}
        break
      case 'warning':
        sup = {background: '#ffc400', font_color: 'black'}
        break
      case 'error':
        sup = {background: '#e60000'}
        break

    }
    return Object.assign(data, sup)
  }

  calcTitle(){
    if (this.title) return this.title
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