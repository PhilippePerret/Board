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

    const wrap = DCreate('DIV', {class: 'clock-wrap'})
    wrap.innerHTML = `
      <svg class="clock-ring-svg" viewBox="0 0 160 160">
        <circle class="clock-ring-bg" cx="80" cy="80" r="72"/>
        <circle class="clock-ring-progress" id="clock-ring" cx="80" cy="80" r="72"/>
      </svg>
      <div class="clock-digits" id="clock-digits">--:--</div>
    `
    panel.appendChild(wrap)

    const btnRow = DCreate('DIV', {class: 'clock-btn-row'})
    this.btnStart = DCreate('BUTTON', {id: 'btn-clock-start', class: 'clock-btn clock-btn-start', text: 'Start'})
    this.btnPause = DCreate('BUTTON', {id: 'btn-clock-pause', class: 'clock-btn hidden', text: 'Pause'})
    this.btnStop  = DCreate('BUTTON', {id: 'btn-clock-stop', class: 'clock-btn clock-btn-stop hidden', text: 'Stop'})
    btnRow.appendChild(this.btnStart)
    btnRow.appendChild(this.btnPause)
    btnRow.appendChild(this.btnStop)
    panel.appendChild(btnRow)

    document.body.appendChild(panel)

    this._panel  = panel
    this._ring   = DGet('#clock-ring', panel)
    this._digits = DGet('#clock-digits', panel)

    listen(this.btnStart, 'click', this.onClickStart.bind(this))
    listen(this.btnPause, 'click', this.onClickPause.bind(this))
    listen(this.btnStop,  'click', this.onClickStop.bind(this))

    // Déplacement HORIZONTAL seulement (le "bottom" CSS n'est jamais touché)
    listen(panel, 'mousedown', this.onDragStart.bind(this))
    listen(document, 'mousemove', this.onDragMove.bind(this))
    listen(document, 'mouseup', this.onDragEnd.bind(this))
  }

  static onDragStart(ev){
    if (ev.target.closest('.clock-btn')) return
    this._dragging     = true
    this._dragStartX   = ev.clientX
    this._panelStartLeft = this._panel.getBoundingClientRect().left
    this._panel.classList.add('dragging')
    stopEvent(ev)
  }
  static onDragMove(ev){
    if (!this._dragging) return
    const dx = ev.clientX - this._dragStartX
    const maxLeft = window.innerWidth - this._panel.offsetWidth
    const newLeft = Math.max(0, Math.min(maxLeft, this._panelStartLeft + dx))
    this._panel.style.left = newLeft + 'px'
  }
  static onDragEnd(){
    this._dragging = false
    this._panel.classList.remove('dragging')
  }

  /**
   * @param projet Le projet courant
   * @param data   [sessionDuration, workDuration] en minutes (projet.sdata['work-clock'])
   */
  static open(projet, data){
    this.projet         = projet
    this.sessionDuration = data[0] * 60 // secondes
    this.workDuration    = data[1] * 60 // secondes (durée d'une tranche)

    this.startTime   = null
    this.pauseStart  = null
    this.totalPaused = 0
    this.intervalId  = null
    this.paused      = false

    this.panel // s'assure que le panneau est construit
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
    this.promptCheck(
      "Le travail est-il toujours en cours sur ce projet ?",
      "Mettre en pause",
      this.onClickPause.bind(this)
    )
  }

  // Vérifie périodiquement (30s), pendant la pause, que le travail n'a pas
  // repris sans clic sur "Restart". Même remarque TODO que ci-dessus.
  static startPauseCheck(){
    this.stopPauseCheck()
    this.pauseCheckId = setInterval(this.checkStillPaused.bind(this), this.CHECK_INTERVAL_MS)
  }
  static stopPauseCheck(){
    if (this.pauseCheckId) { clearInterval(this.pauseCheckId); this.pauseCheckId = null }
  }
  static checkStillPaused(){
    this.promptCheck(
      "Le travail a-t-il repris (l'horloge est en pause) ?",
      "Redémarrer",
      this.onClickPause.bind(this) // même bascule : relance le décompte
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
  }

  static setState(state){
    if (state === 'prelaunch') {
      this.btnStart.classList.remove('hidden')
      this.btnPause.classList.add('hidden')
      this.btnStop.classList.add('hidden')
    } else if (state === 'running') {
      this.btnStart.classList.add('hidden')
      this.btnPause.classList.remove('hidden')
      this.btnPause.textContent = 'Pause'
      this.btnStop.classList.remove('hidden')
    }
  }

  static onClickStart(){
    if (!this.startTime) this.startTime = Date.now()
    this.paused = false
    this.startTicking()
    this.startWorkCheck()
    this.setState('running')
  }

  // Bascule Pause <-> Restart
  static onClickPause(){
    if (this.paused) {
      this.totalPaused += Date.now() - this.pauseStart
      this.pauseStart = null
      this.paused = false
      this.stopPauseCheck()
      this.startTicking()
      this.startWorkCheck()
      this.btnPause.textContent = 'Pause'
    } else {
      this.pauseStart = Date.now()
      this.paused = true
      this.stopTicking()
      this.stopWorkCheck()
      this.startPauseCheck()
      this.btnPause.textContent = 'Restart'
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

  static onChangelogEntered(values){
    this.pendingChangelog = values[0]
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

  static onTodoEntered(values){
    const todo = values[0]
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
      // distinct de sdata['work-clock'] (durée fixe d'une tranche, réglée
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
