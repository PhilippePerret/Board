/**
 * Horloge de séance de travail (service commun "work-clock")
 *
 * Adapté de /Users/philippeperret/Programmes/Todoist-server/minuteur
 * (timer.html) — ici en overlay intégré à la page (pas de popup séparée,
 * pas de serveur HTTP : tout se passe dans la même WKWebView).
 *
 * État courant (2026-07-12) : Start/Pause/Restart/Stop + affichage du temps
 * restant sur la tranche de travail. Stop enchaîne 2 TextareaDialog
 * (changelog puis todo), écrit CHANGELOG.md/TODO.md à la racine du projet
 * (backend 'update-project-notes', ajout en tête de fichier) puis incrémente
 * projet.workTime.
 */
const DIX_MINUTES = 600

class Clock extends Draggable {

  // Une seule horloge dans l'app : instance unique paresseuse (construite
  // au premier accès, pas au chargement du script).
  static get instance(){
    return this._instance || (this._instance = new Clock())
  }

  get panel(){
    this._panel || this.build()
    return this._panel
  }

  build(){
    const panel = DCreate('DIV', {class: 'clock-panel hidden'})

    const wrap = DCreate('DIV', {class: 'clock-wrap', id: 'clock-dial'})
    wrap.innerHTML = `
      <svg class="clock-ring-svg" viewBox="0 0 160 160">
        <circle class="clock-ring-bg" cx="80" cy="80" r="72"/>
        <circle class="clock-ring-progress" id="clock-ring" cx="80" cy="80" r="72"/>
      </svg>
      <div class="clock-digits" id="clock-digits">--:--</div>
    `
    panel.appendChild(wrap)

    // Poignée de déplacement (bord droit, milieu vertical) — horizontal
    // seulement, "bottom" n'est jamais touché (cf. onDragMove).
    // role: 'group' : sans ça, un DIV vide (pas de texte direct) disparaît
    // de l'arbre d'accessibilité (cf. Project.js, même pattern) — invisible
    // pour le moteur de test "drag" (JXA/accessibilité).
    this.handleMove = DCreate('DIV', {class: 'clock-handle-move', id: 'clock-handle-move', role: 'group'})
    panel.appendChild(this.handleMove)

    // Poignée de redimensionnement (bord haut, milieu horizontal) —
    // curseur contraint au déplacement vertical (cf. onResizeHandleDown).
    this.handleResize = DCreate('DIV', {class: 'clock-handle-resize', id: 'clock-handle-resize', role: 'group'})
    panel.appendChild(this.handleResize)

    // Croix de fermeture (haut droite)
    this.btnClose = DCreate('DIV', {class: 'clock-close', id: 'clock-close', text: '×'})
    panel.appendChild(this.btnClose)

    // Marqueur texte, invisible mais présent dans l'arbre d'accessibilité
    // (contrairement à display:none) — sert uniquement aux tests e2e (AX
    // n'a pas accès aux classes CSS) à lire l'état d'alerte courant.
    const stateMarker = DCreate('SPAN', {id: 'clock-state-marker', text: 'normal'})
    stateMarker.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;'
    panel.appendChild(stateMarker)

    const btnRow = DCreate('DIV', {class: 'clock-btn-row'})
    this.btnStop  = DCreate('BUTTON', {id: 'btn-clock-stop', class: 'clock-btn clock-btn-stop clock-btn-invisible'})
    this.btnStop.appendChild(DCreate('SPAN', {class: 'clock-icon clock-icon-stop'}))
    btnRow.appendChild(this.btnStop)
    this.btnToggle  = DCreate('BUTTON', {id: 'btn-clock-toggle', class: 'clock-btn clock-btn-toggle'})
    this.toggleIcon = DCreate('SPAN', {class: 'clock-icon clock-icon-start'})
    this.btnToggle.appendChild(this.toggleIcon)
    btnRow.appendChild(this.btnToggle)
    panel.appendChild(btnRow)

    document.body.appendChild(panel)

    this._panel       = panel
    this._wrap        = wrap
    this._ring        = DGet('#clock-ring', panel)
    this._digits      = DGet('#clock-digits', panel)
    this._stateMarker = stateMarker

    listen(panel, 'mousedown', ev => { this._clickedTarget = ev.target })
    listen(panel, 'mouseup',   ev => {
      if (ev.target === this._clickedTarget) this.onClickRing()
      this._clickedTarget = null
    })

    listen(this.handleResize, 'mouseup', ev => { this.onDragEnd(); stopEvent(ev) })
    listen(this.handleResize, 'mousedown', this.onResizeHandleDown.bind(this))
    
    this.listenMove(this.handleMove, this._panel)

    listen(this.btnStop, 'mouseup', ev => { this.onClickStop(); stopEvent(ev) })

    listen(this.btnClose, 'mousedown', ev => { this._closeClickedTarget = ev.target })
    listen(this.btnClose, 'mouseup',   ev => {
      if (ev.target === this._closeClickedTarget) this.close()
      this._closeClickedTarget = null
      stopEvent(ev)
    })

    this.setScale(App.getData('clock-scale') ?? 1)
  }

