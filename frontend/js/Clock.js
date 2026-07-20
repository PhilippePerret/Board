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
class Clock {

  static get panel(){
    this._panel || this.build()
    return this._panel
  }

  static build(){
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
    this.handleMove = DCreate('DIV', {class: 'clock-handle-move', id: 'clock-handle-move'})
    panel.appendChild(this.handleMove)

    // Poignée de redimensionnement (bord haut, milieu horizontal) —
    // curseur contraint au déplacement vertical (cf. onResizeHandleDown).
    this.handleResize = DCreate('DIV', {class: 'clock-handle-resize', id: 'clock-handle-resize'})
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
    this.btnStop  = DCreate('BUTTON', {id: 'btn-clock-stop', class: 'clock-btn clock-btn-stop clock-btn-invisible', text: 'Stop'})
    btnRow.appendChild(this.btnStop)
    panel.appendChild(btnRow)

    document.body.appendChild(panel)

    this._panel       = panel
    this._wrap        = wrap
    this._ring        = DGet('#clock-ring', panel)
    this._digits      = DGet('#clock-digits', panel)
    this._stateMarker = stateMarker

    listen(this.btnStop,  'click', this.onClickStop.bind(this))

    // Un clic sur le rond (#clock-dial) fait avancer l'horloge d'un état
    // (start -> pause -> restart -> …). Déplacement/redimensionnement se
    // font désormais via des poignées dédiées (jamais le rond) : plus
    // d'ambiguïté clic/drag à gérer ici.
    listen(this._wrap, 'click', this.onWrapClick.bind(this))

    listen(this.handleMove,   'mousedown', this.onMoveHandleDown.bind(this))
    listen(this.handleResize, 'mousedown', this.onResizeHandleDown.bind(this))
    listen(document, 'mousemove', this.onDragMove.bind(this))
    listen(document, 'mouseup', this.onDragEnd.bind(this))

    listen(this.btnClose, 'click', this.close.bind(this))

    this.setScale(App.getData('clock-scale') ?? 1)
  }

  static get MIN_SCALE(){ return 0.6 }
  // px de glissé vertical pour faire varier le scale de 1 unité
  static get RESIZE_DIVISOR(){ return 150 }

  // Limite haute du scale : le haut du panneau ne doit jamais dépasser le
  // bas du header (le bas, lui, reste posé sur le haut du footer).
  static getMaxScale(){
    const headerH = document.querySelector('header').getBoundingClientRect().height
    const footerH = document.querySelector('footer').getBoundingClientRect().height
    const available  = window.innerHeight - headerH - footerH
    // offsetHeight reflète déjà le scale courant (dimensions posées en
    // calc() dans le CSS, plus de transform) — on en déduit la hauteur de
    // base (scale 1) pour calculer combien d'unités de scale tiennent.
    const baseHeight = this._panel.offsetHeight / (this._scale || 1)
    return Math.max(this.MIN_SCALE, available / baseHeight)
  }

  static setScale(value){
    this._scale = value
    this._panel.style.setProperty('--clock-scale', value)
  }

  static onWrapClick(){
    this.onClickRing()
  }

  // Déplacement HORIZONTAL du panneau (le "bottom" CSS n'est jamais touché)
  static onMoveHandleDown(ev){
    this._dragging       = true
    this._dragStartX     = ev.clientX
    this._panelStartLeft = this._panel.getBoundingClientRect().left
    this._panel.classList.add('dragging')
    stopEvent(ev)
  }

  // Redimensionnement : seul le déplacement VERTICAL de la souris compte
  // (poignée en haut, ancrage du scale en bas-gauche — monter agrandit).
  static onResizeHandleDown(ev){
    this._resizing          = true
    this._resizeStartY      = ev.clientY
    this._resizeStartScale  = this._scale
    this._panel.classList.add('resizing')
    stopEvent(ev)
  }

