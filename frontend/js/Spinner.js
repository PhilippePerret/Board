// Message de progression fiable — remplace l'ancien sablier animé.
class Spinner {

  static MIN_VISIBLE_MS = 300

  static build(){
    const el = DCreate('DIV', {id: 'spinner-message'})
    document.body.appendChild(el)

    this._el = el
    this._built = true
  }

  static get el(){
    this._built || this.build()
    return this._el
  }

  // Deux requestAnimationFrame imbriqués : le 1er se déclenche juste avant
  // le prochain repaint (message pas encore peint), le 2e après ce repaint
  // — donc ce qui suit ne s'exécute qu'une fois le message réellement à
  // l'écran. + garde une durée minimum mesurable (MIN_VISIBLE_MS) avant
  // qu'un continue/stop puisse changer ce qui est affiché.
  static ensureVisible(callback){
    this._shownAt = null
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this._shownAt = Date.now()
      callback()
    }))
  }

  static afterMinVisibleDelay(fn){
    const elapsed = this._shownAt ? (Date.now() - this._shownAt) : 0
    const remaining = Math.max(0, this.MIN_VISIBLE_MS - elapsed)
    remaining > 0 ? setTimeout(fn, remaining) : fn()
  }

  // Repart de "blanc" : pas de fondu depuis un texte précédent, le compteur
  // (plusieurs appelants peuvent tenir le message ouvert en même temps,
  // comme l'ancien sablier) repart à 1.
  static start(message, fonction, options = {}){
    this._count = (this._count || 0) + 1
    clearTimeout(this._stopTimeout)
    this.el.classList.remove('dissolving')
    this.el.classList.remove('visible')
    this.el.textContent = message || ''
    if (message) {
      // Forcer le passage par l'état invisible avant de repasser visible,
      // sinon le navigateur peut fusionner les deux et sauter la transition.
      void this.el.offsetHeight
      this.el.classList.add('visible')
      this.ensureVisible(() => this.afterMinVisibleDelay(() => fonction && fonction()))
    } else {
      // Appel rétrocompatible sans message (anciens appelants) : pas de
      // texte affiché, juste le visuel tenu ouvert.
      fonction && fonction()
    }
  }

  // Le cycle est déjà ouvert (start a été appelé) : transition en fondu
  // vers le nouveau message, même garantie d'affichage avant fonction().
  static continue(message, fonction, options = {}){
    this.el.classList.remove('dissolving')
    this.el.classList.remove('visible') // fondu sortant du message précédent
    void this.el.offsetHeight
    setTimeout(() => {
      this.el.textContent = message || ''
      void this.el.offsetHeight
      this.el.classList.add('visible') // fondu entrant du nouveau message
      this.ensureVisible(() => this.afterMinVisibleDelay(() => fonction && fonction()))
    }, 350) // durée du fondu sortant (transition CSS ci-dessus)
  }

  // Fin du cycle. Avec message : reste affiché puis se dissout lentement
  // (comme message(true, …), Messagerie.js). Sans message (appels
  // rétrocompatibles) : cache directement.
  static stop(message){
    this._count = Math.max(0, (this._count || 0) - 1)
    if (this._count > 0) return
    if (!this._built) return
    if (message) {
      this.el.textContent = message
      this.el.classList.add('visible')
      this._stopTimeout = setTimeout(() => {
        this.el.classList.add('dissolving')
        this.el.classList.remove('visible')
      }, 2000)
    } else {
      this.el.classList.remove('visible')
    }
  }

}