  get MIN_SCALE(){ return 0.6 }
  // px de glissé vertical pour faire varier le scale de 1 unité
  get RESIZE_DIVISOR(){ return 150 }

  // Limite haute du scale : le haut du panneau ne doit jamais dépasser le
  // bas du header (le bas, lui, reste posé sur le haut du footer).
  getMaxScale(){
    const headerH = document.querySelector('header').getBoundingClientRect().height
    const footerH = document.querySelector('footer').getBoundingClientRect().height
    const available  = window.innerHeight - headerH - footerH
    // offsetHeight reflète déjà le scale courant (dimensions posées en
    // calc() dans le CSS, plus de transform) — on en déduit la hauteur de
    // base (scale 1) pour calculer combien d'unités de scale tiennent.
    const baseHeight = this._panel.offsetHeight / (this._scale || 1)
    return Math.max(this.MIN_SCALE, available / baseHeight)
  }

  setScale(value){
    this._scale = value
    this._panel.style.setProperty('--clock-scale', value)
  }

  onPanelClick(ev){
    if (ev.target.closest('.clock-btn-stop, .clock-close')) return
    this.onClickRing()
  }

  // Redimensionnement : seul le déplacement VERTICAL de la souris compte
  // (poignée en haut, ancrage du scale en bas-gauche — monter agrandit).
  onResizeHandleDown(ev){
    this._resizing          = true
    this._resizeStartY      = ev.clientY
    this._resizeStartScale  = this._scale
    this._panel.classList.add('resizing')
    stopEvent(ev)
  }

  beforeDragMove(ev){
    if (this._resizing) {
      const dy = ev.clientY - this._resizeStartY
      const newScale = this._resizeStartScale + (-dy) / this.RESIZE_DIVISOR
      this.setScale(Math.max(this.MIN_SCALE, Math.min(this.getMaxScale(), newScale)))
      return
    }
  }
  afterDragEnd(){
    App.setData('clock-scale', this._scale)
    App.saveData()
  }

  /**
   * @param projet Le projet courant
   * @param data   [sessionDuration, workDuration] en minutes (projet.common_services_data['work-clock'])
   */
  get MIN_MINUTES(){ return 1 }
  get FALLBACK_MINUTES(){ return 15 }

  // Appelé depuis le bouton du service (ServiceData.js) : ferme l'horloge
  // si elle est déjà ouverte, sinon l'ouvre normalement.
  toggle(projet, data){
    // console.log("-> Clock.toggle", projet, data)
    if (this._panel && !this._panel.classList.contains('hidden')) {
      this.close()
    } else {
      this.open(projet, data)
    }
  }

  open(projet, data){
    console.log("-> open")
    this.projet         = projet
    // Aucune durée (session ou tranche) en dessous d'1 minute : remplacée par 15 min
    const sessionMinutes = data[0] < this.MIN_MINUTES ? this.FALLBACK_MINUTES : data[0]
    const workMinutes    = data[1] < this.MIN_MINUTES ? this.FALLBACK_MINUTES : data[1]
    this.sessionDuration = sessionMinutes * 60  // secondes
    this.workDuration    = workMinutes * 60     // secondes (durée d'une tranche)

    this.startTime    = null
    this.pauseStart   = null
    this.totalPaused  = 0
    this.intervalId   = null
    this.paused       = false
    this.warned       = false // passage à 10 min de l'échéance déjà signalé ?
    this.ended        = false // passage à l'échéance déjà signalé ?
    this.normed       = false // pas encore à 10 minutes

    this.panel // s'assure que le panneau est construit
    this._panel.classList.remove('clock-warning', 'clock-danger')
    this._stateMarker.textContent = 'normal'
    this.updateDisplay()
    this.setState('prelaunch')
    this.updateToggleIcon()
    this.panel.classList.remove('hidden')
  }