  static onDragMove(ev){
    if (this._resizing) {
      const dy = ev.clientY - this._resizeStartY
      const newScale = this._resizeStartScale + (-dy) / this.RESIZE_DIVISOR
      this.setScale(Math.max(this.MIN_SCALE, Math.min(this.getMaxScale(), newScale)))
      return
    }
    if (!this._dragging) return
    const dx = ev.clientX - this._dragStartX
    const maxLeft = window.innerWidth - this._panel.getBoundingClientRect().width
    const newLeft = Math.max(0, Math.min(maxLeft, this._panelStartLeft + dx))
    this._panel.style.left = newLeft + 'px'
  }
  static onDragEnd(){
    if (this._resizing) {
      this._resizing = false
      this._panel.classList.remove('resizing')
      App.setData('clock-scale', this._scale)
      App.saveData()
      return
    }
    if (this._dragging) {
      this._dragging = false
      this._panel.classList.remove('dragging')
    }
  }

  /**
   * @param projet Le projet courant
   * @param data   [sessionDuration, workDuration] en minutes (projet.common_services_data['work-clock'])
   */
  static get MIN_MINUTES(){ return 1 }
  static get FALLBACK_MINUTES(){ return 15 }

  static open(projet, data){
    this.projet         = projet
    // Aucune durée (session ou tranche) en dessous d'1 minute : remplacée par 15 min
    const sessionMinutes = data[0] < this.MIN_MINUTES ? this.FALLBACK_MINUTES : data[0]
    const workMinutes    = data[1] < this.MIN_MINUTES ? this.FALLBACK_MINUTES : data[1]
    this.sessionDuration = sessionMinutes * 60 // secondes
    this.workDuration    = workMinutes * 60 // secondes (durée d'une tranche)

    this.startTime   = null
    this.pauseStart  = null
    this.totalPaused = 0
    this.intervalId  = null
    this.paused      = false
    this.warned      = false // passage à 10 min de l'échéance déjà signalé ?
    this.ended       = false // passage à l'échéance déjà signalé ?

    this.panel // s'assure que le panneau est construit
    this._panel.classList.remove('clock-warning', 'clock-danger')
    this._stateMarker.textContent = 'normal'
    this.updateDisplay()
    this.setState('prelaunch')
    this.panel.classList.remove('hidden')
  }

  static close(){
    this.stopTicking()
    this.stopWorkCheck()
    this.stopPauseCheck()
    this.panel.classList.add('hidden')
  }


  static get CHECK_INTERVAL_MS(){ return 30000 }

  // Vérifie périodiquement (30s), pendant que l'horloge tourne, que le
  // travail est bien toujours en cours. TODO (Phil) : la détection réelle
  // reste à brancher — pour l'instant le check se déclenche systématiquement.
  static startWorkCheck(){
    this.stopWorkCheck()
    this.workCheckId = setInterval(this.checkStillWorking.bind(this), this.CHECK_INTERVAL_MS)
  }
  static stopWorkCheck(){
    if (this.workCheckId) { clearInterval(this.workCheckId); this.workCheckId = null }
  }
  static checkStillWorking(){
    return null // débranché (Phil s'en occupe lui-même) — TODO
    this.promptCheck(
      "Le travail est-il toujours en cours sur ce projet ?",
      "Mettre en pause",
      this.onClickRing.bind(this)
    )
  }

  // Vérifie périodiquement (30s), pendant la pause, que le travail n'a pas
  // repris sans clic sur le rond. Même remarque TODO que ci-dessus.
  static startPauseCheck(){
    this.stopPauseCheck()
    this.pauseCheckId = setInterval(this.checkStillPaused.bind(this), this.CHECK_INTERVAL_MS)
  }
  static stopPauseCheck(){
    if (this.pauseCheckId) { clearInterval(this.pauseCheckId); this.pauseCheckId = null }
  }
  static checkStillPaused(){
    return null // débranché (Phil s'en occupe lui-même) — TODO
    this.promptCheck(
      "Le travail a-t-il repris (l'horloge est en pause) ?",
      "Redémarrer",
      this.onClickRing.bind(this) // même bascule : relance le décompte
    )
  }

