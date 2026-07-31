/**
 * Pour les objets déplaçable (horloge, panneau service, etc.)
 */
class Draggable {

  static listenMove(obj){
    this._panel = obj
    listen(obj,   'mouseup', ev => { this.onDragEnd(); stopEvent(ev) })
    listen(obj,   'mousedown', this.onMoveHandleDown.bind(this))
    listen(document, 'mousemove', this.onDragMove.bind(this))
    listen(document, 'mouseup'  , this.onDragEnd.bind(this))

  }

  static beforeDragMove(ev){}
  static onDragMove(ev){
    this.beforeDragMove(ev)
    if (!this._dragging) return
    const dx = ev.clientX - this._dragStartX
    const maxLeft = window.innerWidth - this._panel.getBoundingClientRect().width
    const newLeft = Math.max(0, Math.min(maxLeft, this._panelStartLeft + dx))
    this._panel.style.left = newLeft + 'px'
    this.afterDragMove(ev)
  }
  static afterDragMove(ev){}

  // Déplacement HORIZONTAL du panneau (le "bottom" CSS n'est jamais touché)
  // TODO Pouvoir définir la contrainte ('h', 'v' ou '')
  static onMoveHandleDown(ev){
    this._dragging       = true
    this._dragStartX     = ev.clientX
    this._panelStartLeft = this._panel.getBoundingClientRect().left
    this._panel.classList.add('dragging')
    stopEvent(ev)
  }

  static onDragEnd(){
    if (this._resizing) {
      this._resizing = false
      this._panel.classList.remove('resizing')
      this.afterDragEnd()
      return
    }
    if (this._dragging) {
      this._dragging = false
      this._panel.classList.remove('dragging')
    }
  }
  static afterDragEnd(){}

}