  close(){
    this.stopTicking()
    this.stopWorkCheck()
    this.stopPauseCheck()
    this.panel.classList.add('hidden')
  }


  get CHECK_INTERVAL_MS(){ return 30000 }

  // Vérifie périodiquement (30s), pendant que l'horloge tourne, que le
  // travail est bien toujours en cours. TODO (Phil) : la détection réelle
  // reste à brancher — pour l'instant le check se déclenche systématiquement.
  startWorkCheck(){
    this.stopWorkCheck()
    this.workCheckId = setInterval(this.checkStillWorking.bind(this), this.CHECK_INTERVAL_MS)
  }
  stopWorkCheck(){
    if (this.workCheckId) { clearInterval(this.workCheckId); this.workCheckId = null }
  }
  checkStillWorking(){
    return null // débranché (Phil s'en occupe lui-même) — TODO
    this.promptCheck(
      getMsg('ask-still-working', this.projet.title),
      getMsg('clock-set-pause'),
      this.onClickRing.bind(this)
    )
  }

  // Vérifie périodiquement (30s), pendant la pause, que le travail n'a pas
  // repris sans clic sur le rond. Même remarque TODO que ci-dessus.
  startPauseCheck(){
    this.stopPauseCheck()
    this.pauseCheckId = setInterval(this.checkStillPaused.bind(this), this.CHECK_INTERVAL_MS)
  }
  stopPauseCheck(){
    if (this.pauseCheckId) { clearInterval(this.pauseCheckId); this.pauseCheckId = null }
  }
  checkStillPaused(){
    return null // débranché (Phil s'en occupe lui-même) — TODO
    this.promptCheck(
      getMsg('clock-ask-work-restarted'),
      getMsg('clock-restart'),
      this.onClickRing.bind(this) // même bascule : relance le décompte
    )
  }

  // Fait passer Board au premier plan puis affiche le dialogue de check.
  // Un seul dialogue de check à la fois (garde contre l'empilement si
  // l'user ignore plusieurs checks de suite).
  promptCheck(message, actionLabel, actionFn){
    if (this._checkDialogOpen) return
    this._checkDialogOpen = true
    const clear = () => { this._checkDialogOpen = false }
    server.send({action: 'run-osascript', 'script-name': 'ActivateApp'}, () => {
      new ConfirmDialog({
          title: getMsg('Minuteur')
        , message: message
        , ouiBtn: {name: actionLabel, onclick: () => { clear(); actionFn() }}
        , nonBtn: {name: getMsg('Ignore'), onclick: clear}
      }).show()
    })
  }

  // Secondes réellement jouées, pauses exclues
  getElapsedSeconds(){
    if (!this.startTime) return 0
    const pausedMs = (this.paused && this.pauseStart) ? (Date.now() - this.pauseStart) : 0
    return (Date.now() - this.startTime - this.totalPaused - pausedMs) / 1000
  }

