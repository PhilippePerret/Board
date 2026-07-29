class Project {

  // Toutes les propriétés des projets doivent être définies ici
  // common_services_data : données pour les services communs
  static PROPERTIES = [
    'id', 'title', 'path', 'common_services_data', 'workTime', 'createdAt', 'updatedAt',
    'services', 'background', 'icon', 'genre', 'collapsed',
    // documentation
    'docu-folder', 'docu-main-file-adoc', 'docu-main-file-html',
    // Pour les services (notamment les script-services)
    'service_data',
    // Todoist project id (Todoist.js)
    'todoist_id'

  ]

  static get current(){ return this._current}
  static set current(p){
    this._current = p
    this.markCurrentProject.textContent = p?.title ?? ""
  }
  static get markCurrentProject(){
    return this._markcurproj || (this._markcurproj = DGet('#current-project-mark'))
  }

  /**
   * Chargement de tous les projets
   * ------------------------------
   * On remonte les données de tous les projets + leur ordre, 
   * défini dans appdata['projects-in']
   */
  static initAllProjects(projectsData){ D.on && D.trace(projectsData)
    // Note : les projest sont remontés classés
    this.sortedProjects = projectsData
    this.sortedProjects.map(dataProjet => {
      new Project(dataProjet).buildCard()
    })
    message("Projets courants affichés.")
    // Maintenant que les projets sont affichés, on peut chercher les
    // tâches qu'ils peuvent avoir
    this.getTachesProjects()
  } 
  
  static getTachesProjects(){
    this.eachAsync('getTachesAndSetBadges', 'setTodoistBadge')
  }

  /**
   * Boucler sur les projets avec une méthode asynchrone
   * 
   * Cas concret : après le chargement de tous les projets, 
   * ils doivent chacun leur tour relever leurs tâches et
   * renseigner leur badge.
   * 
   * +method+ est la méthode asynchrone envoyant la requête :
   *    Todoist.todayTaskForNotInter(projet, callback)
   * Toute +method+ doit recevoir ces deux arguments. Le 
   * callback, ici, sera mis à eachAsync.
   * 
   * +methodRetour+ est la méthode synchrone qui doit traiter
   * Le retour. Elle doit recevoir en argument le retour tel
   * qu'il est remonté.
   */
  static eachAsync(method, methodOnRetour, projet, retour) {
    if (projet) {
      // synchro
      // console.info("Au retour, appel de '%s' sur e%s'", methodOnRetour, projet.title)
      if ('function' == typeof projet[methodOnRetour]) {
        projet[methodOnRetour].call(projet, retour)
      } else {
        methodOnRetour(projet, retour)
      }
    }
    // on prend le projet suivant pour le traiter
    // async
    const nextProjet = this.nextAsyncProject()
    if ( nextProjet ) { // Il reste des projets
      const callback = this.eachAsync.bind(this, method, methodOnRetour, nextProjet)
      // console.info("Appel de '%s' sur '%s'", method, nextProjet.title)
      if ('function' == typeof nextProjet[method]) {
        nextProjet[method].call(nextProjet, callback)
      } else {
        method(nextProjet, callback)
      }
    } else {
      // Plus de projet
      // on nettoie
      delete this.eachAsyncProjects
    }
  } 
  static nextAsyncProject(){
    if (undefined == this.eachAsyncProjects) {
      this.eachAsyncProjects = [...Object.values(this.ensureProjects)]
    }
    return this.eachAsyncProjects.pop()
  }

  // Boucler une méthode sur tous les projets
  static mapAll(method) {
    if ('string' == typeof method) {
      this.sortedProjects.map(projet => projet[methdod].call(projet))
    } else {
      this.sortedProjects.map(projet => method(projet))
    }
  }

  // 
  /**
   * === CRÉATION D'UN NOUVEAU PROJET ===
   * 
   * Appelé quand on clique sur le bouton "+"
   * 
   * La fonction affiche un panneau indiquant qu'il faut choisir le projet
   * dans le Finder puis cliquer "OK" pour le prendre en compte.
   */
  static addProject(){ D.on && D.trace()
    reset()
    new ConfirmDialog({
        title: "Importation d'un nouveau projet"
      , message: "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”."
      , width: '580px'
      , ouiBtn: {name: 'OK', onclick: this.onProjectSelectedInFinder.bind(this), width: '160px'}
      , midBtn: {name: 'Archives…', onclick: ProjectArchives.chooseArchivedProject.bind(ProjectArchives), enable: App.getData('projects-out').length > 0}
      , nonBtn: {name: "Renoncer", onclick: null, width: '160px'}
    }).show()
  }

  /**
   * Fonction appelée par le bouton "Extra data"
   * 
   * Définition des extra-data du projet courant
   */
  static defineExtraData(){
    if (this.current) {
      this.current.defineExtraData.call(this.current)
    } else {
      // Ne devrait pas arriver
      erreur("Aucun projet courant.")
    }
  }

  // Sélection du projet dans le Finder
  static onProjectSelectedInFinder(){
    server.send({action: 'getInfoFinderSelection', type: 'folder', no_raise: true}, this.onRetourInfoFinderProjet.bind(this))
  }
  static onRetourInfoFinderProjet(retour){
    // console.info("Retour : ", retour)
    if (retour.data.ok === false) {
      if (retour.data.error == 'Not a folder') return error(getErr('folder-required'))
      else if (retour.data.error == 'No selection') return error(getErr('project-folder-not-selected'))
    }
    const projet = new Project(Object.assign(retour.data, {
        id: uniqId()
      , title: retour.data.name
      , workTime: 0
    }))
    new TextFieldDialog({
        title: "Nom du nouveau projet"
      , message: "Nom à donner à ce projet"
      , defaultValue: retour.data.name
      , ouiBtn: {name: "Appliquer", onclick: this.buildCardNewProject.bind(this, projet.id)}
    }).show()
    // Pour définir le titre à donner
  }
  static buildCardNewProject(idProject, title){
    const projet = Project.get(idProject)
    // console.log("idProjet", idProject, "projectName", projectName, "projet", projet)
    projet.title = title
    projet.buildCard()
    const confirm = new ConfirmDialog({
        title: "Confirmation de l'import"
      , message: "Si tu es d'accord avec ces données, clique le bouton “Importer”"
      , ouiBtn: {name:"Importer", onclick: projet.save.bind(projet), w: '160px'}
      , nonBtn: {name: "Renoncer", w: '160px'}
      , unscrimmed: true

    }).show()
  }


  // Pour afficher et masquer les boutons du projet sélectionné
  static affProjectButtons(){
    this.divButtons.classList.remove('invisible')
    Service.showCommonPanel()
  }
  static maskProjectButtons(){
    this.divButtons.classList.add('invisible')
    Service.maskCommonPanel()
  }
  static get divButtons(){return this._dbutons || (this._dbutons = DGet('span#project-buttons')) }

  /**
   * Méthode pour retirer le projet (appelé par le bouton moins)
   * 
   * Deux solutions : soit archiver le projet, soit le retirer complètement
   */
  static removeCurrentProject(projet){
    projet = this.current
    if (!projet) return error("Il faut sélectionner le projet à retirer.")
    new ConfirmDialog({
        title: "Confirmation du retrait du projet"
      , width: '660px'
      , message: getMsg('expli-retrait-projet', projet.title)
      , ouiBtn: {name: `${svg('archive', 'btn')}Archiver`, onclick: projet.archive.bind(projet)}
      , midBtn: {name: `${svg('bagx','btn')}Retirer`, onclick: projet.remove.bind(projet)}
      , nonBtn: {name: 'Renoncer'}
    }).show()
  }

  /**
   * Appelée quand on clique sur une carte de projet
   */
  static onSelect(projet){
    const same = (projet.id === this.current?.id)
    const reopenExtraData = !same && App.currentPanel instanceof ProjectExtraDataPanel
    this.current && this.deselect(this.current)
    same || this.select(projet)
    if (reopenExtraData) projet.defineExtraData()
  }

  static select(projet){
    projet.obj.classList.add('selected')
    this.current = projet
    this.affProjectButtons()
  }
  static deselect(projet){
    projet.obj.classList.remove('selected')
    if (App.currentPanel instanceof ProjectExtraDataPanel) App.currentPanel.close()
    this.current = null
    this.maskProjectButtons()
  }
  
  static get container(){ return this._container || (this._container = DGet('#project-cards-container'))}
  static get standbyContainer(){return this.stdbycont || (this.stdbycont = DGet('#standby-project-container'))}

  static get ensureProjects() {
    return this._projects ?? (this._projects = {})
  }
  static get(idProject){
    return this.ensureProjects[idProject]
  }
  static add(project){
    Object.assign(this.ensureProjects, {[project.id]: project})
  }
  static remove(idProject){
    if (idProject.id) idProject = idProject.id
    delete this.ensureProjects[idProject]
    if (this.current?.id  == idProject) this.constructor.deselect(this.current)
    message("Projet retiré de la liste des projets.")
  }



  // ---- Pour déplacer le projet couvant
  static moveCurrentToLeft(){
    const proj = this.current
    proj.obj.parentNode.insertBefore(proj.obj, proj.obj.previousSibling)
    App.updateData('projects-in')
  }
  static moveCurrentToRight(){
    const proj = this.current
    proj.obj.parentNode.insertBefore(proj.obj, proj.obj.nextSibling?.nextSibling)
    App.updateData('projects-in')
  }
  // Retourne le nouvel ordre
  static getProjectsOrder(){
    return DGetAll('div.project', this.container).map( div => div.dataset.projectId)
  }


  constructor(data){ D.on && D.trace(data)
    // console.log("data", data)
    this.constructor.PROPERTIES.forEach(prop => this[prop] = data[prop])
    this.data = data
    if (!this.id ) this.id = uniqId()
    if (!this.title) this.title = '-projet sans titre-'
    if (!this.path ) raise("Le path du projet est obligatoire.")
    if (!this.services) this.services = {startup: [], others: []}
    this.constructor.add(this)
    if (undefined == this.card_path) {
      this.card_path = [App.getData('support_folder'), 'project-cards', `${this.id}.yaml`].join('/')
      this.data.card_path = this.card_path
      // console.info("card_path mise à %s", this.card_path)
    }
    if (undefined == this.collapsed) {
      this.collapsed = false
    }
    this.initServices()
    
  }

  get(key){ return this[key] ?? this.data[key] ?? (this.service_data && this.service_data[key])}
  set(key, val, callback = false){ // ça part du principe que s'il faut enregistrer, il faut un callback
    if (this.constructor.PROPERTIES.indexOf(key) > -1) {
      this[key] = val
    } else {// une donnée service
      this.service_data = this.service_data ?? {}
      Object.assign(this.service_data, {[key]: val})
    }
    if (key === 'todoist_id') {
      this.todoistImg.src = `images/todoist${this.todoistBadgeByTasks()}.png`
    }
    callback && this.save(callback)
  }

  initServices(){
    this.services.startup = (this.services.startup ?? []).map(ds => new Service(Object.assign({}, ds, {type: 'startup'})))
    this.services.others  = (this.services.others  ?? []).map(ds => new Service(Object.assign({}, ds, {type: 'others'})))
  }

  save(callback){
    const newData = {}
    this.constructor.PROPERTIES.forEach(prop => {
      if (prop === 'services') {
        newData.services = {
            startup: (this.services?.startup ?? []).map(s => s.toPersistData())
          , others:  (this.services?.others  ?? []).map(s => s.toPersistData())
        }
      } else {
        newData[prop] = this[prop]
      }
    })
    server.send(
        {action: "save-project", data: newData}
      , this.afterSave.bind(this, callback))
  }
  afterSave(callback, retour){
    // console.log("retour Project.afterSave et callback", retour, callback)
    message("Projet « " + this.title + ' » enregistré avec succès à ' + heureCourante() + '.')
    callback && 'function' == typeof callback && callback()
  }

  get extraDataPanel(){ return this._extradatapan || (this._extradatapan = new ProjectExtraDataPanel(this) )}
  
  defineExtraData(){
    this.extraDataPanel.toggle()
  }

  /**
   * Pour mettre le projet en stand-by ou le réactiver
   */
  standbyize(ev){
    if (ev.type == 'mouseup' || ev.type == 'fake-mouseup'){
      this.collapsed = !this.collapsed
      const container = this.constructor[this.collapsed?'standbyContainer':'container']
      container.append(this.obj)
      this.set('collapsed', this.collapsed, true)
      this.obj.classList[this.collapsed?'add':'remove']('collapsed')
      ev.type == 'mouseup' && stopEvent(ev)
    } else if (ev.type == 'mousedown') {
      return stopEvent(ev)
    }
  }
  // Réactiver un projet en standby
  reactive(){
    this.collapsed = true
    this.standbyize({type: 'fake-mouseup'})
    if (this.tasks){
      this.setNombreTachesInBadge(this.tasks.length)
    } else {
      this.getTachesAndSetBadges(this.setTodoistBadge.bind(this))
    }
  }

  /**
   * Quand on clique sur le bouton de démarrage, on doit lancer tous
   * les services de démarrage
   */
  startStartupServices(ev){
    if (undefined == this.startupservices) this.startupservices = [...this.services.startup].reverse()
    const startupservice = this.startupservices.pop()
    if (startupservice) {
      message(`Lancement du service ${startupservice.name}…`)
      startupservice.exec(this, null /* event */, this.startStartupServices.bind(this))
    } else {
      message("Fin de démarrage du projet.")
    }
    return stopEvent(ev)
  }

  /* Modification du titre (click sur titre) */
  modifyTitle(ev, aryData) {
    if (this.collapsed) return stopEvent(ev)
    if (undefined == aryData) {
      stopEvent(ev)
      new TextFieldDialog({
          title: "Modification du titre du projet"
        , message: "Nom à donner à ce projet"
        , defaultValue: this.title
        , ouiBtn: {name: "Appliquer", onclick: this.modifyTitle.bind(this, null)}
      }).show()
      return false
    } else {
      // Enregistrement du titre
      this.title = aryData
      this.divTitle.textContent = this.title
      this.save()
    }
  }
  /**
   * 
   * === MÉTHODES D'AJOUT DES SERVICES ===
   */
  addStartupService(service){
    this.preAddService(service, 'startup')
  }
  addOtherService(service){
    this.preAddService(service, 'others')
  }
  preAddService(service, where){
    console.log("-> preAddService", service)
    service = service.duplicateService()
    service.define(this, this.addService.bind(this, service, where))
  }
  addService(service, where /* others ou startup */){
    service.type = where
    this.services[where].push(service)
    const card = this.getServiceCard(service)
    if (where == 'startup') {
      // Premier service au démarrage ajouté en direct (glisser-déposer, pas
      // au chargement) : le bouton "GO !" et son conteneur n'existent pas
      // encore (buildCard() ne les crée que si hasStartup était vrai AU
      // CHARGEMENT) — on les construit ici à la demande, une seule fois.
      this.buildStartupContainer()
      this.divSServices.appendChild(card)
    } else {
      this.othersField.appendChild(card)
    }
    this.save()
  }

  getServiceCard(service){
    return service.projectCard(this)
  }

  // Construit le bouton "GO !" + son conteneur masqué (révélé par
  // meta+clic, cf. _dev/Manuel/adocs/_TODO_.adoc) — qui reçoit les cartes des
  // services au démarrage. Idempotent, pour être appelable aussi bien depuis
  // buildCard() (chargement, services déjà présents) que depuis addService()
  // (premier ajout en direct).
  buildStartupContainer(){
    if (this.startupContainer) return this.startupContainer
    const startupContainer = DCreate('DIV', {id:`${this.obj.id}-startup-container`, class:'startup-services', role: 'group'})
    const divSServices = DCreate('DIV', {id:`${this.obj.id}-startup-services`, class: 'startup-services-panel hidden', role: 'group'})
    const divBtnStartup = DCreate('DIV', {class:'service'})
    this.btnStartup = DCreate('DIV', {text: 'GO !', id:`${this.obj.id}-btn-startup`, class:'name'})
    divBtnStartup.appendChild(this.btnStartup)
    startupContainer.appendChild(divBtnStartup)
    startupContainer.appendChild(divSServices)
    this.startupField.appendChild(startupContainer)
    // → survol : astuce dans le footer (message(), pas un div sous le bouton)
    listen(startupContainer, 'click', ev => {
      if (!ev.metaKey) return
      divSServices.classList.toggle('hidden')
    })
    // → meta+clic sur GO lui-même : révèle seulement, ne lance rien
    listen(this.btnStartup, 'click', ev => {
      if (ev.metaKey) return
      this.startStartupServices()
    })
    this.startupContainer = startupContainer
    this.divSServices = divSServices
    return startupContainer
  }

  /**
   * SUPPRIMER UN SERVICE
   * ---------------------
   */
  removeServiceFromListe(){
    const service = this.draggedService
    service.projectCard.remove()
    message(`Service supprimé (${service.uuid})`)
    this.services[service.type] = this.services[service.type].filter(s => s.uuid != service.uuid)
    Service.remove(service.uuid)
    // Plus aucun service au démarrage : le bouton "GO !" (et son conteneur)
    // n'a plus lieu d'être — le retirer, et remettre à zéro les références
    // pour que buildStartupContainer() le reconstruise proprement si un
    // service au démarrage est réattaché ensuite.
    if (service.type == 'startup' && this.services.startup.length == 0 && this.startupContainer) {
      this.startupContainer.remove()
      this.startupContainer = null
      this.divSServices = null
      this.btnStartup = null
    }
    this.save()
  }

  buildIcon(){
    const iconPath = `file://${this.path}/${this.icon}`
    const icon = DCreate('IMG', {src: iconPath, class:'project-icon', style: 'width:32px;float:left;margin-right:0.4em'})
    return icon
  }

  buildCard(){
    if (this.obj) this.obj.remove()
    const divId = `project-${this.id}`
    this.divId = divId
    const div = DCreate('DIV', {id: divId, class: 'project', role: 'group'})
    div.dataset.projectId = this.id
    if (this.background) {
      this.setBackground(div, this.background)
    }
    this.obj = div
    if (this.icon){
      div.appendChild(this.buildIcon())
    }

    // Bouton Todoist
    this.todoistCont = DCreate('DIV', {style:'width:32px;', class:'todoist fright discret'})
    this.tasksBadge = DCreate('DIV', {class: 'badge fright hidden'})
    this.todoistCont.appendChild(this.tasksBadge)
    this.todoistImg = DCreate('IMG', {src: `images/todoist${this.todoistBadgeByTasks()}.png`, class:'picto', title: getMsg('todoist-tasks')})
    this.todoistCont.appendChild(this.todoistImg)
    div.appendChild(this.todoistCont)

    // Bouton Standby
    this.standbyBtn = DCreate('IMG', {src: 'images/pile.svg', class:'picto standby-btn'})
    div.appendChild(this.standbyBtn)

    const tit = DCreate('DIV', {id: `${divId}-title`, class:'title', text: this.title, title: 'Cliquer pour modifier le titre', style: 'display:inline-block;z-index:1;'})
    this.divTitle = tit
    div.appendChild(tit)
    const path  = DCreate('DIV', {class:'path', text: this.path})
    div.appendChild(path)
    const dates = DCreate('DIV', {class: 'dates'})
    div.appendChild(dates)
    const crea  = DCreate('SPAN', {class: 'date', text: 'créé : ' + this.createdAt})
    dates.appendChild(crea)
    const upda  = DCreate('SPAN', {class: 'date', text: '/mod.: ' +this.updatedAt})
    dates.appendChild(upda)
    const work = DCreate('DIV', {class: 'worktime', text: 'Temps de travail : ' + this.workTime})
    div.appendChild(work)

    this.startupField = DCreate('FIELDSET', {id: `${divId}-startup-field`, class:'services'})

    /**
     * Fieldset des SERVICES AU DÉMARRAGE
     * 
     * S'il n'y en a pas, on fait l'affichage normal. S'il y en a,
     * on les met dans un div qui sera masqué et l'on mettra un gros
     * bouton "Démarrer" qui lancera tous les services. Quand on laissera
     * la souris sur le bouton, le div contenant tous les services 
     * apparaitra, permettant d'en choisir un.
     */
    const legendstartup = DCreate('LEGEND', {text:'Services au démarrage'})
    this.startupField.appendChild(legendstartup)
    const startupServices = this.services.startup ?? []
    const hasStartup = startupServices.length > 0
    if ( hasStartup ) {
      this.buildStartupContainer()
      // Avec des services au démarrage
      startupServices.forEach((service) => {
        this.divSServices.appendChild(this.getServiceCard(service))
      })
    }
    div.appendChild(this.startupField)

    this.othersField = DCreate('FIELDSET', {id: `${divId}-others-field`, class:'services'})
    const legendautre = DCreate('LEGEND', {text: 'Autres services'})
    this.othersField.appendChild(legendautre)
    ;(this.services.others ?? []).forEach((service) => {
      this.othersField.appendChild(this.getServiceCard(service))
    })
    div.appendChild(this.othersField)

    const container = this.constructor[this.collapsed?'standbyContainer':'container']
    container.appendChild(div)
    this.observe()
  }

  // Détacché pour pouvoir être actualisé
  setBackground(div, background){
    const imgId       = `${this.divId}-bgimg`
    const imgDomFond  = DGet(`#${imgId}`)
    div = div ?? this.obj
    // console.log("background, DIV, imgDomFond", {background:background, div:div, imgFond:imgDomFond})
    if (background == 'none')  {
      div.style.background = ''
      imgDomFond && imgDomFond.remove()
      return 
    } else if (background[0] == '#' || background.startsWith('rgb')) {
      // Appliqué ci-dessous
    } else {
      // Puisqu'il n'y a pas de paramètre opacity pour l'image de fond,
      // on utile un détour : on affiche vraiment une image
      const imgFond     = DCreate('IMG', {id: imgId, src: this.background, style:'opacity:0.5;position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;'})
      if ( imgDomFond ) {
        // Update
        imgDomFond.replaceWith(imgFond)
      } else {
        // Création
        div.appendChild(imgFond)
      }
      background = ''
    }
    div.style.background = background

  }


  observe(){

    // Pour pouvoir modifier le titre
    listen(this.divTitle, 'click', this.modifyTitle.bind(this))
    this.obj.addEventListener('mousedown', this.onMouseDown.bind(this))

    // Pour pouvoir voir les tâches du projet
    listen(this.todoistCont, 'click', this.onClickTodoist.bind(this))

    // Pour mettre le projet en standby (ou le sortir)
    listen(this.standbyBtn, 'mousedown', this.standbyize.bind(this))
    listen(this.standbyBtn, 'mouseup', this.standbyize.bind(this))
    
    let dragged = null

    this.startupField.addEventListener("dragover", e => {e.preventDefault()})
    this.startupField.addEventListener("drop", e => {
        e.preventDefault();
        const service = Service.get(e.dataTransfer.getData("id"))
        // console.log("Drop sur la zone startup", service)
        this.addStartupService(service)
      })

    this.othersField.addEventListener("dragover", e => e.preventDefault())
    this.othersField.addEventListener("drop", e => {
          e.preventDefault();
          const service = Service.get(e.dataTransfer.getData("id"))
          // console.log("Drop sur la zone autres services", service)
          this.addOtherService(service)
      })
  }

  onMouseDown(ev){
    if (this.collapsed) return stopEvent(ev)
    if (!ev.target.closest(".service")) {
      this.constructor.onSelect(this)
      return stopEvent(ev)
    } else {
      return true
    }
  }

  /**
   * TODOIST
   */

  // return 'none', '', 'full', 'empty'
  todoistBadgeByTasks(){
    if (this.todoist_id) {
      return ''
    } else {
      return '-none'
    }
  }

  // Quand on clique sur le badge ou l'image todoist
  onClickTodoist(ev, tasks){
    if (ev && this.collapsed) return stopEvent(ev)
    ev && stopEvent(ev)
    if (tasks) {
      if (tasks.error){ raise(tasks.error) } 
      else {
        this.tasks = tasks
        new TasksDialog({
            title: 'Tâches Todoist'
          , q: getMsg('todoist-message-today-project-task', [this.title])
          , tasks: tasks
          , onCheck: this.onCheckTaskTodoist.bind(this)
          , onValidate: this.onValidateTodoist.bind(this)
          }).show()
      }      
    } else {
      Todoist.todayTasksFor(this, this.onClickTodoist.bind(this, null))
    }
  }

  // Fonction appelée quand on clique une tâche Todoist
  onCheckTaskTodoist(task, ev){
    // ev && stopEvent(ev)
    // console.log("TÂCHE À marquer achevée ", task)
    // console.log("ev", ev)
    task.checked = ev.target.checked
    return true
  }

  /**
   * Fonction appelée quand on fait ok pour valider la liste des 
   * tâches marquées achevées et les nouvelles tâches.
   * 
   * +newTasks+ est à entendre comme "tâches modifiées ou ajoutées"
   */
  onValidateTodoist(newTasks){
    // On passe par ici pour valider les tâches achevées et la
    // demande de création des nouvelles tâches
    var operations = []

    // -- Tâches marquées achevées --
    this.tasks.forEach(task => {
      if (task.checked) {
        operations.push(getMsg('mark-task-checked', task.content))
      }
    })

    if (operations.length == 0 && newTasks.length == 0){
      // Rien à confirmer
      return true
    } else if (operations.length == 0) {
      operations.push('<div class="italic">'+getMsg('todoist-no-task-done')+'</div><hr />')
    }
    if (newTasks) {
      // On ajoute les nouvelles tâches ou les tâches modifiées
      operations.push('<hr>')
      newTasks.forEach(newTask => {
        const msgId = newTask.ID ? 'todoist-text-mod-task' : 'todoist-text-new-task'
        operations.push('<div>' + getMsg( msgId, [newTask.content]) + '</div>')
      })
    } else {
      operations.push('<div class="italic">'+getMsg('todoist-no-new-task')+'</div>')
    }
    operations = "\n\n" + operations.join("\n") + "\n\n"
    new ConfirmDialog({
        title: getMsg('confirm-tasks-checks')
      , width: '800px'
      , q: getMsg('ask-for-confirm-tasks-checks', [this.title, operations])
      , ouiBtn: {name: getMsg('Confirm'), onclick: this.onMarkAndCreateTodoistTask.bind(this, newTasks)} 
      , nonBtn: {name: getMsg('Cancel')}
    }).show()
  }

  /**
   * C'est ici qu'on traite les tâches :
   *  - nouvelles
   *  - modifiées
   *  - marquées achevées
   */
  onMarkAndCreateTodoistTask(tasks){
    const done_ids  = this.tasks.filter(t => t.checked).map(t => t.id)
    const mod_tasks = tasks.filter(t => t.ID)
    const new_tasks = tasks.filter(t => (undefined == t.ID))
    // console.log("Liste des tâches à traiter", {done_ids, mod_tasks, new_tasks})
    Todoist.update_tasks(this, done_ids, new_tasks, mod_tasks, this.updateTasksAfterMarkAndCreate.bind(this))
  }

  /**
   * Retour de l'enregistrement des nouvelles tâches, des tâches
   * modifiées et des tâches achevées.
   * 
   * La fonction actualise la liste des tâches [TODO] et le
   * badge todoist pour refléter les changements [TODO]
   * 
   * @param retour Données remontées par le backend
   */
  updateTasksAfterMarkAndCreate(retour){
    console.log("-> updateTasksAfterMarkAndCreate", retour)
    const data = retour.data
    if (data.errors.length) {
      new ErrorsDialog({
          title: getMsg('todoist-errors-update-tasks')
        , errors: data.errors
      }).show()
    } else {
      this.tasks = data.today_tasks
      Reminder.destroy('task') // supprime tous les reminders de tâche
      this.setNombreTachesInBadge(this.tasks.length)
      this.reactiveIfTask(this.tasks)
      if (this.tasks.length) this.reactiveIfTask(this.tasks)
      message(true, getMsg('todoist-message-actualisation', [data.new_count, data.done_count, data.mod_count]))
    }
  }

  isTaskDueTodayOrBefore(task){
    if (!(task.due && task.due.date)) return false
    const today = new Date().toISOString().slice(0, 10)
    return task.due.date.slice(0, 10) <= today
  }

  // Au démarrage, cette fonction est appelée seulement sur les 
  // projets ayant un todoist_id pour charger les tâches courantes 
  // et afficher leur nombre dans un badge.
  getTachesAndSetBadges(callback){
    Todoist.todayTaskForNotInter(this, callback, 'not-interractif')
  }
  // Régler le badge en fonction du nombre de tâches (chargement)
  setTodoistBadge(tasks){
    // console.log("[Project.setTodoistBadge] Liste des tâches remontées", tasks)
    this.tasks = tasks
    const nombre = this.tasks.length
    if (nombre){
      this.reactiveIfTask(this.tasks)
    }
    this.setNombreTachesInBadge(nombre)
  }
  setNombreTachesInBadge(nombre){
    this.tasksBadge.textContent = nombre
    this.tasksBadge.classList[nombre?'remove':'add']('hidden')
  }

  /**
   * Fonction de test qui dans le cas de tâche aujourd'hui, réactive
   * un projet en standby.
   * Mais attention, il ne faut le faire que si la tâche ne comporte
   * pas d'heure ou que l'heure est dépassé.
   * 
   * Si la tâche a une heure dans le future, elle est programmée.
   */
  reactiveIfTask(tasks){
    var time
    // console.info("tasks du jour", tasks)
    if (tasks.length) {
      tasks.forEach(task => {
        task.avecHeure = DateUtils.hasHour(task.due.date)
        if (task.avecHeure) {
          // console.log("La task a une heure prévue", task)
          // On prend la date qui correspond à l'heure
          if (time = DateUtils.parseAsIso8601(task.due.date)) {
            // Time trouvé directement
          } else {
            time = DateUtils.todayWithTime(DateUtils.extractHourFrom(task.due.date))
          }
          // On enregistre un register qui affichera le début de la tâche à l'heure
          // voulu + réactivera le projet s'il est en standby
          const dataReminder = {
              message:  getMsg('task-due-to-start', [task.content])
            , time:     time
            , task:     task
            , project:  this
          }
          // Si le projet est en standby, on le réactivera
          if (this.collapsed) Object.assign(dataReminder, {onDue: this.reactive.bind(this)})
          // On enregistre le rappel
          Reminder.register(dataReminder)
        } else {
          // console.log("La task N'a PAS d'heure", task)
          // Si le projet est en standby, il faut le réactiver
          this.collapsed && this.reactive()
        }
      })
    }
  }

  remove(){
    server.send({action: 'remove-project', projectId: this.id}, this.afterRemove.bind(this))
  }
  // Archivage du projet
  archive(){
    server.send({action: 'archive-project', projectId: this.id}, this.afterRemove.bind(this))

  }
  afterRemove(retour){
    this.obj.remove()
    if (this.id == this.constructor.current.id) this.constructor.deselect(this)
    App.setData('projects-in', retour.data.newProjectsIn)
    App.setData('projects-out', retour.data.newProjectsOut)
  }
}