  // Fait passer Board au premier plan puis affiche le dialogue de check.
  // Un seul dialogue de check à la fois (garde contre l'empilement si
  // l'user ignore plusieurs checks de suite).
  static promptCheck(message, actionLabel, actionFn){
    if (this._checkDialogOpen) return
    this._checkDialogOpen = true
    const clear = () => { this._checkDialogOpen = false }
    server.send({action: 'run-osascript', 'script-name': 'ActivateApp'}, () => {
      new ConfirmDialog({
          title: "Horloge de travail"
        , message: message
        , ouiBtn: {name: actionLabel, onclick: () => { clear(); actionFn() }}
        , nonBtn: {name: 'Ignorer', onclick: clear}
      }).show()
    })
  }

  // Secondes réellement jouées, pauses exclues
  static getElapsedSeconds(){
    if (!this.startTime) return 0
    const pausedMs = (this.paused && this.pauseStart) ? (Date.now() - this.pauseStart) : 0
    return (Date.now() - this.startTime - this.totalPaused - pausedMs) / 1000
  }

  static startTicking(){
    if (this.intervalId) return
    this.intervalId = setInterval(this.tick.bind(this), 250)
  }
  static stopTicking(){
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null }
  }

  static tick(){
    if (this.paused) return
    this.updateDisplay()
  }

  static updateDisplay(){
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
    const isWarn = remaining <= 600 && remaining > 0
    const isEnd  = remaining <= 0
    this._panel.classList.toggle('clock-warning', isWarn)
    this._panel.classList.toggle('clock-danger', isEnd)
    this._stateMarker.textContent = isEnd ? 'danger' : (isWarn ? 'warning' : 'normal')
  }

  static setState(state){
    if (state === 'prelaunch') {
      this.btnStop.classList.add('clock-btn-invisible')
    } else if (state === 'running') {
      this.btnStop.classList.remove('clock-btn-invisible')
    }
  }

  // Un clic (sans déplacement) sur le rond fait avancer l'horloge d'un
  // état : pas démarrée -> start ; en marche -> pause ; en pause -> restart.
  static onClickRing(){
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
  }

  static onClickStop(){
    this.stopTicking()
    this.stopWorkCheck()
    this.stopPauseCheck()
    this.paused = true
    this.pendingElapsedMinutes = Math.round(this.getElapsedSeconds() / 60)
    this.promptChangelog()
  }

  static promptChangelog(){
    new TextareaDialog({
        title: "Fin de séance"
      , id: 'clock_changelog'
      , message: "Travail accompli lors de cette séance : "
      , defaultValue: ''
      , width: '620px'
      , ouiBtn: {name: 'Suivant', onclick: this.onChangelogEntered.bind(this)}
      , nonBtn: {name: 'Annuler'}
    }).show()
  }

  static onChangelogEntered(value){
    this.pendingChangelog = value
    this.promptTodo()
  }

  static promptTodo(){
    new TextareaDialog({
        title: "Fin de séance"
      , id: 'clock_todo'
      , message: "Programme pour la fois prochaine :"
      , defaultValue: ''
      , width: '620px'
      , ouiBtn: {name: 'Enregistrer', onclick: this.onTodoEntered.bind(this)}
      , nonBtn: {name: 'Annuler'}
    }).show()
  }

  static onTodoEntered(todo){
    this.finalizeStop(this.pendingChangelog, todo)
  }

  static finalizeStop(changelog, todo){
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
        if (workDiv) workDiv.textContent = 'Temps de travail : ' + this.projet.workTime
      })

      this.close()
      message(`Séance terminée : ${this.pendingElapsedMinutes} min.`)
    })
  }

}