  startTicking(){
    if (this.intervalId) return
    this.intervalId = setInterval(this.tick.bind(this), 250)
  }
  stopTicking(){
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null }
  }

  tick(){
    if (this.paused) return
    this.updateDisplay()
  }

  updateDisplay(){
    const elapsed   = this.getElapsedSeconds()
    const remaining = Math.max(0, this.workDuration - elapsed)
    const pad = n => String(Math.floor(n)).padStart(2, '0')
    const h = Math.floor(remaining / 3600)
    const m = Math.floor((remaining % 3600) / 60)
    const s = Math.floor(remaining % 60)
    this._digits.textContent = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`

    const R = 72, CIRCUMFERENCE = 2 * Math.PI * R
    this._ring.setAttribute('stroke-dasharray', CIRCUMFERENCE)
    this._ring.setAttribute('stroke-dashoffset', CIRCUMFERENCE * (1 - remaining / this.workDuration))

    // Seuils d'alerte : orange à 10 min de l'échéance, rouge à l'échéance
    // (modèle : Todoist-server/minuteur/timer.html, classes body.warn/.end)
    if (remaining <= DIX_MINUTES) {
      if (!this.warned) {
        this._panel.classList.toggle('clock-warning', true)
        this.notify({message: getMsg('clock-10-minutes-remaining'), font_color: 'black', background: 'rgb(255, 179, 0)'})
        this._stateMarker.textContent = 'warning'
        this.warned = true
      }
      if (remaining <= 0 && !this.ended) {
        this._panel.classList.toggle('clock-danger', true)
        this.notify({message: getMsg('clock-work-is-done'), background: '#CC0000'})
        this._stateMarker.textContent = 'danger'
        this.ended = true
      }
    } else if (!this.normed) {
      this._stateMarker.textContent = 'normal'
      this.normed = true
    }
  }

  notify(data){
    data.message = data.message + getMsg('of-work-on-project', [Project.current.title])
    Notifier.notify(Object.assign({
          delay: 30
        , opacity: 1
        , mode: 'floating'
        , icon: 'images/minuteur.svg'
        , font_color: 'white'
     }, data))

  }

  
  setState(state){
    if (state === 'prelaunch') {
      this.btnStop.classList.add('clock-btn-invisible')
    } else if (state === 'running') {
      this.btnStop.classList.remove('clock-btn-invisible')
    }
  }

  // Icône du bouton toggle : triangle (démarrer) / pause (en marche) /
  // triangle+barre (reprendre après pause).
  updateToggleIcon(){
    const iconClass = !this.startTime ? 'clock-icon-start'
      : this.paused ? 'clock-icon-restart'
      : 'clock-icon-pause'
    this.toggleIcon.className = 'clock-icon ' + iconClass
  }

  // Un clic (sans déplacement) sur le rond fait avancer l'horloge d'un
  // état : pas démarrée -> start ; en marche -> pause ; en pause -> restart.
  onClickRing(){
    if (!this.startTime) {
      this.startTime = Date.now()
      this.paused = false
      this.startTicking()
      this.startWorkCheck()
      this.setState('running')
    } else if (this.paused) {
      this.totalPaused += Date.now() - this.pauseStart
      this.pauseStart = null
      this.paused = false
      this.stopPauseCheck()
      this.startTicking()
      this.startWorkCheck()
    } else {
      this.pauseStart = Date.now()
      this.paused = true
      this.stopTicking()
      this.stopWorkCheck()
      this.startPauseCheck()
    }
    this.updateToggleIcon()
  }

  onClickStop(){
    this.stopTicking()
    this.stopWorkCheck()
    this.stopPauseCheck()
    this.pauseStart = Date.now()
    this.paused = true
    this.updateToggleIcon()
    this.pendingElapsedMinutes = Math.round(this.getElapsedSeconds() / 60)
    this.promptChangelog()
  }

  promptChangelog(){
    new TextareaDialog({
        title: getMsg('End-of-session')
      , id: 'clock_changelog'
      , message: getMsg('clock-work-done')
      , default: ''
      , width: '620px'
      , ouiBtn: {name: getMsg('Next'), onclick: this.onChangelogEntered.bind(this)}
      , nonBtn: {name: getMsg('Cancel')}
    }).show()
  }

  onChangelogEntered(value){
    this.pendingChangelog = value
    this.promptTodo()
  }

  promptTodo(){
    new TextareaDialog({
        title: getMsg('End-of-session')
      , id: 'clock_todo'
      , message: getMsg('clock-todo-next-session')
      , default: ''
      , width: '620px'
      , ouiBtn: {name: getMsg('Save'), onclick: this.onTodoEntered.bind(this)}
      , nonBtn: {name: getMsg('Cancel')}
    }).show()
  }

  onTodoEntered(todo){
    this.finalizeStop(this.pendingChangelog, todo)
  }

  finalizeStop(changelog, todo){
    server.send({
        action:     'update-project-notes'
      , path:       this.projet.path
      , changelog:  changelog
      , todo:       todo
    }, () => {
      // projet.workTime = temps de travail TOTAL cumulé sur le projet —
      // distinct de common_services_data['work-clock'] (durée fixe d'une tranche, réglée
      // une fois)
      this.projet.workTime = (this.projet.workTime ?? 0) + this.pendingElapsedMinutes
      this.projet.save(() => {
        const workDiv = DGet('.worktime', this.projet.obj)
        if (workDiv) workDiv.textContent = getMsg('clock-work-time') + getMsg(':')+ this.projet.workTime
      })

      this.close()
      message(`Séance terminée : ${this.pendingElapsedMinutes} min.`)
    })
  }

}
