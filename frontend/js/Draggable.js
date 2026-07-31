/**
 * Pour les objets déplaçable (horloge, panneau service, etc.)
 */
class Draggable {

  listenMove(handle, panel){
    this._panel = panel || handle
    listen(handle,   'mouseup', ev => { this.onDragEnd(); stopEvent(ev) })
    listen(handle,   'mousedown', this.onMoveHandleDown.bind(this))
    listen(document, 'mousemove', this.onDragMove.bind(this))
    listen(document, 'mouseup'  , this.onDragEnd.bind(this))
  }

  beforeDragMove(ev){}
  onDragMove(ev){
    this.beforeDragMove(ev)
    if (!this._dragging) return
    const dx = ev.clientX - this._dragStartX
    const maxLeft = window.innerWidth - this._panel.getBoundingClientRect().width
    const newLeft = Math.max(0, Math.min(maxLeft, this._panelStartLeft + dx))
    this._panel.style.left = newLeft + 'px'
    this.afterDragMove(ev)
  }
  afterDragMove(ev){}

  // Déplacement HORIZONTAL du panneau (le "bottom" CSS n'est jamais touché)
  // TODO Pouvoir définir la contrainte ('h', 'v' ou '')
  onMoveHandleDown(ev){
    this._dragging       = true
    this._dragStartX     = ev.clientX
    this._panelStartLeft = this._panel.getBoundingClientRect().left
    this._panel.classList.add('dragging')
    stopEvent(ev)
  }

  onDragEnd(){
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
  afterDragEnd(){}

}